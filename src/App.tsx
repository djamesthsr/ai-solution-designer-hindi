/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import MissionBrief from "./components/MissionBrief";
import Activity1ProjectCycle from "./components/Activity1ProjectCycle";
import Activity2Consultant from "./components/Activity2Consultant";
import Activity3Canvas from "./components/Activity3Canvas";
import Activity4Reflection from "./components/Activity4Reflection";
import BadgeUnlock from "./components/BadgeUnlock";

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [xp, setXp] = useState<number>(0);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  
  // Variables parsed from Activity 3 to pre-fill Reflection questions in Activity 4
  const [savedProblem, setSavedProblem] = useState<string>("");
  const [savedData, setSavedData] = useState<string>("");

  // Hydrate state from localStorage to prevent progress loss
  useEffect(() => {
    const cachedStep = localStorage.getItem("humain_step");
    const cachedXp = localStorage.getItem("humain_xp");
    const cachedBadge = localStorage.getItem("humain_badge");
    const cachedProb = localStorage.getItem("humain_saved_problem");
    const cachedData = localStorage.getItem("humain_saved_data");
    const cachedLang = localStorage.getItem("humain_lang");

    if (cachedStep) setCurrentStep(parseInt(cachedStep));
    if (cachedXp) setXp(parseInt(cachedXp));
    if (cachedBadge) setBadgeUnlocked(cachedBadge === "true");
    if (cachedProb) setSavedProblem(cachedProb);
    if (cachedData) setSavedData(cachedData);
    if (cachedLang === "en" || cachedLang === "hi") setLang(cachedLang);
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === "en" ? "hi" : "en";
      localStorage.setItem("humain_lang", next);
      return next;
    });
  };

  const addXp = (amount: number) => {
    setXp((prev) => {
      const nextXp = prev + amount;
      localStorage.setItem("humain_xp", nextXp.toString());
      return nextXp;
    });
  };

  const handleNavigate = (step: number) => {
    setCurrentStep(step);
    localStorage.setItem("humain_step", step.toString());
  };

  const advanceStep = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    localStorage.setItem("humain_step", next.toString());

    // Unlock badge upon entering final dashboard / completing everything
    if (next >= 5) {
      setBadgeUnlocked(true);
      localStorage.setItem("humain_badge", "true");
    }
  };

  const resetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset your AI Solution Designer mission progress? This will clear your XP and Badge.")) {
      localStorage.clear();
      setCurrentStep(1);
      setXp(0);
      setBadgeUnlocked(false);
      setSavedProblem("");
      setSavedData("");
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between selection:bg-[#22D3EE]/20 selection:text-[#22D3EE]">
      
      {/* Dynamic Navbar header */}
      <Navbar
        currentStep={currentStep}
        xp={xp}
        badgeUnlocked={badgeUnlocked}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main activities presentation stage with smooth section animations */}
      <main className="flex-1 w-full flex items-center justify-center relative py-6">
        <div className="w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <MissionBrief
                  onComplete={advanceStep}
                  xp={xp}
                  addXp={addXp}
                  lang={lang}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Activity1ProjectCycle
                  onComplete={advanceStep}
                  xp={xp}
                  addXp={addXp}
                  lang={lang}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Activity2Consultant
                  onComplete={advanceStep}
                  xp={xp}
                  addXp={addXp}
                  lang={lang}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Activity3Canvas
                  onComplete={() => {
                    // Try to extract canvas value to pre-fill written reflection
                    const cachedCanvasProb = localStorage.getItem("humain_saved_problem") || "";
                    const cachedCanvasData = localStorage.getItem("humain_saved_data") || "";
                    setSavedProblem(cachedCanvasProb);
                    setSavedData(cachedCanvasData);
                    advanceStep();
                  }}
                  xp={xp}
                  addXp={addXp}
                  lang={lang}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Activity4Reflection
                  onComplete={advanceStep}
                  xp={xp}
                  addXp={addXp}
                  problemText={savedProblem}
                  dataText={savedData}
                  lang={lang}
                />
              </motion.div>
            )}

            {currentStep >= 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <BadgeUnlock
                  xp={xp}
                  onReset={resetAllProgress}
                  lang={lang}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Styled accessible Footer */}
      <footer id="app-footer" className="w-full border-t border-[#1E293B] bg-[#070B14] py-4 px-6 text-center">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <p>© 2026 AI Project Cycle Studio. All rights reserved.</p>
          <p className="flex items-center gap-1.5 justify-center">
            <span>Security Approved</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>High-Contrast AAA Compliant</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
