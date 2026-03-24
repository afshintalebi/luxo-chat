// components/header.tsx
"use client";

import { Moon, Sun, Globe, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "./language-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// We pass a callback to handle clearing the chat history
interface HeaderProps {
  onNewChat: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  
  // To prevent hydration mismatch for the theme toggle icon
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-14 px-4 border-b shrink-0 bg-background/70 backdrop-blur-xl">
      {/* Brand / Logo Area */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Luxo
        </h1>
      </div>

      {/* Controls Area */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* New Chat Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNewChat} 
          title={language === 'fa' ? 'چت جدید' : 'New Chat'}
        >
          <Plus className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">New Chat</span>
        </Button>

        {/* Language Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleLanguage} 
          title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
        >
          <Globe className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Toggle Language</span>
        </Button>

        {/* Theme Toggle Button */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={language === 'fa' ? 'تغییر تم' : 'Toggle Theme'}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            )}
            <span className="sr-only">Toggle Theme</span>
          </Button>
        )}
      </div>
    </header>
  );
}