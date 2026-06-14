import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: (theme: "light" | "dark") => void;
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => (
  <button
    onClick={() => onToggle(isDark ? "light" : "dark")}
    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    className="p-3 rounded-xl border border-f1-red/30 bg-f1-red-soft dark:bg-f1-red-soft-dark text-f1-red transition-all duration-200 cursor-pointer hover:bg-f1-red-muted dark:hover:bg-f1-red-soft-dark hover:scale-105 active:scale-95"
  >
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);
