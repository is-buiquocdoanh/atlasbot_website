import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { routing, type Locale } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Dùng cho tiêu đề sản phẩm/heading (trang Shop) — không hỗ trợ subset
// "vietnamese" trên Google Fonts, chữ có dấu sẽ tự rơi về font-inter trong
// fallback stack (xem fontFamily.display trong tailwind.config.ts).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Atlasbot — Kiến thức & Thiết bị AMR/AGV",
  description: "Blog kỹ thuật, dự án robotics và shop linh kiện AMR/AGV.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-10 min-h-[70vh]">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
