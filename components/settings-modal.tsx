// components/settings-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { useLanguage } from "./language-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input"; // اضافه شدن Input
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ChatSettings {
  systemInstruction: string;
  model: string;
  temperature: any;
}

const defaultSettings: ChatSettings = {
  systemInstruction: "",
  model: "gpt-4o-mini",
  temperature: 0.7,
};

const PREDEFINED_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];

interface SettingsModalProps {
  onSettingsChange: (settings: ChatSettings) => void;
}

export function SettingsModal({ onSettingsChange }: SettingsModalProps) {
  const { language, direction } = useLanguage();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelInput, setCustomModelInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("luxo-settings");
    if (saved) {
      const parsed = JSON.parse(saved) as ChatSettings;
      setSettings(parsed);
      
      if (!PREDEFINED_MODELS.includes(parsed.model)) {
        setIsCustomModel(true);
        setCustomModelInput(parsed.model);
      }
      
      onSettingsChange(parsed);
    }
  }, []);

  const handleSave = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    localStorage.setItem("luxo-settings", JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  };

  const handleModelSelectChange = (val: any) => {
    if (val === "custom") {
      setIsCustomModel(true);
      handleSave({ ...settings, model: customModelInput || "" });
    } else {
      setIsCustomModel(false);
      handleSave({ ...settings, model: val });
    }
  };

  const handleCustomModelType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setCustomModelInput(val);
    handleSave({ ...settings, model: val });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button 
          variant="ghost" 
          size="icon" 
          title={language === "fa" ? "تنظیمات" : "Settings"}
        >
          <Settings2 className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>

      <DialogContent dir={direction} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{language === "fa" ? "تنظیمات چت" : "Chat Settings"}</DialogTitle>
          <DialogDescription>
            {language === "fa" 
              ? "رفتار و مدل هوش مصنوعی Luxo را شخصی‌سازی کنید." 
              : "Customize how Luxo AI behaves and responds."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          
          <div className="grid gap-3">
            <Label htmlFor="model">{language === "fa" ? "مدل هوش مصنوعی" : "AI Model"}</Label>
            
            <Select 
              value={isCustomModel ? "custom" : settings.model} 
              onValueChange={handleModelSelectChange}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent dir={direction}>
                <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (Fastest & Vision)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheaper)</SelectItem>
                <SelectItem value="custom" className="text-primary font-medium">
                  {language === "fa" ? "+ وارد کردن دستی مدل (Custom)" : "+ Enter custom model manually"}
                </SelectItem>
              </SelectContent>
            </Select>

            {isCustomModel && (
              <div className="mt-1 animate-in fade-in slide-in-from-top-2">
                <Input 
                  placeholder={language === "fa" ? "مثال: gpt-4o-mini" : "e.g., gpt-4o-mini"} 
                  value={customModelInput}
                  onChange={handleCustomModelType}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {language === "fa" 
                    ? "دقت کنید که نام مدل باید دقیقاً با نام‌های رسمی OpenAI (مثل o1-preview) مطابقت داشته باشد." 
                    : "Ensure the model name exactly matches official OpenAI model IDs (e.g., o1-preview)."}
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>{language === "fa" ? "میزان خلاقیت (Temperature)" : "Creativity (Temperature)"}</Label>
              <span className="text-sm text-muted-foreground font-mono">{settings.temperature}</span>
            </div>
            <Slider
              value={[settings.temperature]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={(val) => {
                handleSave({ ...settings, temperature: val })
              }}
            />
            <p className="text-xs text-muted-foreground">
              {language === "fa" 
                ? "مقدار کمتر = دقیق‌تر و منطقی‌تر | مقدار بیشتر = خلاقانه‌تر." 
                : "Lower = more precise/logical | Higher = more creative."}
            </p>
          </div>

          {/* 3. System Instructions */}
          <div className="grid gap-2">
            <Label htmlFor="instruction">
              {language === "fa" ? "دستورالعمل سیستم (System Instruction)" : "System Instructions"}
            </Label>
            <Textarea
              id="instruction"
              placeholder={
                language === "fa"
                  ? "مثال: تو یک برنامه‌نویس ارشد ریکت هستی. کدهای کوتاه و بهینه بنویس."
                  : "e.g., You are a senior React developer. Write concise, optimal code."
              }
              className="resize-none h-24 text-sm"
              value={settings.systemInstruction}
              onChange={(e) => handleSave({ ...settings, systemInstruction: e.target.value })}
            />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}