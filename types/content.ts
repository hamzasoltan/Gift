export type Locale = "ar" | "en";
export type LocalizedText = Record<Locale, string>;
export type Service = { id:string; slug:string; name:LocalizedText; description:LocalizedText; image:string; whatsappMessage:LocalizedText; active:boolean };
export type PortfolioWork = { id:string; title:LocalizedText; category:string; description:LocalizedText; images:string[]; badge:LocalizedText; featured:boolean; whatsappMessage:LocalizedText; status:"draft"|"published"|"archived" };
