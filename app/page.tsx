"use client";
import { useState, useRef, useEffect } from "react";
import {
  ChatHeader,
  ChatMessages,
  ChatInput,
  WelcomeScreen,
  Message,
} from "@/app/components";

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("f1-gpt-theme") as "light" | "dark" | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("f1-gpt-theme", theme);
  }, [theme]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const responseText = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          responseText || "I couldn't generate a response. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling chat API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error processing your request. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <main className="app-shell">
      <ChatHeader isDark={isDark} onThemeToggle={setTheme} />

      {messages.length === 0 ? (
        <WelcomeScreen isDark={isDark} onPromptSelect={setInput} />
      ) : (
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          isDark={isDark}
          messagesEndRef={messagesEndRef}
        />
      )}

      <ChatInput
        input={input}
        isLoading={isLoading}
        isDark={isDark}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default Home;
