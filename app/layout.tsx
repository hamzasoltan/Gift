import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gift | هدايا تحمل هويتك",
  description: "تغليف الهدايا والبوكسات، أختام الشمع، الطباعة، والدعاية والإعلان — Gift Egypt.",
  metadataBase: new URL("https://gift-egypt.vercel.app"),
  openGraph: { title: "Gift | هدايا تحمل هويتك", description: "تغليف الهدايا والطباعة وأختام الشمع والدعاية والإعلان.", type: "website", locale: "ar_EG" }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0E1626" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" data-theme="dark" suppressHydrationWarning><body>{children}</body></html>;
}
