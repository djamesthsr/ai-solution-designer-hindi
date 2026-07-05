import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Send, HelpCircle, Loader2, RefreshCw, Layers, CheckCircle2, Award } from "lucide-react";
import { CANVAS_SUGGESTED_ITEMS, WORKFLOW_STEPS } from "../data/scenarios";
import { CANVAS_SUGGESTED_ITEMS_HI, WORKFLOW_STEPS_HI } from "../data/scenarios_hi";
import { CanvasReviewResult, ProjectCanvas } from "../types";
import { UI_TRANSLATIONS } from "../data/translations";

interface Activity3CanvasProps {
  onComplete: () => void;
  xp: number;
  addXp: (amount: number) => void;
  lang: "en" | "hi";
}

export default function Activity3Canvas({ onComplete, xp, addXp, lang }: Activity3CanvasProps) {
  const [activeSubTab, setActiveSubTab] = useState<"canvas" | "workflow" | "reflection">("canvas");
  const t = UI_TRANSLATIONS[lang];
  
  // Canvas State
  const [canvasType, setCanvasType] = useState<"scaffold" | "custom">("scaffold");
  const [canvas, setCanvas] = useState<ProjectCanvas>({
    problem: "",
    data: "",
    model: "",
    output: "",
    reflection: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [review, setReview] = useState<CanvasReviewResult | null>(null);

  // Workflow sequence State (keeping internal strings English for comparison robustly, mapping dynamically)
  const initialWorkflow = ["Deploy Solution", "Understand Problem", "Train Model", "Improve AI", "Collect Data", "Test AI"];
  const [currentWorkflow, setCurrentWorkflow] = useState<string[]>(initialWorkflow);
  const [workflowSuccess, setWorkflowSuccess] = useState<boolean | null>(null);

  // Reflection State
  const [selectedImportance, setSelectedImportance] = useState<string>("");
  const [importanceExplanation, setImportanceExplanation] = useState<string>("");
  const [reflectionSubmitted, setReflectionSubmitted] = useState<boolean>(false);

  const suggestedItems = lang === "hi" ? CANVAS_SUGGESTED_ITEMS_HI : CANVAS_SUGGESTED_ITEMS;

  // Suggested item select handlers
  const selectScaffoldItem = (stage: keyof ProjectCanvas, value: string) => {
    setCanvas((prev) => ({ ...prev, [stage]: value }));
  };

  const handleCustomInput = (stage: keyof ProjectCanvas, val: string) => {
    setCanvas((prev) => ({ ...prev, [stage]: val }));
  };

  // Submit Canvas to Gemini
  const submitCanvasForReview = async () => {
    if (!canvas.problem || !canvas.data || !canvas.model || !canvas.output) {
      alert(lang === "hi" ? "कृपया समीक्षा का अनुरोध करने से पहले अपने एआई प्रोजेक्ट कैनवास (समस्या, डेटा, मॉडल, आउटपुट) के सभी अनुभागों को पूरा करें।" : "Please complete all sections of your AI Project Canvas (Problem, Data, Model, Output) before requesting a review.");
      return;
    }

    setLoading(true);
    setReview(null);

    try {
      const response = await fetch("/api/review-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: canvas.problem,
          data: canvas.data,
          model: canvas.model,
          output: canvas.output,
          reflection: canvas.reflection,
          lang: lang
        })
      });

      const data = await response.json();
      setReview(data);
      addXp(30); // Award 30 XP for building and auditing!
    } catch (error) {
      console.error("Canvas Audit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Workflow mechanics
  const swapWorkflowItems = (fromIdx: number, direction: "up" | "down") => {
    const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= currentWorkflow.length) return;

    const copy = [...currentWorkflow];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[toIdx];
    copy[toIdx] = temp;
    setCurrentWorkflow(copy);
  };

  const checkWorkflowSequence = () => {
    const isCorrect = currentWorkflow.every((val, index) => val === WORKFLOW_STEPS[index]);
    setWorkflowSuccess(isCorrect);
    if (isCorrect) {
      addXp(20); // 20 XP for correct workflow sorting!
    }
  };

  const resetWorkflow = () => {
    setCurrentWorkflow(initialWorkflow);
    setWorkflowSuccess(null);
  };

  // Submit final reflection
  const handleReflectionSubmit = () => {
    if (!selectedImportance || !importanceExplanation) {
      alert(lang === "hi" ? "कृपया वह चरण चुनें जिसे आप सबसे महत्वपूर्ण मानते हैं और अपना औचित्य लिखें।" : "Please select the stage you believe is most important and write your justification.");
      return;
    }

    setReflectionSubmitted(true);
    addXp(15); // Reward 15 XP for self-reflection!
  };

  const isCanvasFinished = canvas.problem && canvas.data && canvas.model && canvas.output;

  // Translation helper for Workflow steps display
  const getWorkflowStepLabel = (step: string) => {
    if (lang !== "hi") return step;
    if (step === "Understand Problem") return "समस्या को समझें";
    if (step === "Collect Data") return "डेटा एकत्र करें";
    if (step === "Train Model") return "मॉडल को प्रशिक्षित करें";
    if (step === "Test AI") return "एआई का परीक्षण करें";
    if (step === "Deploy Solution") return "समाधान तैनात करें";
    if (step === "Improve AI") return "एआई में सुधार करें";
    return step;
  };

  const getStageLabelHi = (stage: string) => {
    if (stage === "Problem") return "समस्या (Problem)";
    if (stage === "Data") return "डेटा (Data)";
    if (stage === "Model") return "मॉडल (Model)";
    if (stage === "Output") return "आउटपुट (Output)";
    return stage;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Activity Header */}
      <div className="mb-6 text-center">
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {t.act3Title}
        </h2>
        <p className="font-sans text-sm text-slate-400 mt-1">
          {t.act3Subtitle}
        </p>
      </div>

      {/* Segment Sub tabs */}
      <div className="flex border-b border-[#1E293B] bg-[#131B2E] rounded-t-2xl overflow-hidden p-1 gap-1">
        <button
          id="canvas-tab"
          onClick={() => setActiveSubTab("canvas")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === "canvas"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>1. {lang === "hi" ? "परियोजना बोर्ड" : "Project Board"}</span>
          {review && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>

        <button
          id="workflow-tab"
          onClick={() => setActiveSubTab("workflow")}
          disabled={!review}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            !review
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : activeSubTab === "workflow"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>2. {lang === "hi" ? "कार्यप्रवाह अनुक्रमक" : "Workflow Sequencer"}</span>
          {workflowSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>

        <button
          id="reflection-tab"
          onClick={() => setActiveSubTab("reflection")}
          disabled={!workflowSuccess}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            !workflowSuccess
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : activeSubTab === "reflection"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>3. {lang === "hi" ? "रणनीतिक चिंतन" : "Strategic Reflection"}</span>
          {reflectionSubmitted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>
      </div>

      <div className="bg-[#131B2E] border-x border-b border-[#1E293B] rounded-b-2xl p-6 shadow-xl min-h-[460px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: AI PROJECT CANVAS BOARD */}
          {activeSubTab === "canvas" && (
            <motion.div
              key="canvas-board"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Layout Mode Toggler */}
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div>
                  <h3 className="font-sans text-base font-extrabold text-white">{t.yourProjectCanvas}</h3>
                  <p className="font-sans text-xs text-slate-400 mt-0.5">{t.act3Subtitle}</p>
                </div>
                <div className="flex rounded-lg bg-[#070B14] p-1 border border-[#1E293B] gap-1">
                  <button
                    onClick={() => setCanvasType("scaffold")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      canvasType === "scaffold" ? "bg-[#1E293B] text-[#22D3EE] shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang === "hi" ? "स्कैफोल्डिंग कार्ड्स" : "Scaffolding Cards"}
                  </button>
                  <button
                    onClick={() => setCanvasType("custom")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      canvasType === "custom" ? "bg-[#1E293B] text-[#22D3EE] shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang === "hi" ? "कस्टम इनपुट" : "Custom Typing"}
                  </button>
                </div>
              </div>

              {/* Digital Whiteboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* 1. PROBLEM CARD */}
                <div className="rounded-xl border border-red-500/20 bg-[#070B14] p-4 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="flex h-5 w-fit px-2 items-center justify-center rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-2">1. {lang === "hi" ? "समस्या" : "PROBLEM"}</span>
                    <h4 className="font-sans text-xs font-bold text-white mb-2">{lang === "hi" ? "मुख्य चुनौती" : "Core Challenge"}</h4>
                    {canvasType === "scaffold" ? (
                      <select
                        id="scaffold-problem"
                        onChange={(e) => selectScaffoldItem("problem", e.target.value)}
                        value={canvas.problem}
                        className="w-full bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs"
                      >
                        <option value="">{lang === "hi" ? "चुनौती चुनें..." : "Select a Challenge..."}</option>
                        {suggestedItems.problems.map((p, idx) => (
                          <option key={idx} value={p}>{p.split(": ")[0]}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        id="custom-problem"
                        placeholder={lang === "hi" ? "हल करने के लिए विशिष्ट वास्तविक दुनिया की समस्या का वर्णन करें..." : "Describe the specific real-world friction to solve..."}
                        onChange={(e) => handleCustomInput("problem", e.target.value)}
                        value={canvas.problem}
                        className="w-full h-24 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-3 border-t border-slate-800/50 pt-2">{canvas.problem || (lang === "hi" ? "समस्या चयन की प्रतीक्षा है..." : "Awaiting problem selection...")}</p>
                </div>

                {/* 2. DATA CARD */}
                <div className="rounded-xl border border-amber-500/20 bg-[#070B14] p-4 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="flex h-5 w-fit px-2 items-center justify-center rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2">2. {lang === "hi" ? "डेटा" : "DATA"}</span>
                    <h4 className="font-sans text-xs font-bold text-white mb-2">{lang === "hi" ? "आवश्यक चर" : "Variables Needed"}</h4>
                    {canvasType === "scaffold" ? (
                      <select
                        id="scaffold-data"
                        onChange={(e) => selectScaffoldItem("data", e.target.value)}
                        value={canvas.data}
                        className="w-full bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs"
                      >
                        <option value="">{lang === "hi" ? "डेटासेट चुनें..." : "Select Dataset..."}</option>
                        {suggestedItems.datasets.map((d, idx) => (
                          <option key={idx} value={d}>{d.split(": ")[0]}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        id="custom-data"
                        placeholder={lang === "hi" ? "फ़ाइलें, सेंसर फ़ीड, लॉग या निर्देशांक सूचीबद्ध करें..." : "List files, sensor feeds, logs, or coordinates..."}
                        onChange={(e) => handleCustomInput("data", e.target.value)}
                        value={canvas.data}
                        className="w-full h-24 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-3 border-t border-slate-800/50 pt-2">{canvas.data || (lang === "hi" ? "डेटा चयन की प्रतीक्षा है..." : "Awaiting data selection...")}</p>
                </div>

                {/* 3. MODEL CARD */}
                <div className="rounded-xl border border-indigo-500/20 bg-[#070B14] p-4 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="flex h-5 w-fit px-2 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-2">3. {lang === "hi" ? "मॉडल" : "MODEL"}</span>
                    <h4 className="font-sans text-xs font-bold text-white mb-2">{lang === "hi" ? "एआई लॉजिक दृष्टिकोण" : "AI Logic Approach"}</h4>
                    {canvasType === "scaffold" ? (
                      <select
                        id="scaffold-model"
                        onChange={(e) => selectScaffoldItem("model", e.target.value)}
                        value={canvas.model}
                        className="w-full bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs"
                      >
                        <option value="">{lang === "hi" ? "एआई मॉडल चुनें..." : "Select AI Model..."}</option>
                        {suggestedItems.models.map((m, idx) => (
                          <option key={idx} value={m}>{m.split(": ")[0]}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        id="custom-model"
                        placeholder={lang === "hi" ? "लर्निंग विधि या क्लासिफायर रणनीति चुनें..." : "Choose learning method or classifier strategy..."}
                        onChange={(e) => handleCustomInput("model", e.target.value)}
                        value={canvas.model}
                        className="w-full h-24 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-3 border-t border-slate-800/50 pt-2">{canvas.model || (lang === "hi" ? "मॉडल चयन की प्रतीक्षा है..." : "Awaiting model selection...")}</p>
                </div>

                {/* 4. OUTPUT CARD */}
                <div className="rounded-xl border border-cyan-500/20 bg-[#070B14] p-4 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="flex h-5 w-fit px-2 items-center justify-center rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-2">4. {lang === "hi" ? "आउटपुट" : "OUTPUT"}</span>
                    <h4 className="font-sans text-xs font-bold text-white mb-2">{lang === "hi" ? "प्रदर्शन या कार्रवाई" : "Display or Action"}</h4>
                    {canvasType === "scaffold" ? (
                      <select
                        id="scaffold-output"
                        onChange={(e) => selectScaffoldItem("output", e.target.value)}
                        value={canvas.output}
                        className="w-full bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs"
                      >
                        <option value="">{lang === "hi" ? "प्रदर्शन/कार्रवाई चुनें..." : "Select Display/Action..."}</option>
                        {suggestedItems.outputs.map((o, idx) => (
                          <option key={idx} value={o}>{o.split(": ")[0]}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        id="custom-output"
                        placeholder={lang === "hi" ? "डैशबोर्ड, ट्रिगर, मानचित्र, फ़ीड समझाएं..." : "Explain dashboards, triggers, maps, feeds..."}
                        onChange={(e) => handleCustomInput("output", e.target.value)}
                        value={canvas.output}
                        className="w-full h-24 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-3 border-t border-slate-800/50 pt-2">{canvas.output || (lang === "hi" ? "आउटपुट चयन की प्रतीक्षा है..." : "Awaiting output selection...")}</p>
                </div>

              </div>

              {/* Reflection explanation box */}
              <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-4">
                <h4 className="font-sans text-xs font-bold text-white mb-1">{lang === "hi" ? "परियोजना चिंतन और विवरण" : "Project Reflection & Description"}</h4>
                <p className="text-[11px] text-slate-400 mb-3">{lang === "hi" ? "समझाएं कि आपका मॉडल हितधारकों के लिए उपयोगी आउटपुट उत्पन्न करने के लिए चर का उपयोग कैसे करता है।" : "Explain how your model uses the variables to produce useful output for stakeholders."}</p>
                <textarea
                  id="canvas-reflection"
                  placeholder={lang === "hi" ? "इस बारे में विवरण प्रदान करें कि आपके डेटा चर आपके चयनित मॉडल और आउटपुट के साथ सीधे क्यों संरेखित होते हैं..." : "Provide details about why your data variables align directly to your selected model and output..."}
                  onChange={(e) => handleCustomInput("reflection", e.target.value)}
                  value={canvas.reflection}
                  className="w-full h-20 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                />
              </div>

              {/* Action Trigger Buttons */}
              <div className="flex items-center justify-between border-t border-[#1E293B] pt-4">
                <button
                  onClick={() => setCanvas({ problem: "", data: "", model: "", output: "", reflection: "" })}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {lang === "hi" ? "बोर्ड रीसेट करें" : "Reset Board"}
                </button>

                <button
                  id="audit-project-btn"
                  onClick={submitCanvasForReview}
                  disabled={loading || !isCanvasFinished}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-all ${
                    !isCanvasFinished || loading
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{lang === "hi" ? "एआई बोर्ड की समीक्षा कर रहा है..." : "AI Reviewing Board..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>{t.submitCanvasBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {/* loading animation panel */}
              {loading && (
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-8 text-center animate-pulse">
                  <Loader2 className="h-10 w-10 text-[#06B6D4] animate-spin mx-auto mb-3" />
                  <p className="font-sans text-sm font-semibold text-white">
                    {lang === "hi" ? "एआई स्टूडियो परामर्श ऑडिट चल रहा है..." : "AI Studio Consulting Audit in progress..."}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === "hi" ? "समस्या संरेखण का विश्लेषण, डेटा सुरक्षा सीमाओं का सत्यापन और संभावित सिस्टम पूर्वाग्रहों का ऑडिट किया जा रहा है।" : "Analyzing problem alignment, verifying data safety boundaries, and auditing potential system bias."}
                  </p>
                </div>
              )}

              {/* EXPERT AI AUDIT RESULT FEEDBACK */}
              {review && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-dashed border-[#06B6D4]/40 bg-[#070B14] p-6"
                >
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
                    <h3 className="font-sans text-base font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#22D3EE] animate-pulse" />
                      <span>{lang === "hi" ? "विशेषज्ञ एआई परियोजना ऑडिट रिपोर्ट" : "Expert AI Project Audit Report"}</span>
                    </h3>
                    <span className="rounded bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#22D3EE] px-2 py-0.5 font-mono text-[9px] font-bold uppercase leading-none">
                      {lang === "hi" ? "ऑडिट स्वीकृत" : "Audit Approved"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    {/* Strengths */}
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                      <h4 className="font-sans text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>✓</span> {lang === "hi" ? "डिज़ाइन की ताकत" : "Design Strengths"}
                      </h4>
                      <ul className="space-y-2 font-sans text-xs text-slate-300">
                        {review.strengths.map((st, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Data */}
                    <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                      <h4 className="font-sans text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>?</span> {lang === "hi" ? "लापता डेटा या अंतराल" : "Missing Data or Gaps"}
                      </h4>
                      <ul className="space-y-2 font-sans text-xs text-slate-300">
                        {review.missingData.map((md, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{md}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="rounded-xl bg-[#6366F1]/5 border border-[#6366F1]/10 p-4">
                      <h4 className="font-sans text-xs font-extrabold text-[#818CF8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>⟳</span> {lang === "hi" ? "सुझाए गए सुधार" : "Suggested Improvements"}
                      </h4>
                      <ul className="space-y-2 font-sans text-xs text-slate-300">
                        {review.improvements.map((imp, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-[#818CF8] font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-4">
                      <h4 className="font-sans text-xs font-extrabold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>!</span> {lang === "hi" ? "जोखिम और सुरक्षा विचार" : "Risk & Safety Considerations"}
                      </h4>
                      <ul className="space-y-2 font-sans text-xs text-slate-300">
                        {review.risks.map((r, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-red-400 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center border-t border-[#1E293B] pt-4">
                    <button
                      id="goto-workflow-btn"
                      onClick={() => setActiveSubTab("workflow")}
                      className="flex items-center gap-1 bg-[#22D3EE] text-[#070B14] px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#06B6D4]"
                    >
                      <span>{lang === "hi" ? "कार्यप्रवाह अनुक्रमक पर आगे बढ़ें" : "Proceed to Workflow Sequencer"}</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* STEP 2: WORKFLOW SEQUENCER */}
          {activeSubTab === "workflow" && (
            <motion.div
              key="workflow-sequencer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="rounded bg-[#818CF8]/10 border border-[#818CF8]/30 text-[#818CF8] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                  {lang === "hi" ? "परिनियोजन चरण" : "Deployment Stage"}
                </span>
                <h3 className="font-sans text-xl font-extrabold text-white mt-1">{lang === "hi" ? "एआई परियोजना कार्यप्रवाह अनुक्रम" : "AI Project Workflow Sequence"}</h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  {lang === "hi" ? "शुरू से अंत तक पेशेवर एआई चरणों को क्रम में व्यवस्थित करें (समस्या परिभाषा से निरंतर फीडबैक सुधार तक)।" : "Arrange the professional AI stages in order from start to finish (Problem definition to continuous feedback improvement)."}
                </p>
              </div>

              {/* Sequencer List */}
              <div className="space-y-2 mb-6">
                {currentWorkflow.map((item, idx) => {
                  return (
                    <motion.div
                      layout
                      key={item}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#1E293B] bg-[#070B14] shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#22D3EE]">{lang === "hi" ? `चरण ${idx + 1}` : `Step ${idx + 1}`}</span>
                        <span className="font-sans text-xs font-bold text-white">{getWorkflowStepLabel(item)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => swapWorkflowItems(idx, "up")}
                          disabled={idx === 0}
                          className="h-7 w-7 flex items-center justify-center rounded bg-[#131B2E] border border-[#1E293B] text-slate-400 disabled:opacity-20"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => swapWorkflowItems(idx, "down")}
                          disabled={idx === currentWorkflow.length - 1}
                          className="h-7 w-7 flex items-center justify-center rounded bg-[#131B2E] border border-[#1E293B] text-slate-400 disabled:opacity-20"
                        >
                          ▼
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Feedback alignment check */}
              {workflowSuccess !== null && (
                <div className={`p-4 rounded-xl border text-center mb-6 ${
                  workflowSuccess ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {workflowSuccess ? (
                    <div>
                      <p className="font-sans text-sm font-bold">{lang === "hi" ? "✓ सही ढंग से संरेखित! (+20 XP)" : "✓ Aligned Properly! (+20 XP)"}</p>
                      <p className="text-xs text-slate-300 mt-1">
                        {lang === "hi" 
                          ? "समस्या को समझें → डेटा एकत्र करें → मॉडल को प्रशिक्षित करें → एआई का परीक्षण करें → समाधान तैनात करें → एआई में सुधार करें।"
                          : "Understand Problem → Collect Data → Train Model → Test AI → Deploy Solution → Improve AI."}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-sans text-sm font-bold">{lang === "hi" ? "गलत कार्यप्रवाह क्रम" : "Maligned Sequence"}</p>
                      <p className="text-xs text-slate-300 mt-1">
                        {lang === "hi"
                          ? "कृपया पुनः प्रयास करें। (संकेत: पहले समस्या को समझें, फिर समाधान तैनात करें और फिर मॉडल को बेहतर बनाने के लिए लगातार फीडबैक एकत्र करें!)"
                          : "Please try again. (HINT: Understand the problem first, deploy your solution, and then continuously gather feedback to improve the model!)"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetWorkflow}
                  className="px-4 py-2 rounded-lg border border-[#1E293B] bg-[#131B2E] text-slate-300 text-xs font-semibold"
                >
                  {lang === "hi" ? "क्रम रीसेट करें" : "Reset Sequence"}
                </button>
                {workflowSuccess ? (
                  <button
                    id="goto-reflection-btn"
                    onClick={() => setActiveSubTab("reflection")}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-[#22D3EE] text-[#070B14] text-xs font-bold rounded-lg hover:bg-[#06B6D4]"
                  >
                    <span>{lang === "hi" ? "चिंतन पर आगे बढ़ें" : "Proceed to Reflection"}</span>
                    <Send className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    id="check-workflow-btn"
                    onClick={checkWorkflowSequence}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-bold rounded-lg hover:scale-[1.02] active:scale-95"
                  >
                    {lang === "hi" ? "पाइपलाइन संरेखण जांचें" : "Check Pipeline Alignment"}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: REFREFLECTION QUESTION */}
          {activeSubTab === "reflection" && (
            <motion.div
              key="strategic-reflection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="rounded bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#22D3EE] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                  {lang === "hi" ? "गहन चिंतन" : "Critical Thinking"}
                </span>
                <h3 className="font-sans text-xl font-extrabold text-white mt-1">{lang === "hi" ? "महत्वपूर्ण विकल्प" : "The Pivot Choice"}</h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  {lang === "hi" ? "एआई प्रोजेक्ट चक्र (समस्या, डेटा, मॉडल, आउटपुट) का कौन सा चरण आपको लगता है कि परियोजना की सफलता की गारंटी के लिए सबसे महत्वपूर्ण है? अपने विकल्प को सही ठहराएं।" : "Which stage of the AI Project Cycle (Problem, Data, Model, Output) do you think is the absolute most important to guarantee project success? Justify your choice."}
                </p>
              </div>

              <div className="space-y-4">
                {/* stage choices */}
                <div className="grid grid-cols-2 gap-2.5">
                  {["Problem", "Data", "Model", "Output"].map((st) => {
                    const isSelected = selectedImportance === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setSelectedImportance(st)}
                        disabled={reflectionSubmitted}
                        className={`px-4 py-3 border text-sm font-bold rounded-xl transition-all ${
                          isSelected
                            ? "bg-[#1E293B] border-[#06B6D4] text-[#22D3EE]"
                            : "bg-[#070B14] border-[#1E293B] text-slate-300 hover:bg-[#1E293B]"
                        }`}
                      >
                        {getStageLabelHi(st)}
                      </button>
                    );
                  })}
                </div>

                {/* justification explanation text */}
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-4">
                  <h4 className="font-sans text-xs font-bold text-white mb-2">{lang === "hi" ? "अपना औचित्य लिखें" : "Write Your Justification"}</h4>
                  <textarea
                    id="importance-explanation"
                    placeholder={lang === "hi" ? "अपने चयन के लिए एक संक्षिप्त औचित्य प्रदान करें..." : "Provide a short justification for your selection..."}
                    disabled={reflectionSubmitted}
                    onChange={(e) => setImportanceExplanation(e.target.value)}
                    value={importanceExplanation}
                    className="w-full h-24 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2.5 text-xs resize-none"
                  />
                </div>

                {reflectionSubmitted ? (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <p className="font-sans text-sm font-bold text-emerald-400">{lang === "hi" ? "✓ चिंतन सबमिट किया गया! (+15 XP)" : "✓ Reflection Submitted! (+15 XP)"}</p>
                    <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                      {lang === "hi" 
                        ? "चाहे आपने समस्या परिभाषा या डेटा गुणवत्ता को चुना हो, आपकी रणनीतिक तर्क पूरी तरह मान्य है। उद्योग में, एक स्पष्ट समस्या से शुरुआत करना सही मुद्दे का समाधान करता है!"
                        : "Whether you chose Problem definition or Data quality, your strategic reasoning is valid. In industry, starting with a clean problem solves the correct issue!"}
                    </p>
                    <button
                      id="canvas-finish-btn"
                      onClick={onComplete}
                      className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#C4B286] to-[#D29264] text-white text-xs font-bold rounded-xl hover:scale-103"
                    >
                      {lang === "hi" ? "अंतिम समीक्षा पर आगे बढ़ें" : "Proceed to Final Review"}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      id="submit-reflection-btn"
                      onClick={handleReflectionSubmit}
                      disabled={!selectedImportance || !importanceExplanation}
                      className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                        !selectedImportance || !importanceExplanation
                          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700"
                          : "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white hover:scale-102"
                      }`}
                    >
                      {lang === "hi" ? "चिंतन सबमिट करें" : "Submit Reflection"}
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
