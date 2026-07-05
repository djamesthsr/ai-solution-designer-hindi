import React from "react";
import { Award, Zap, BookOpen, Layers, CheckCircle, Globe } from "lucide-react";
import { UI_TRANSLATIONS } from "../data/translations";

interface NavbarProps {
  currentStep: number;
  xp: number;
  badgeUnlocked: boolean;
  onNavigate: (step: number) => void;
  lang: "en" | "hi";
  onToggleLanguage: () => void;
}

export default function Navbar({
  currentStep,
  xp,
  badgeUnlocked,
  onNavigate,
  lang,
  onToggleLanguage,
}: NavbarProps) {
  const t = UI_TRANSLATIONS[lang];

  const steps = [
    { id: 1, label: t.brief, icon: BookOpen },
    { id: 2, label: t.cycleIntro, icon: Layers },
    { id: 3, label: t.consultantChallenge, icon: Zap },
    { id: 4, label: t.aiCanvas, icon: Award },
    { id: 5, label: t.reflection, icon: CheckCircle },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#070B14]/90 backdrop-blur-md px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C4B286] to-[#D29264] shadow-md shadow-[#C4B286]/20">
              <span className="font-sans text-sm font-black text-white">AI</span>
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold tracking-tight text-white">
                AI Project <span className="bg-gradient-to-r from-[#C4B286] to-[#D29264] bg-clip-text text-transparent font-extrabold">{lang === "hi" ? "चक्र" : "Cycle"}</span>
              </h1>
              <p className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">{t.aiConsultantMission}</p>
            </div>
          </div>

          {/* Mobile Right: Lang + XP */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="lang-toggle-mobile"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#131B2E] px-2.5 py-1 text-[10px] font-bold text-[#C4B286] hover:bg-[#1E293B] transition-all"
            >
              <Globe className="h-3 w-3" />
              <span>{lang === "en" ? "हिंदी" : "EN"}</span>
            </button>
            
            <div className="flex items-center gap-1.5 rounded-full bg-[#131B2E] border border-[#1E293B] px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-[#F97316] animate-pulse" />
              <span className="font-mono text-xs font-bold text-white">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Steps Navigation - Scrollable on mobile */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 no-scrollbar" aria-label="Progress Timeline">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id || (s.id === 5 && currentStep >= 5);
            const isCompleted = currentStep > s.id;

            return (
              <React.Fragment key={s.id}>
                <button
                  id={`nav-step-${s.id}`}
                  onClick={() => onNavigate(s.id)}
                  disabled={!isCompleted && currentStep < s.id}
                  className={`flex min-w-[110px] md:min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#1E293B] text-[#22D3EE] border border-[#06B6D4]/30 shadow-sm"
                      : isCompleted
                      ? "text-emerald-400 hover:bg-[#131B2E] cursor-pointer"
                      : "text-slate-500 cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-[#22D3EE] text-[#070B14]"
                        : isCompleted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-[#131B2E] text-slate-500"
                    }`}
                  >
                    {isCompleted ? "✓" : s.id}
                  </div>
                  <span className="whitespace-nowrap">{s.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="hidden md:block h-[1px] w-4 bg-[#1E293B]" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Desktop Achievements Badge / XP / Lang */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="lang-toggle-desktop"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-[#131B2E] px-3.5 py-2 text-xs font-bold text-[#C4B286] hover:bg-[#1E293B] transition-all cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span>{lang === "en" ? "हिंदी (Hindi)" : "English (EN)"}</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-[#131B2E] border border-[#1E293B] px-4 py-2">
            <Zap className="h-5 w-5 text-[#F97316] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase leading-none">{t.score}</p>
              <p className="font-mono text-sm font-bold text-white">{xp} XP</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition-all duration-500 ${
              badgeUnlocked
                ? "bg-gradient-to-r from-[#1E293B] to-emerald-950/40 border-emerald-500/30 text-emerald-400"
                : "bg-[#131B2E]/50 border-[#1E293B] text-slate-500"
            }`}
          >
            <Award className={`h-5 w-5 ${badgeUnlocked ? "text-emerald-400 animate-bounce" : "text-slate-600"}`} />
            <div>
              <p className="text-[10px] font-mono uppercase leading-none">{t.badgeStatus}</p>
              <p className="text-xs font-bold whitespace-nowrap">
                {badgeUnlocked ? `💡 ${t.aiSolutionDesigner}` : t.locked}
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
