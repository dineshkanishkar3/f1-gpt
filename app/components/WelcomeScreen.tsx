import { Flag } from "lucide-react";
import { QuickPrompts } from "./QuickPrompts";
import { F1Logo } from "./F1Logo";

interface WelcomeScreenProps {
  isDark: boolean;
  onPromptSelect: (prompt: string) => void;
}

export const WelcomeScreen = ({ onPromptSelect }: WelcomeScreenProps) => (
  <div className="flex-1 flex items-center justify-center px-4 py-8">
    <div className="text-center w-full max-w-2xl space-y-8">
      <div className="flex flex-col items-center gap-6">
        <div className="rounded-2xl px-6 py-4 sm:px-8 sm:py-5 border-2 border-f1-red/30 dark:border-f1-red/50 bg-white shadow-[0_0_0_6px_rgba(225,6,0,0.1),0_16px_48px_rgba(225,6,0,0.18)]">
          <F1Logo priority className="h-12 sm:h-16 w-auto object-contain logo-glow" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-f1-red/25 bg-f1-red-soft dark:bg-f1-red-soft-dark text-f1-red">
            <Flag className="w-3.5 h-3.5" />
            Formula 1 Assistant
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-f1-text dark:text-f1-text-dark">
            Welcome to <span className="text-f1-red">F1-GPT</span>
          </h2>

          <p className="max-w-md mx-auto text-[0.9375rem] leading-relaxed text-f1-text-muted dark:text-f1-text-muted-dark">
            Ask anything about drivers, constructors, race weekends, championship
            standings, and F1 history. Get clear, structured answers instantly.
          </p>
        </div>
      </div>

      <QuickPrompts onPromptSelect={onPromptSelect} />
    </div>
  </div>
);
