import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";

// English Font setup
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

// Persian Font setup
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
    // Suppress hydration warning is required for next-themes
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansArabic.variable} antialiased bg-background text-foreground transition-colors duration-300`}
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