"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortfolioWork } from "@/types/content";

type Locale = "ar" | "en";
const categoryNames: Record<string, Record<Locale, string>> = {
  "gift-packaging": { ar: "بوكسات وتغليف", en: "Gift Wrapping & Boxes" },
  printing: { ar: "طباعة", en: "Printing" },
  "wax-seals": { ar: "أختام الشمع", en: "Wax Seals & Supplies" },
  advertising: { ar: "دعاية وإعلان", en: "Advertising & Promotion" },
};
const categoryName = (key: string, locale: Locale) => categoryNames[key]?.[locale] || key;

export default function PortfolioGallery({ works, whatsappNumber, locale = "ar" }: { works: PortfolioWork[]; whatsappNumber: string; locale?: Locale }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selected, setSelected] = useState<PortfolioWork | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const t = locale === "ar" ? { all: "كل الأعمال", featured: "عمل مميز", details: "عرض التفاصيل", more: "عرض المزيد من الأعمال", empty: "لا توجد أعمال منشورة في هذا التصنيف حاليًا.", inquire: "استفسر عن عمل مشابه عبر واتساب", close: "إغلاق", image: "عرض الصورة" } : { all: "All work", featured: "Featured", details: "View details", more: "Load more work", empty: "There are no published projects in this category yet.", inquire: "Ask about a similar project on WhatsApp", close: "Close", image: "View image" };
  const categories = useMemo(() => Array.from(new Set(works.map((work) => work.category).filter(Boolean))), [works]);
  const filtered = activeCategory === "all" ? works : works.filter((work) => work.category === activeCategory);
  const visible = [...filtered.filter((work) => work.featured), ...filtered.filter((work) => !work.featured)].slice(0, visibleCount);
  const whatsappLink = (work: PortfolioWork) => {
    const message = work.whatsappMessage?.[locale] || `Hello Gift, I would like to ask about: ${work.title[locale] || work.title.ar}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };
  const openWork = (work: PortfolioWork) => { setSelected(work); setActiveImage(0); };
  const workTitle = (work: PortfolioWork) => work.title[locale] || work.title.ar;
  const workDescription = (work: PortfolioWork) => work.description?.[locale] || work.description?.ar || "";
  return <>
    <div className="portfolio-toolbar" aria-label={locale === "ar" ? "فلترة الأعمال" : "Filter projects"}>
      <button type="button" className={activeCategory === "all" ? "portfolio-filter active" : "portfolio-filter"} onClick={() => { setActiveCategory("all"); setVisibleCount(6); }}>{t.all} <span>{works.length}</span></button>
      {categories.map((category) => <button type="button" key={category} className={activeCategory === category ? "portfolio-filter active" : "portfolio-filter"} onClick={() => { setActiveCategory(category); setVisibleCount(6); }}>{categoryName(category, locale)} <span>{works.filter((work) => work.category === category).length}</span></button>)}
    </div>
    {visible.length ? <div className="work-grid" aria-label={locale === "ar" ? "معرض أعمال Gift" : "Gift portfolio"}>
      {visible.map((work, index) => <article className={`work-card ${work.featured ? "work-card-featured" : ""}`} key={work.id}>
        <button type="button" className="work-card-open" onClick={() => openWork(work)} aria-label={`${t.details}: ${workTitle(work)}`}>
          <div className="work-image-wrap">{work.images.filter((image) => typeof image === "string" && image.trim()).slice(0, 1).map((image) => <img className="work-image" key={image} src={image} alt={workTitle(work)} loading="lazy" />)}
            {work.featured ? <span className="work-featured-badge">{t.featured}</span> : null}
          </div>
          <div className="work-caption"><div className="work-caption-top"><span>{String(index + 1).padStart(2, "0")}</span><span className="work-category">{categoryName(work.category, locale)}</span></div><h3>{workTitle(work)}</h3>{workDescription(work) ? <p>{workDescription(work)}</p> : null}<span className="work-details-link">{t.details} <span aria-hidden="true">↗</span></span></div>
        </button>
      </article>)}
    </div> : <p className="work-empty">{t.empty}</p>}
    {visibleCount < filtered.length ? <div className="portfolio-more-wrap"><button className="button button-secondary" type="button" onClick={() => setVisibleCount((count) => count + 6)}>{t.more}</button></div> : null}
    {selected ? <div className="portfolio-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="portfolio-modal" role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title">
        <button className="portfolio-modal-close" type="button" onClick={() => setSelected(null)} aria-label={t.close}>×</button>
        <div className="portfolio-modal-gallery">
          {selected.images.filter((image) => typeof image === "string" && image.trim()).map((image, index) => <button type="button" className={activeImage === index ? "modal-thumb active" : "modal-thumb"} key={image} onClick={() => setActiveImage(index)} aria-label={`${t.image} ${index + 1}`}><img src={image} alt="" /></button>)}
          {selected.images.filter((image) => typeof image === "string" && image.trim()).length ? <img className="portfolio-modal-main-image" src={selected.images.filter((image) => typeof image === "string" && image.trim())[activeImage] || selected.images[0]} alt={workTitle(selected)} /> : null}
        </div>
        <div className="portfolio-modal-content"><span className="eyebrow">{categoryName(selected.category, locale)}</span><h2 id="portfolio-modal-title">{workTitle(selected)}</h2>{workDescription(selected) ? <p>{workDescription(selected)}</p> : null}<a className="button button-primary" href={whatsappLink(selected)} target="_blank" rel="noreferrer">{t.inquire} <span aria-hidden="true">↗</span></a></div>
      </section>
    </div> : null}
  </>;
}
