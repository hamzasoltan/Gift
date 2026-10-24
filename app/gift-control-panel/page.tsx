"use client";

import { useCallback, useEffect, useState } from "react";
import type { PortfolioWork, Service, LocalizedText } from "@/types/content";

type FileKey = "site" | "services" | "portfolio";
type FileState = { sha: string; content: string };
type Payload = { files: Record<FileKey, FileState>; branch: string };
type SiteContent = {
  brandName: string;
  whatsappNumber: string;
  socialLinks: { facebook: string; instagram: string };
  defaultLocale: "ar" | "en";
  defaultTheme: string;
  pricingNote: LocalizedText;
};
type EditorData = { site: SiteContent; services: Service[]; portfolio: PortfolioWork[] };

const names: Record<FileKey, string> = { site: "بيانات الموقع", services: "الخدمات", portfolio: "معرض الأعمال" };
const blankLocalized = (): LocalizedText => ({ ar: "", en: "" });
const newService = (): Service => ({
  id: `service-${Date.now()}`, slug: `service-${Date.now()}`, name: blankLocalized(),
  description: blankLocalized(), image: "", whatsappMessage: blankLocalized(), active: true,
});
const newWork = (): PortfolioWork => ({
  id: `work-${Date.now()}`, title: blankLocalized(), category: "", description: blankLocalized(),
  images: [], badge: blankLocalized(), featured: false, whatsappMessage: blankLocalized(), status: "draft",
});

