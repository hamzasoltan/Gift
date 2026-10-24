"use client";

import { useMemo, useState } from "react";
import type { PortfolioWork } from "@/types/content";

const categoryNames: Record<string, string> = {
  "gift-packaging": "بوكسات وتغليف",
  printing: "طباعة",
  "wax-seals": "أختام الشمع",
  advertising: "دعاية وإعلان",
};
const categoryName = (key: string) => categoryNames[key] || key;

export default function PortfolioGallery({ works, whatsappNumber }: { works: PortfolioWork[]; whatsappNumber: string }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selected, setSelected] = useState<PortfolioWork | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const categories = useMemo(() => Array.from(new Set(works.map((work) => work.category).filter(Boolean))), [works]);
  const filtered = activeCategory === "all" ? works : works.filter((work) => work.category === activeCategory);
  const featured = filtered.filter((work) => work.featured);
  const regular = filtered.filter((work) => !work.featured);
  const visible = [...featured, ...regular].slice(0, visibleCount);
  const whatsappLink = (work: PortfolioWork) => {
    const message = work.whatsappMessage?.ar || `مرحبًا Gift، أريد الاستفسار عن العمل: ${work.title.ar}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };
  const openWork = (work: PortfolioWork) => { setSelected(work); setActiveImage(0); };
  return <>
    <div className="portfolio-toolbar" aria-label="فلترة الأعمال">
      <button type="button" className={activeCategory === "all" ? "portfolio-filter active" : "portfolio-filter"} onClick={() => { setActiveCategory("all"); setVisibleCount(6); }}>كل الأعمال <span>{works.length}</span></button>
      {categories.map((category) => <button type="button" key={category} className={activeCategory === category ? "portfolio-filter active" : "portfolio-filter"} onClick={() => { setActiveCategory(category); setVisibleCount(6); }}>{categoryName(category)} <span>{works.filter((work) => work.category === category).length}</span></button>)}
    </div>
    {visible.length ? <div className="work-grid" aria-label="معرض أعمال Gift">
      {visible.map((work, index) => <article className={`work-card ${work.featured ? "work-card-featured" : ""}`} key={work.id}>
        <button type="button" className="work-card-open" onClick={() => openWork(work)} aria-label={`عرض تفاصيل ${work.title.ar}`}>
          <div className="work-image-wrap">{work.images.filter((image) => typeof image === "string" && image.trim()).slice(0, 1).map((image) => <img className="work-image" key={image} src={image} alt={work.title.ar || "عمل من أعمال Gift"} loading="lazy" />)}
            {work.featured ? <span className="work-featured-badge">عمل مميز</span> : null}
          </div>
          <div className="work-caption"><div className="work-caption-top"><span>{String(index + 1).padStart(2, "0")}</span><span className="work-category">{categoryName(work.category)}</span></div><h3>{work.title.ar}</h3>{work.description?.ar ? <p>{work.description.ar}</p> : null}<span className="work-details-link">عرض التفاصيل <span aria-hidden="true">↗</span></span></div>
        </button>
      </article>)}
    </div> : <p className="work-empty">لا توجد أعمال منشورة في هذا التصنيف حاليًا.</p>}
    {visibleCount < filtered.length ? <div className="portfolio-more-wrap"><button className="button button-secondary" type="button" onClick={() => setVisibleCount((count) => count + 6)}>عرض المزيد من الأعمال</button></div> : null}
    {selected ? <div className="portfolio-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="portfolio-modal" role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title">
        <button className="portfolio-modal-close" type="button" onClick={() => setSelected(null)} aria-label="إغلاق">×</button>
        <div className="portfolio-modal-gallery">
          {selected.images.filter((image) => typeof image === "string" && image.trim()).map((image, index) => <button type="button" className={activeImage === index ? "modal-thumb active" : "modal-thumb"} key={image} onClick={() => setActiveImage(index)} aria-label={`عرض الصورة ${index + 1}`}><img src={image} alt="" /></button>)}
          {selected.images.filter((image) => typeof image === "string" && image.trim()).length ? <img className="portfolio-modal-main-image" src={selected.images.filter((image) => typeof image === "string" && image.trim())[activeImage] || selected.images[0]} alt={selected.title.ar} /> : null}
        </div>
        <div className="portfolio-modal-content"><span className="eyebrow">{categoryName(selected.category)}</span><h2 id="portfolio-modal-title">{selected.title.ar}</h2>{selected.description?.ar ? <p>{selected.description.ar}</p> : null}<a className="button button-primary" href={whatsappLink(selected)} target="_blank" rel="noreferrer">استفسر عن عمل مشابه عبر واتساب <span aria-hidden="true">↗</span></a></div>
      </section>
    </div> : null}
  </>;
}
