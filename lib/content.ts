import servicesData from "@/data/services.json";
import portfolioData from "@/data/portfolio.json";
import siteData from "@/data/site.json";
import type { PortfolioWork, Service } from "@/types/content";
export const site = siteData;
export const services = servicesData as Service[];
export const portfolio = portfolioData as PortfolioWork[];
