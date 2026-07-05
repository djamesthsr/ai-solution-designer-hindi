import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, ChevronRight, RefreshCw, Star, Users, BrainCircuit, Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { BRANCHING_SCENARIOS } from "../data/scenarios";
import { BRANCHING_SCENARIOS_HI } from "../data/scenarios_hi";
import { BranchingScenario, ScenarioChoice } from "../types";
import { UI_TRANSLATIONS } from "../data/translations";

interface Activity2ConsultantProps {
  onComplete: () => void;
  xp: number;
  addXp: (amount: number) => void;
  lang: "en" | "hi";
}

export default function Activity2Consultant({ onComplete, xp, addXp, lang }: Activity2ConsultantProps) {
  const [selectedScenario, setSelectedScenario] = useState<BranchingScenario | null>(null);
  const t = UI_TRANSLATIONS[lang];
  
  // Simulator progression state
  const [currentStepId, setCurrentStepId] = useState<"problem" | "data" | "model" | "output">("problem");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isCorrectChoice, setIsCorrectChoice] = useState<boolean>(false);
  
  // Points & tracking state
  const [scenarioPoints, setScenarioPoints] = useState<number>(0);
  const [scenarioComplete, setScenarioComplete] = useState<boolean>(false);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, number>>({});

  const scenarios = lang === "hi" ? BRANCHING_SCENARIOS_HI : BRANCHING_SCENARIOS;

  const selectScenario = (sc: BranchingScenario) => {
    // Find the localized scenario to ensure we load the correct language fields
    const localizedSc = scenarios.find((s) => s.id === sc.id) || sc;
    setSelectedScenario(localizedSc);
    setCurrentStepId("problem");
    setSelectedChoiceIndex(null);
    setShowFeedback(false);
    setIsCorrectChoice(false);
    setScenarioPoints(0);
    setScenarioComplete(false);
  };

  const handleChoiceClick = (choiceIdx: number) => {
    if (!selectedScenario || showFeedback) return;
    
    setSelectedChoiceIndex(choiceIdx);
    const step = selectedScenario.steps[currentStepId];
    const choice = step.choices[choiceIdx];
    
    setFeedbackText(choice.feedback);
    setIsCorrectChoice(choice.isCorrect);
    setShowFeedback(true);

    if (choice.isCorrect) {
      setScenarioPoints((prev) => prev + choice.scoreImpact);
    }
  };

  const nextStep = () => {
    if (!selectedScenario) return;

    setShowFeedback(false);
    setSelectedChoiceIndex(null);

    if (currentStepId === "problem") {
      setCurrentStepId("data");
    } else if (currentStepId === "data") {
      setCurrentStepId("model");
    } else if (currentStepId === "model") {
      setCurrentStepId("output");
    } else if (currentStepId === "output") {
      // Completed the 4 steps!
      setScenarioComplete(true);
      const finalScore = scenarioPoints;
      setCompletedScenarios({
        ...completedScenarios,
        [selectedScenario.id]: finalScore
      });
      
      // Award XP
      addXp(30); // Base scenario pass
      if (finalScore >= 90) {
        addXp(20); // Perfect/High score bonus XP
      }
    }
  };

  const handleTryAgainStep = () => {
    // Retrying the step deducts a few points to encourage critical thinking
    setScenarioPoints((prev) => Math.max(0, prev - 5));
    setShowFeedback(false);
    setSelectedChoiceIndex(null);
  };

  const currentStep = selectedScenario?.steps[currentStepId];

  // Helper for step labels translation
  const getStepLabel = (stepKey: string) => {
    if (lang === "hi") {
      if (stepKey === "problem") return "समस्या";
      if (stepKey === "data") return "डेटा";
      if (stepKey === "model") return "मॉडल";
      if (stepKey === "output") return "आउटपुट";
    }
    return stepKey.charAt(0).toUpperCase() + stepKey.slice(1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Activity Intro */}
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {t.act2Title}
        </h2>
        <p className="font-sans text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          {t.act2Subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* SCENARIO SELECTION LIST */}
        {!selectedScenario ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((sc) => {
                const wasCompleted = completedScenarios[sc.id] !== undefined;
                const score = completedScenarios[sc.id];

                return (
                  <button
                    id={`scenario-card-${sc.id}`}
                    key={sc.id}
                    onClick={() => selectScenario(sc)}
                    className={`text-left rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[220px] ${
                      wasCompleted
                        ? "bg-[#131B2E] border-emerald-500/30 hover:border-emerald-500/50"
                        : "bg-[#131B2E] border-[#1E293B] hover:border-[#06B6D4]/50 hover:bg-[#162138]"
                    }`}
                  >
                    {/* Status Badge */}
                    {wasCompleted && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                        {lang === "hi" ? `समाधान हो गया (${score} अंक)` : `RESOLVED (${score} pts)`}
                      </span>
                    )}

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#070B14] border border-[#1E293B] text-white group-hover:scale-110 transition-transform mb-4">
                      <span className="text-2xl filter drop-shadow-sm select-none">
                        {sc.icon === "Utensils" ? "🍽️" : sc.icon === "Car" ? "🚗" : sc.icon === "Recycle" ? "♻️" : sc.icon === "BookOpen" ? "📚" : "💧"}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-sans text-base font-extrabold text-white mb-1">{sc.name}</h3>
                      <p className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed">{sc.shortDesc}</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#22D3EE] group-hover:text-white transition-colors mt-auto">
                      <span>{wasCompleted ? (lang === "hi" ? "दौराएं" : "Replay Scenario") : (lang === "hi" ? "एआई समाधान जोड़ें" : "Assemble AI Solution")}</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Total Resolved Progress Check */}
            {Object.keys(completedScenarios).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center max-w-md mx-auto"
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-sans text-sm font-bold text-white">
                  {lang === "hi" ? `पूर्ण: 5 दुविधाओं में से ${Object.keys(completedScenarios).length}` : `Completed: ${Object.keys(completedScenarios).length} of 5 Dilemmas`}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === "hi" ? "अद्भुत! आप गहरा, व्यवस्थित परामर्श अनुभव बना रहे हैं।" : "Excellent! You are building deep, systematic consulting experience."}
                </p>
                <button
                  id="consultant-all-complete-btn"
                  onClick={onComplete}
                  className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#C4B286] to-[#D29264] text-white font-bold text-xs rounded-xl hover:scale-103 shadow-md shadow-emerald-500/10"
                >
                  {t.proceedToCanvas}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          
          /* ACTIVE SIMULATOR PAGE */
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Column: Progress checklist */}
            <div className="md:col-span-1 rounded-2xl border border-[#1E293B] bg-[#131B2E] p-5">
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-4 font-bold"
              >
                ← {lang === "hi" ? "दुविधाओं पर वापस जाएं" : "Back to Dilemmas"}
              </button>

              <h3 className="font-sans text-base font-extrabold text-white mb-2">{selectedScenario.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed border-b border-[#1E293B] pb-4 mb-4">
                {selectedScenario.problemDesc}
              </p>

              {/* Steps timeline vertical */}
              <div className="space-y-4">
                {["problem", "data", "model", "output"].map((stepKey, idx) => {
                  const stepLabel = getStepLabel(stepKey);
                  const stepNum = idx + 1;
                  
                  const isPast =
                    (currentStepId === "data" && idx < 1) ||
                    (currentStepId === "model" && idx < 2) ||
                    (currentStepId === "output" && idx < 3) ||
                    scenarioComplete;
                  
                  const isCurrent = currentStepId === stepKey && !scenarioComplete;

                  return (
                    <div key={stepKey} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                          isPast
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-[#22D3EE] text-[#070B14]"
                            : "bg-[#070B14] text-slate-500 border border-[#1E293B]"
                        }`}>
                          {isPast ? "✓" : stepNum}
                        </div>
                        {idx < 3 && (
                          <div className={`h-8 w-[1.5px] ${
                            isPast ? "bg-emerald-500" : "bg-[#1E293B]"
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-bold leading-none ${
                          isPast ? "text-emerald-400" : isCurrent ? "text-[#22D3EE]" : "text-slate-500"
                        }`}>
                          {lang === "hi" ? `${stepLabel} चरण` : `${stepLabel} Stage`}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {isPast ? (lang === "hi" ? "पूर्ण" : "Completed") : isCurrent ? (lang === "hi" ? "डिज़ाइन किया जा रहा है..." : "Designing...") : (lang === "hi" ? "प्रतीक्षा में" : "Queued")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total points */}
              <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{lang === "hi" ? "परिदृश्य स्कोर:" : "Scenario Score:"}</span>
                <span className="font-mono text-base font-bold text-[#F97316]">{scenarioPoints} {lang === "hi" ? "अंक" : "pts"}</span>
              </div>
            </div>

            {/* Right Column: Dynamic Steps simulator */}
            <div className="md:col-span-2 border border-[#1E293B] bg-[#070B14] rounded-2xl p-6 flex flex-col justify-between min-h-[380px]">
              
              {!scenarioComplete ? (
                /* LIVE STEP IN PROGRESS */
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="rounded bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#818CF8] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                      {currentStep?.title}
                    </span>
                    <h4 className="font-sans text-lg font-extrabold text-white mt-2 leading-snug">
                      {currentStep?.question}
                    </h4>

                    {/* Choices Stack */}
                    <div className="space-y-2.5 mt-5">
                      {currentStep?.choices.map((choice, idx) => {
                        const isSelected = selectedChoiceIndex === idx;
                        let btnStyle = "bg-[#131B2E] border-[#1E293B] text-slate-300 hover:bg-[#1E293B] hover:border-slate-700";
                        
                        if (showFeedback) {
                          if (isSelected) {
                            btnStyle = choice.isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                              : "bg-red-500/10 border-red-500/40 text-red-400";
                          } else {
                            btnStyle = "bg-[#131B2E]/40 border-[#1E293B]/60 text-slate-500 cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleChoiceClick(idx)}
                            disabled={showFeedback}
                            className={`w-full text-left px-5 py-3 rounded-xl text-xs font-medium border transition-all ${btnStyle}`}
                          >
                            {choice.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Mentor Feedback panel */}
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border mt-6 flex gap-3 ${
                        isCorrectChoice
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "bg-red-500/10 border-red-500/20 text-red-300"
                      }`}
                    >
                      <div className="text-2xl filter drop-shadow-sm shrink-0 select-none">
                        {isCorrectChoice ? "🤖" : "⚠️"}
                      </div>
                      <div>
                        <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                          {isCorrectChoice 
                            ? (lang === "hi" ? "एआई मेंटर: उत्कृष्ट निर्णय!" : "AI Mentor: Excellent Decision!") 
                            : (lang === "hi" ? "एआई मेंटर: सिस्टम संघर्ष" : "AI Mentor: System Conflict")}
                        </h5>
                        <p className="font-sans text-xs leading-relaxed">{feedbackText}</p>
                        
                        {/* Control buttons inside feedback */}
                        <div className="mt-3 flex items-center justify-end">
                          {!isCorrectChoice ? (
                            <button
                              onClick={handleTryAgainStep}
                              className="flex items-center gap-1 text-xs font-bold bg-[#131B2E] border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              <span>{lang === "hi" ? "दूसरा विकल्प चुनें" : "Select Another Option"}</span>
                            </button>
                          ) : (
                            <button
                              onClick={nextStep}
                              className="flex items-center gap-1 text-xs font-bold bg-emerald-500 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-600"
                            >
                              <span>{currentStepId === "output" 
                                ? (lang === "hi" ? "समाधान समाप्त करें" : "Finish Solution") 
                                : (lang === "hi" ? "अगला चरण" : "Next Stage")}
                              </span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* SCENARIO COMPLETE REPORT CARD */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 flex-1 flex flex-col justify-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="h-8 w-8" />
                  </div>

                  <h3 className="font-sans text-2xl font-extrabold text-white">
                    {lang === "hi" ? "एआई समाधान अधिकृत" : "AI Solution Authorized"}
                  </h3>
                  <p className="font-sans text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {lang === "hi" 
                      ? "उत्कृष्ट! आपकी एआई परियोजना वास्तुकला पूरी तरह से संरेखित है और तैनात करने से पहले उचित चर एकत्र करती है।" 
                      : "Excellent! Your AI project architecture aligns perfectly and collects proper variables before deploying."}
                  </p>

                  {/* Skills Score breakdown */}
                  <div className="mx-auto max-w-md w-full rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 my-6 text-left">
                    <h4 className="font-mono text-[10px] font-bold text-[#22D3EE] uppercase tracking-wider mb-3">
                      {lang === "hi" ? "प्रदर्शन ऑडिट" : "Performance Audit"}
                    </h4>
                    
                    <div className="space-y-3.5">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{lang === "hi" ? "समस्या पहचान" : "Problem Identification"}</span>
                          <span className="font-mono font-bold text-white">100%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#070B14] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{lang === "hi" ? "डेटा चयन रणनीति" : "Data Selection Strategy"}</span>
                          <span className="font-mono font-bold text-white">{scenarioPoints >= 90 ? "90%" : "70%"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#070B14] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: scenarioPoints >= 90 ? "90%" : "70%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{lang === "hi" ? "मॉडल चयन और संरेखण" : "Model Selection & Alignment"}</span>
                          <span className="font-mono font-bold text-white">{scenarioPoints >= 90 ? "95%" : "80%"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#070B14] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: scenarioPoints >= 90 ? "95%" : "80%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{lang === "hi" ? "आउटपुट इंटरफ़ेस डिज़ाइन" : "Output Interface Design"}</span>
                          <span className="font-mono font-bold text-white">{lang === "hi" ? "उत्कृष्ट" : "Excellent"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#070B14] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedScenario(null)}
                      className="px-5 py-2.5 border border-[#1E293B] bg-[#131B2E] text-slate-300 text-xs font-bold rounded-xl hover:bg-[#1C2538]"
                    >
                      {lang === "hi" ? "दूसरी दुविधा हल करें" : "Solve Another Dilemma"}
                    </button>
                    <button
                      id="consultant-finish-btn"
                      onClick={onComplete}
                      className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#C4B286] to-[#D29264] text-white text-xs font-bold rounded-xl hover:scale-102 active:scale-95 shadow-md shadow-[#C4B286]/20"
                    >
                      <span>{lang === "hi" ? "अपनी खुद की परियोजना डिज़ाइन करें" : "Design Your Own Project"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
