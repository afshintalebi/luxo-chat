"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, StopCircle, RefreshCcw, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatPage() {
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { language } = useLanguage();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Local storage key for chat memory
  const STORAGE_KEY = "luxo-chat-memory";

  // State to manage initial loading from local storage
  const [isMounted, setIsMounted] = useState(false);

  const { messages, sendMessage, setMessages } = useChat({
    onError: (error) => {
      console.error("Chat Error:", error);
      setError(error.message);
    },
  });

  // 1. Load chat history from localStorage on first mount
  useEffect(() => {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to parse chat memory:", e);
      }
    }
    setIsMounted(true);
    setIsLoading(false);
  }, [setMessages]);

  // 2. Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (isMounted && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  // 3. Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const reload = () => {
    window.location.reload();
  };

  const handleNewChat = () => {
    stop();
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Handle pressing Enter to send (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const event = new Event("submit") as any;
        handleSubmit(event);
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 1. Header Area */}
      <Header onNewChat={handleNewChat} />

      {/* 2. Chat Messages Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Empty State / Welcome Screen */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground opacity-50">
            <h2 className="text-2xl font-semibold">
              {language === "fa" ? "چگونه می‌توانم کمک کنم؟" : "How can I help you today?"}
            </h2>
            <p className="text-sm">
              {language === "fa" ? "پیام خود را در کادر پایین بنویسید..." : "Type your message in the input below..."}
            </p>
          </div>
        )}

        {/* Render Messages */}
        {messages.map((m: UIMessage) => (
          <div
            key={m.id}
            className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed shadow-sm ${m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm border border-border/50"
                }`}
            >
              {m.parts.map((part: any, index: number) => {
                if (m.role === 'user') {
                  return <div key={`user-${index}`} className="whitespace-pre-wrap break-words">{part.text}</div>;
                } else {
                  return (
                    <ReactMarkdown
                      key={`ReactMarkdown-${index}`}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          const lang = match ? match[1] : "";
                          return !inline && match ? (
                            <div className="relative group mt-4 mb-4 rounded-md overflow-hidden bg-[#1E1E1E] border border-border/50">
                              <div className="flex items-center justify-between px-4 py-1.5 bg-muted/80 text-xs text-muted-foreground font-mono">
                                <span>{lang}</span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(String(children))}
                                  className="hover:text-foreground transition-colors"
                                  title={language === "fa" ? "کپی کد" : "Copy code"}
                                >
                                  Copy
                                </button>
                              </div>
                              <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus as any}
                                language={lang}
                                PreTag="div"
                                customStyle={{
                                  margin: 0,
                                  padding: "1rem",
                                  background: "transparent",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code {...props} className={`${className} bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-primary`}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  )
                }
              })}
            </div>
          </div>
        ))}

        {/* Error State */}
        {error && (
          <div className="flex justify-center">
            <div className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-full flex items-center gap-2">
              <span>{language === "fa" ? "خطایی در ارتباط رخ داد." : "An error occurred."}</span>
              <button onClick={() => {reload() }} className="underline font-medium">
                {language === "fa" ? "تلاش مجدد" : "Retry"}
              </button>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Area (Fixed at bottom) */}
      <div className="w-full max-w-3xl mx-auto p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) handleSubmit(e);
          }}
          className="relative flex items-end gap-2 bg-muted/50 border border-border/50 rounded-2xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-all"
        >
          {/* Textarea for typing */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={language === "fa" ? "به Luxo پیام دهید..." : "Message Luxo..."}
            className="min-h-[44px] max-h-32 resize-none border-0 shadow-none bg-transparent focus-visible:ring-0 py-3 px-2 text-base scrollbar-thin"
            rows={1}
            disabled={isLoading}
          />

          {/* Action Buttons (Send / Stop) */}
          <div className="flex flex-col justify-end h-full pb-1 pr-1">
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="default"
                className="rounded-full w-9 h-9 animate-pulse bg-primary/80"
                onClick={stop}
                title={language === "fa" ? "توقف" : "Stop generating"}
              >
                <StopCircle className="w-5 h-5 text-primary-foreground" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="rounded-full w-9 h-9 transition-transform active:scale-95 disabled:opacity-50"
              >
                <SendHorizonal className="w-5 h-5" />
                <span className="sr-only">Send</span>
              </Button>
            )}
          </div>
        </form>

        {/* Footer Text */}
        <div className="text-center text-xs text-muted-foreground mt-3 opacity-70">
          {language === "fa"
            ? "لوکسو ممکن است اشتباه کند. اطلاعات مهم را بررسی کنید."
            : "Luxo can make mistakes. Consider verifying important information."}
        </div>
      </div>
    </div>
  );
}