export default function GiftControlPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [files, setFiles] = useState<Payload["files"] | null>(null);
  const [active, setActive] = useState<FileKey>("site");
  const [selectedService, setSelectedService] = useState(0);
  const [selectedWork, setSelectedWork] = useState(0);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [commitUrl, setCommitUrl] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/gift-admin", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تحميل المحتوى");
      setFiles(data.files);
      setAuthenticated(true);
    } catch (e) {
      setAuthenticated(false);
      setStatus(e instanceof Error && e.message !== "Unauthorized" ? e.message : "سجّل دخولك لعرض محتوى الموقع.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function readData(): EditorData | null {
    if (!files) return null;
    try {
      return {
        site: JSON.parse(files.site.content) as SiteContent,
        services: JSON.parse(files.services.content) as Service[],
        portfolio: JSON.parse(files.portfolio.content) as PortfolioWork[],
      };
    } catch {
      return null;
    }
  }

  function updateFile<K extends FileKey>(key: K, value: EditorData[K]) {
    setFiles((old) => old ? { ...old, [key]: { ...old[key], content: JSON.stringify(value, null, 2) } } : old);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/gift-admin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تسجيل الدخول");
      setPassword("");
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "تعذر تسجيل الدخول");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!files) return;
    setBusy(true);
    setStatus("");
    setCommitUrl("");
    try {
      const content = JSON.parse(files[active].content);
      const res = await fetch("/api/gift-admin", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: active, content, sha: files[active].sha }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "فشل الحفظ");
      setStatus("تم حفظ التعديلات في GitHub. جارٍ تحديث نسخة الموقع على Vercel.");
      setCommitUrl(result.commitUrl || "");
      const refreshed = await fetch("/api/gift-admin", { cache: "no-store" });
      const freshData = await refreshed.json();
      if (refreshed.ok) setFiles(freshData.files);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "فشل الحفظ. راجع البيانات وحاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/gift-admin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setFiles(null);
    setAuthenticated(false);
    setStatus("تم تسجيل الخروج.");
  }

  const data = readData();
  const site = data?.site;
  const services = data?.services ?? [];
  const works = data?.portfolio ?? [];
  const service = services[selectedService];
  const work = works[selectedWork];

  function patchService(patch: Partial<Service>) {
    if (!service) return;
    updateFile("services", services.map((item, index) => index === selectedService ? { ...item, ...patch } : item));
  }
  function patchServiceText(field: "name" | "description" | "whatsappMessage", locale: "ar" | "en", value: string) {
    if (!service) return;
    patchService({ [field]: { ...service[field], [locale]: value } });
  }
  function patchWork(patch: Partial<PortfolioWork>) {
    if (!work) return;
    updateFile("portfolio", works.map((item, index) => index === selectedWork ? { ...item, ...patch } : item));
  }
  function patchWorkText(field: "title" | "description" | "badge" | "whatsappMessage", locale: "ar" | "en", value: string) {
    if (!work) return;
    patchWork({ [field]: { ...work[field], [locale]: value } });
  }

  return (
    <main className="admin-shell" dir="rtl">
      <div className="admin-top"><a href="/" className="admin-brand">Gift<span>.</span></a><span className="admin-kicker">لوحة إدارة المحتوى</span></div>
      <section className="admin-card">
        <div className="admin-heading">
          <p className="admin-eyebrow">GIFT / CONTENT STUDIO</p>
          <h1>{authenticated ? "إدارة الموقع" : "دخول الإدارة"}</h1>
          <p>{authenticated ? "عدّل المحتوى من حقول واضحة، ثم احفظه لنشر التحديثات." : "لوحة خاصة بصاحب الموقع. سجّل الدخول للمتابعة."}</p>
        </div>

        {!authenticated ? (
          <form className="admin-login" onSubmit={login}>
            <label htmlFor="admin-password">كلمة مرور الإدارة</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={12} placeholder="أدخل كلمة المرور" />
            <button className="admin-primary" disabled={busy}>{busy ? "جارٍ التحقق…" : "تسجيل الدخول"}</button>
          </form>
        ) : !data || !site ? (
          <p className="admin-status error">تعذر قراءة بيانات الإدارة. أعد تحميل المحتوى من جديد.</p>
        ) : (
          <>
            <div className="admin-toolbar">
              <div className="admin-tabs">{(Object.keys(names) as FileKey[]).map((key) => (
                <button type="button" key={key} onClick={() => { setActive(key); setStatus(""); setCommitUrl(""); }} className={active === key ? "admin-tab active" : "admin-tab"}>{names[key]}</button>
              ))}</div>
              <button type="button" className="admin-logout" onClick={logout}>تسجيل الخروج</button>
            </div>

            {active === "site" && (
              <div className="admin-form">
                <div className="admin-section-title"><div><h2>بيانات الموقع</h2><p>بيانات التواصل التي تظهر للزوار.</p></div><span className="admin-count">إعدادات عامة</span></div>
                <div className="admin-fields">
                  <label className="admin-field"><span>اسم العلامة التجارية</span><input value={site.brandName} onChange={(e) => updateFile("site", { ...site, brandName: e.target.value })} /></label>
                  <label className="admin-field"><span>رقم واتساب الدولي</span><input inputMode="tel" dir="ltr" value={site.whatsappNumber} onChange={(e) => updateFile("site", { ...site, whatsappNumber: e.target.value.replace(/[^0-9]/g, "") })} placeholder="201xxxxxxxxx" /><small>اكتب الرقم بأرقام فقط مع كود الدولة، من غير + أو مسافات.</small></label>
                  <label className="admin-field"><span>رابط Facebook</span><input dir="ltr" type="url" value={site.socialLinks.facebook} onChange={(e) => updateFile("site", { ...site, socialLinks: { ...site.socialLinks, facebook: e.target.value } })} /></label>
                  <label className="admin-field"><span>رابط Instagram</span><input dir="ltr" type="url" value={site.socialLinks.instagram} onChange={(e) => updateFile("site", { ...site, socialLinks: { ...site.socialLinks, instagram: e.target.value } })} /></label>
                  <label className="admin-field"><span>اللغة الافتراضية</span><select value={site.defaultLocale} onChange={(e) => updateFile("site", { ...site, defaultLocale: e.target.value as "ar" | "en" })}><option value="ar">العربية</option><option value="en">English</option></select></label>
                  <label className="admin-field"><span>ملاحظة الأسعار — عربي</span><input value={site.pricingNote.ar} onChange={(e) => updateFile("site", { ...site, pricingNote: { ...site.pricingNote, ar: e.target.value } })} /></label>
                  <label className="admin-field"><span>ملاحظة الأسعار — English</span><input dir="ltr" value={site.pricingNote.en} onChange={(e) => updateFile("site", { ...site, pricingNote: { ...site.pricingNote, en: e.target.value } })} /></label>
                </div>
              </div>
            )}

            {active === "services" && (
              <div className="admin-form">
                <div className="admin-section-title"><div><h2>إدارة الخدمات</h2><p>أضف خدمة أو عدّل وصفها وروابط التواصل.</p></div><span className="admin-count">{services.length} خدمات</span></div>
                <div className="admin-manager">
                  <aside className="admin-record-list">
                    {services.map((item, index) => <button type="button" key={item.id} className={selectedService === index ? "admin-record active" : "admin-record"} onClick={() => setSelectedService(index)}><span className="record-index">{String(index + 1).padStart(2, "0")}</span><span className="record-copy"><strong>{item.name.ar || "خدمة بدون اسم"}</strong><small>{item.active ? "ظاهرة بالموقع" : "مخفية"}</small></span><span className={item.active ? "state-dot on" : "state-dot"} /></button>)}
                    <button type="button" className="admin-add" onClick={() => { updateFile("services", [...services, newService()]); setSelectedService(services.length); }}>＋ إضافة خدمة</button>
                  </aside>
                  {service ? <div className="admin-record-editor">
                    <div className="admin-record-heading"><h3>تفاصيل الخدمة</h3><button type="button" className="admin-delete" onClick={() => { const next = services.filter((_, index) => index !== selectedService); updateFile("services", next); setSelectedService(Math.max(0, Math.min(selectedService, next.length - 1))); }}>حذف الخدمة</button></div>
                    <div className="admin-fields">
                      <label className="admin-field"><span>اسم الخدمة — عربي</span><input value={service.name.ar} onChange={(e) => patchServiceText("name", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>اسم الخدمة — English</span><input dir="ltr" value={service.name.en} onChange={(e) => patchServiceText("name", "en", e.target.value)} /></label>
                      <label className="admin-field"><span>الرابط المختصر (Slug)</span><input dir="ltr" value={service.slug} onChange={(e) => patchService({ slug: e.target.value })} /></label>
                      <label className="admin-field"><span>وصف الخدمة — عربي</span><textarea rows={3} value={service.description.ar} onChange={(e) => patchServiceText("description", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>وصف الخدمة — English</span><textarea dir="ltr" rows={3} value={service.description.en} onChange={(e) => patchServiceText("description", "en", e.target.value)} /></label>
                      <label className="admin-field"><span>رابط الصورة (URL)</span><input dir="ltr" type="url" value={service.image} onChange={(e) => patchService({ image: e.target.value })} placeholder="https://..." /><small>يُحفظ الرابط في بيانات الخدمة؛ عرض الصور على الموقع يحتاج تفعيلًا في واجهة الموقع.</small></label>
                      <label className="admin-field"><span>رسالة واتساب — عربي</span><textarea rows={2} value={service.whatsappMessage.ar} onChange={(e) => patchServiceText("whatsappMessage", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>رسالة واتساب — English</span><textarea dir="ltr" rows={2} value={service.whatsappMessage.en} onChange={(e) => patchServiceText("whatsappMessage", "en", e.target.value)} /></label>
                    </div>
                    <label className="admin-switch"><input type="checkbox" checked={service.active} onChange={(e) => patchService({ active: e.target.checked })} /><span className="switch-mark" /><span><strong>إظهار الخدمة في الموقع</strong><small>عند إيقافها ستختفي من قائمة الخدمات المعروضة.</small></span></label>
                  </div> : <div className="admin-empty">لا توجد خدمات بعد. اضغط «إضافة خدمة» للبدء.</div>}
                </div>
              </div>
            )}

            {active === "portfolio" && (
              <div className="admin-form">
                <div className="admin-section-title"><div><h2>معرض الأعمال</h2><p>إدارة عناوين المشاريع ووصفها وصورها.</p></div><span className="admin-count">{works.length} أعمال</span></div>
                <div className="admin-manager">
                  <aside className="admin-record-list">
                    {works.map((item, index) => <button type="button" key={item.id} className={selectedWork === index ? "admin-record active" : "admin-record"} onClick={() => setSelectedWork(index)}><span className="record-index">{String(index + 1).padStart(2, "0")}</span><span className="record-copy"><strong>{item.title.ar || "عمل بدون عنوان"}</strong><small>{item.status === "published" ? "منشور" : item.status === "archived" ? "مؤرشف" : "مسودة"}</small></span></button>)}
                    <button type="button" className="admin-add" onClick={() => { updateFile("portfolio", [...works, newWork()]); setSelectedWork(works.length); }}>＋ إضافة عمل</button>
                  </aside>
                  {work ? <div className="admin-record-editor">
                    <div className="admin-record-heading"><h3>تفاصيل العمل</h3><button type="button" className="admin-delete" onClick={() => { const next = works.filter((_, index) => index !== selectedWork); updateFile("portfolio", next); setSelectedWork(Math.max(0, Math.min(selectedWork, next.length - 1))); }}>حذف العمل</button></div>
                    <div className="admin-fields">
                      <label className="admin-field"><span>عنوان العمل — عربي</span><input value={work.title.ar} onChange={(e) => patchWorkText("title", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>عنوان العمل — English</span><input dir="ltr" value={work.title.en} onChange={(e) => patchWorkText("title", "en", e.target.value)} /></label>
                      <label className="admin-field"><span>التصنيف (اربطه بالخدمة عند الحاجة)</span><input value={work.category} onChange={(e) => patchWork({ category: e.target.value })} placeholder="gift-packaging" /></label>
                      <label className="admin-field"><span>الوصف — عربي</span><textarea rows={3} value={work.description.ar} onChange={(e) => patchWorkText("description", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>الوصف — English</span><textarea dir="ltr" rows={3} value={work.description.en} onChange={(e) => patchWorkText("description", "en", e.target.value)} /></label>
                      <label className="admin-field"><span>روابط الصور (كل رابط في سطر)</span><textarea dir="ltr" rows={4} value={work.images.join("\n")} onChange={(e) => patchWork({ images: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} placeholder="https://..." /><small>حط رابط كل صورة في سطر مستقل. رفع الصور مباشرة من الجهاز هنضيفه في مرحلة لاحقة.</small></label>
                      <label className="admin-field"><span>الشارة — عربي</span><input value={work.badge.ar} onChange={(e) => patchWorkText("badge", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>الشارة — English</span><input dir="ltr" value={work.badge.en} onChange={(e) => patchWorkText("badge", "en", e.target.value)} /></label>
                      <label className="admin-field"><span>رسالة واتساب — عربي</span><textarea rows={2} value={work.whatsappMessage.ar} onChange={(e) => patchWorkText("whatsappMessage", "ar", e.target.value)} /></label>
                      <label className="admin-field"><span>رسالة واتساب — English</span><textarea dir="ltr" rows={2} value={work.whatsappMessage.en} onChange={(e) => patchWorkText("whatsappMessage", "en", e.target.value)} /></label>
                      <label className="admin-field"><span>حالة العمل</span><select value={work.status} onChange={(e) => patchWork({ status: e.target.value as PortfolioWork["status"] })}><option value="draft">مسودة</option><option value="published">منشور</option><option value="archived">مؤرشف</option></select></label>
                    </div>
                    <label className="admin-switch"><input type="checkbox" checked={work.featured} onChange={(e) => patchWork({ featured: e.target.checked })} /><span className="switch-mark" /><span><strong>تمييز هذا العمل</strong><small>يحفظ علامة التمييز داخل بيانات المشروع.</small></span></label>
                  </div> : <div className="admin-empty">لا توجد أعمال بعد. اضغط «إضافة عمل» للبدء.</div>}
                </div>
              </div>
            )}

            <div className="admin-savebar"><div><strong>جاهز لحفظ التغييرات؟</strong><small>سيتم حفظ القسم الحالي فقط ثم يبدأ النشر التلقائي.</small></div><div className="admin-actions"><button type="button" className="admin-secondary" onClick={() => void load()} disabled={busy}>إعادة تحميل</button><button type="button" className="admin-primary" onClick={save} disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ ونشر التعديلات"}</button></div></div>
          </>
        )}
        {status && <p className={status.includes("فشل") || status.includes("تعذر") || status.includes("خطأ") ? "admin-status error" : "admin-status"} role="status">{status}</p>}
        {commitUrl && <a className="admin-commit" href={commitUrl} target="_blank" rel="noreferrer">عرض عملية الحفظ على GitHub ↗</a>}
        <div className="admin-footer"><a href="https://github.com/hamzasoltan/Gift" target="_blank" rel="noreferrer">GitHub</a><span>•</span><a href="https://gift-gamma-eight.vercel.app/" target="_blank" rel="noreferrer">عرض الموقع</a></div>
      </section>
    </main>
  );
}
