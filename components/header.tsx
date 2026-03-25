"use client";

import { Moon, Sun, Globe, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "./language-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SettingsModal, ChatSettings } from "./settings-modal";

interface HeaderProps {
  onNewChat: () => void;
  onSettingsChange: (settings: ChatSettings) => void;
}

export function Header({ onNewChat, onSettingsChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-14 px-4 border-b shrink-0 bg-background/70 backdrop-blur-xl">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Luxo
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Settings Button Modal */}
        {mounted && <SettingsModal onSettingsChange={onSettingsChange} />}

        {/* New Chat */}
        <Button variant="ghost" size="icon" onClick={onNewChat} title={language === 'fa' ? 'چت جدید' : 'New Chat'}>
          <Plus className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>

        {/* Language */}
        <Button variant="ghost" size="icon" onClick={toggleLanguage} title={language === 'fa' ? 'English' : 'فارسی'}>
          <Globe className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>

        {/* Theme */}
        {mounted && (
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </Button>
        )}
      </div>
    </header>
  );
}