"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of our context
type Language = "en" | "fa";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>({
    language: 'fa',
    direction: 'rtl',
    toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on first load
  useEffect(() => {
    const savedLang = localStorage.getItem("luxo-language") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "fa" : "en";
    setLanguage(newLang);
    localStorage.setItem("luxo-language", newLang);
  };

  const direction: Direction = language === "fa" ? "rtl" : "ltr";

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      <div dir={direction} className={language === "fa" ? "font-farsi" : "font-english"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context easily
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};