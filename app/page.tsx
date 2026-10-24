"use client";

import { useEffect, useState } from "react";
import { portfolio, services, site } from "@/lib/content";
import PortfolioGallery from "@/components/PortfolioGallery";

type Locale = "ar" | "en";
const copy = {
 ar: { navServices:"خدماتنا", navAbout:"عن Gift", navWork:"من أعمالنا", contact:"اطلب عبر واتساب", eyebrow:"تغليف · طباعة · تفاصيل تصنع الفرق", title:"هدايا تحمل هويتك", intro:"من بوكسات الهدايا وأختام الشمع إلى الطباعة والدعاية والإعلان، نصنع تفاصيل تعبّر عنك وعن علامتك التجارية.", servicesTitle:"خدماتنا", servicesIntro:"حلول مخصصة للأفراد والشركات، بتفاصيل تناسب مناسبتك وهويتك.", aboutTitle:"كل تفصيلة لها قيمة", aboutText:"في Gift نهتم بالتفاصيل التي تجعل الهدية والتغليف والمطبوعات أقرب إلى هويتك. نعمل مع الأفراد والشركات على تنفيذ أفكار مخصصة حسب الطلب.", workTitle:"لمحات من أعمالنا", workText:"نماذج من أعمال Gift الحقيقية.", workEmpty:"سيتم عرض الأعمال هنا بعد نشرها من لوحة التحكم.", ctaTitle:"عندك فكرة؟ خلّينا ننفذها.", ctaText:"احكيلنا عن طلبك، ونساعدك تختار التفاصيل المناسبة.", footer:"كل الحقوق محفوظة لـ Gift.", benefits:[["تخصيص حسب الطلب","أسماء وتصميمات وشعارات تعكس فكرتك."],["للأفراد والشركات","حلول مرنة للمناسبات والهوية التجارية."],["اهتمام بالتفاصيل","اختيارات مدروسة للتغليف والخامات والطباعة."]], inquiry:"مرحبًا Gift، أريد الاستفسار عن خدماتكم.", request:"مرحبًا Gift، أريد طلب خدمة.", idea:"مرحبًا Gift، لدي فكرة وأريد الاستفسار عن تنفيذها.", aboutServices:"استفسر عن الخدمة", imagePlaceholder:"صورة حقيقية من أعمال Gift", caption:"تفاصيل مصممة خصيصًا لك", theme:"تبديل الوضع" },
 en: { navServices:"Services", navAbout:"About Gift", navWork:"Our Work", contact:"Contact on WhatsApp", eyebrow:"PACKAGING · PRINTING · DETAILS THAT MATTER", title:"Gifts that carry your identity", intro:"From gift boxes and wax seals to printing and promotion, we create thoughtful details that reflect you and your brand.", servicesTitle:"Our Services", servicesIntro:"Tailored solutions for individuals and businesses, designed around your occasion and identity.", aboutTitle:"Every detail matters", aboutText:"At Gift, we focus on the details that make gifts, packaging, and printed materials feel personal to your identity. We work with individuals and businesses to bring custom ideas to life.", workTitle:"A glimpse of our work", workText:"A selection of real Gift projects.", workEmpty:"Projects will appear here once published from the control panel.", ctaTitle:"Have an idea? Let’s make it happen.", ctaText:"Tell us what you have in mind and we’ll help you choose the right details.", footer:"All rights reserved by Gift.", benefits:[["Made to order","Names, designs, and logos that express your idea."],["For people and businesses","Flexible solutions for occasions and brand identity."],["Attention to detail","Thoughtful choices in packaging, materials, and print."]], inquiry:"Hello Gift, I would like to ask about your services.", request:"Hello Gift, I would like to request a service.", idea:"Hello Gift, I have an idea and would like to discuss it.", aboutServices:"Ask about this service", imagePlaceholder:"Real work by Gift", caption:"Details made just for you", theme:"Toggle theme" }
};
function whatsappUrl(message: string) { return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`; }

export default function HomePage() {
 const [locale, setLocale] = useState<Locale>("ar");
 const [mounted, setMounted] = useState(false);
 useEffect(() => {
   const saved = window.localStorage.getItem("gift-locale");
   const next: Locale = saved === "en" ? "en" : "ar";
   setLocale(next); setMounted(true);
 }, []);
 useEffect(() => {
   if (!mounted) return;
   document.documentElement.lang = locale;
   document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
   document.documentElement.setAttribute("data-locale", locale);
   window.localStorage.setItem("gift-locale", locale);
 }, [locale, mounted]);
 const t = copy[locale];
 const publishedWorks = portfolio.filter((work) => work.status === "published" && Array.isArray(work.images) && work.images.some((image) => typeof image === "string" && image.trim().length > 0));
 return <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={locale === "en" ? "site-locale-en" : "site-locale-ar"}>
  <header className="site-header container"><a className="brand" href="#top" aria-label="Gift - Home">Gift<span>.</span></a><nav className="main-nav" aria-label={locale === "ar" ? "القائمة الرئيسية" : "Main navigation"}><a href="#services">{t.navServices}</a><a href="#about">{t.navAbout}</a><a href="#work">{t.navWork}</a></nav><div className="header-actions"><button className="theme-toggle" type="button" disabled aria-label={t.theme}>◐</button><button className="language-toggle" type="button" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{locale === "ar" ? "EN" : "عربي"}</button><a className="button button-primary header-cta" href={whatsappUrl(t.inquiry)} target="_blank" rel="noreferrer">{t.contact}</a></div></header>
  <section className="hero container" id="top"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="hero-description">{t.intro}</p><div className="hero-actions"><a className="button button-primary" href={whatsappUrl(t.request)} target="_blank" rel="noreferrer">{t.contact} <span aria-hidden="true">↗</span></a><a className="button button-secondary" href="#services">{t.navServices}</a></div><p className="pricing-note">{site.pricingNote[locale] || site.pricingNote.ar}</p></div><div className="hero-art" role="img" aria-label={t.imagePlaceholder}><div className="image-placeholder"><span>G</span><small>{t.imagePlaceholder}</small></div><div className="hero-caption"><span className="caption-dot" /> {t.caption}</div></div></section>
  <section className="section container" id="services"><div className="section-heading"><p className="eyebrow">GIFT SERVICES</p><h2>{t.servicesTitle}</h2><p>{t.servicesIntro}</p></div><div className="services-grid">{services.filter(service=>service.active).map((service,index)=><article className="service-card" key={service.id}><div className={`service-visual service-visual-${index+1}`} aria-hidden="true"><span>{String(index+1).padStart(2,"0")}</span></div><div className="service-content"><h3>{service.name[locale] || service.name.ar}</h3><p>{service.description[locale] || service.description.ar}</p><a href={whatsappUrl(service.whatsappMessage[locale] || service.whatsappMessage.ar)} target="_blank" rel="noreferrer" className="text-link">{t.aboutServices} <span aria-hidden="true">↗</span></a></div></article>)}</div></section>
  <section className="about-section" id="about"><div className="container about-grid"><div><p className="eyebrow">ABOUT GIFT</p><h2>{t.aboutTitle}</h2></div><p className="about-text">{t.aboutText}</p></div></section>
  <section className="section container" id="work"><div className="section-heading section-heading-row"><div><p className="eyebrow">SELECTED WORK</p><h2>{t.workTitle}</h2></div><p>{t.workText}</p></div><PortfolioGallery works={publishedWorks} whatsappNumber={site.whatsappNumber} locale={locale} /></section>
  <section className="benefits container">{t.benefits.map((benefit,index)=><div key={benefit[0]}><span className="benefit-number">{String(index+1).padStart(2,"0")}</span><h3>{benefit[0]}</h3><p>{benefit[1]}</p></div>)}</section>
  <section className="cta-section container"><div><p className="eyebrow">LET’S CREATE SOMETHING</p><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><a className="button button-light" href={whatsappUrl(t.idea)} target="_blank" rel="noreferrer">{t.contact} <span aria-hidden="true">↗</span></a></section>
  <footer className="site-footer container"><div><a className="brand" href="#top">Gift<span>.</span></a><p>{t.footer}</p></div><div className="social-links"><a href={site.socialLinks.facebook} target="_blank" rel="noreferrer">Facebook ↗</a><a href={site.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div><a className="footer-whatsapp" href={whatsappUrl(t.inquiry)} target="_blank" rel="noreferrer">WhatsApp ↗</a></footer>
 </main>;
}
