import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: "--font-noto-sans-arabic", 
});

export const metadata: Metadata = {
  title: "Luxo Chat",
  description: "A premium, minimalist personal AI assistant powered by OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={notoSansArabic.variable}>
      <body
        className={`antialiased bg-background text-foreground transition-colors duration-300`}
        style={{ fontFamily: 'var(--font-noto-sans-arabic), Tahoma, Arial, sans-serif' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {/* Main content wrapper */}
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}