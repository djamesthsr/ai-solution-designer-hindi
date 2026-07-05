import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldAlert, CheckCircle2, ChevronRight, HelpCircle, Users, Sparkles, Send } from "lucide-react";
import { PEER_PROJECTS } from "../data/scenarios";
import { PEER_PROJECTS_HI } from "../data/scenarios_hi";
import { UI_TRANSLATIONS } from "../data/translations";

interface Activity4ReflectionProps {
  onComplete: () => void;
  xp: number;
  addXp: (amount: number) => void;
  problemText?: string;
  dataText?: string;
  lang: "en" | "hi";
}

export default function Activity4Reflection({
  onComplete,
  xp,
  addXp,
  problemText = "",
  dataText = "",
  lang,
}: Activity4ReflectionProps) {
  const [activeStepTab, setActiveStepTab] = useState<"essays" | "peer" | "stars">("essays");
  const t = UI_TRANSLATIONS[lang];

  // Essay written state
  const [essays, setEssays] = useState({
    solve: problemText 
      ? (lang === "hi" ? `हमने समाधान किया: ${problemText}` : `We solved: ${problemText}`) 
      : "",
    whyData: dataText 
      ? (lang === "hi" ? `हमने विश्लेषण के लिए चुना: ${dataText}` : `We chose to analyze: ${dataText}`) 
      : "",
    helpPeople: "",
    risks: ""
  });
  const [essaysSubmitted, setEssaysSubmitted] = useState<boolean>(false);

  // Peer review state
  const [selectedProject, setSelectedProject] = useState<"A" | "B" | null>(null);
  const [showPeerFeedback, setShowPeerFeedback] = useState<boolean>(false);

  // Star ratings state
  const [ratings, setRatings] = useState({
    problem: 0,
    data: 0,
    model: 0,
    output: 0
  });
  const [starsSubmitted, setStarsSubmitted] = useState<boolean>(false);

  const handleEssayChange = (field: keyof typeof essays, value: string) => {
    setEssays((prev) => ({ ...prev, [field]: value }));
  };

  const submitEssays = () => {
    if (!essays.solve || !essays.whyData || !essays.helpPeople || !essays.risks) {
      alert(
        lang === "hi"
          ? "कृपया सबमिट करने से पहले सभी चार चिंतन निबंधों को पूरा करें।"
          : "Please fill out all four reflection essays before submitting."
      );
      return;
    }
    setEssaysSubmitted(true);
    addXp(20); // 20 XP for final written submission
  };

  const handleProjectSelect = (proj: "A" | "B") => {
    setSelectedProject(proj);
    setShowPeerFeedback(true);
    if (proj === "A") {
      addXp(15); // Reward 15 XP for selecting responsible Project A!
    }
  };

  const setStarRating = (metric: keyof typeof ratings, score: number) => {
    if (starsSubmitted) return;
    setRatings((prev) => ({ ...prev, [metric]: score }));
  };

  const submitStars = () => {
    if (ratings.problem === 0 || ratings.data === 0 || ratings.model === 0 || ratings.output === 0) {
      alert(
        lang === "hi"
          ? "कृपया अपनी परियोजना के सभी चार मापदंडों का मूल्यांकन करें।"
          : "Please rate all four criteria of your designed project."
      );
      return;
    }
    setStarsSubmitted(true);
    addXp(15); // 15 XP for completing project self-evaluation!
  };

  const allEssaysFilled = essays.solve && essays.whyData && essays.helpPeople && essays.risks;
  const peerProjectsList = lang === "hi" ? PEER_PROJECTS_HI : PEER_PROJECTS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Activity Header */}
      <div className="mb-6 text-center">
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {t.act4Title}
        </h2>
        <p className="font-sans text-sm text-slate-400 mt-1">
          {t.act4Subtitle}
        </p>
      </div>

      {/* Sub tabs nav */}
      <div className="flex border-b border-[#1E293B] bg-[#131B2E] rounded-t-2xl overflow-hidden p-1 gap-1">
        <button
          id="essays-tab"
          onClick={() => setActiveStepTab("essays")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeStepTab === "essays"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>1. {lang === "hi" ? "लिखित प्रस्तुति" : "Written Presentation"}</span>
          {essaysSubmitted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>

        <button
          id="peer-tab"
          onClick={() => setActiveStepTab("peer")}
          disabled={!essaysSubmitted}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            !essaysSubmitted
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : activeStepTab === "peer"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>2. {lang === "hi" ? "एआई पीयर ऑडिट" : "AI Peer Audit"}</span>
          {showPeerFeedback && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>

        <button
          id="stars-tab"
          onClick={() => setActiveStepTab("stars")}
          disabled={!showPeerFeedback}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            !showPeerFeedback
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : activeStepTab === "stars"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <Star className="h-4 w-4" />
          <span>3. {lang === "hi" ? "आत्म-मूल्यांकन" : "Project self-evaluation"}</span>
          {starsSubmitted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>
      </div>

      <div className="bg-[#131B2E] border-x border-b border-[#1E293B] rounded-b-2xl p-6 shadow-xl min-h-[440px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ESSAYS SECTION */}
          {activeStepTab === "essays" && (
            <motion.div
              key="essays-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="border-b border-[#1E293B] pb-4">
                <h3 className="font-sans text-base font-extrabold text-white">
                  {lang === "hi" ? "ज़िम्मेदार एआई पिच प्रस्तुति" : "Responsible AI Pitch Presentation"}
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-0.5">
                  {lang === "hi"
                    ? "औपचारिक रूप से बताएं कि आपका डिज़ाइन किया गया समाधान स्कूल के संचालन को बढ़ाते हुए गोपनीयता की रक्षा कैसे करता है।"
                    : "Formalize how your designed solution protects privacy while enhancing school operations."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* solve */}
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-4">
                  <label htmlFor="solve-essay" className="block text-xs font-bold text-[#22D3EE] mb-2 uppercase tracking-wider">
                    {lang === "hi" ? "Q1. आपके एआई ने किस समस्या का समाधान किया?" : "Q1. What problem did your AI solve?"}
                  </label>
                  <textarea
                    id="solve-essay"
                    placeholder={
                      lang === "hi"
                        ? "जैसे, यह उसी दिन की परीक्षा के ओवरलैप को रोकने के लिए क्लास टेस्ट शेड्यूल करता है..."
                        : "E.g., It automatically schedules class tests to prevent same-day overlap..."
                    }
                    disabled={essaysSubmitted}
                    onChange={(e) => handleEssayChange("solve", e.target.value)}
                    value={essays.solve}
                    className="w-full h-20 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                  />
                </div>

                {/* whyData */}
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-4">
                  <label htmlFor="whyData-essay" className="block text-xs font-bold text-[#22D3EE] mb-2 uppercase tracking-wider">
                    {lang === "hi" ? "Q2. आपने वह डेटा क्यों चुना?" : "Q2. Why did you choose that data?"}
                  </label>
                  <textarea
                    id="whyData-essay"
                    placeholder={
                      lang === "hi"
                        ? "जैसे, परीक्षा की समय-सीमा और पाठ्यक्रम बिना दखल दिए सीधे छात्र के कार्यक्रम को दर्शाते हैं..."
                        : "E.g., Deadlines and syllabi directly reflect student schedules without being invasive..."
                    }
                    disabled={essaysSubmitted}
                    onChange={(e) => handleEssayChange("whyData", e.target.value)}
                    value={essays.whyData}
                    className="w-full h-20 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                  />
                </div>

                {/* helpPeople */}
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-4">
                  <label htmlFor="helpPeople-essay" className="block text-xs font-bold text-[#22D3EE] mb-2 uppercase tracking-wider">
                    {lang === "hi" ? "Q3. आपका एआई लोगों की कैसे मदद करेगा?" : "Q3. How will your AI help people?"}
                  </label>
                  <textarea
                    id="helpPeople-essay"
                    placeholder={
                      lang === "hi"
                        ? "जैसे, यह तनाव को कम करता है और छात्रों को पहले से अध्ययन कार्यक्रम की योजना बनाने की अनुमति देता है..."
                        : "E.g., It reduces cognitive burnout and allows students to plan study schedules early..."
                    }
                    disabled={essaysSubmitted}
                    onChange={(e) => handleEssayChange("helpPeople", e.target.value)}
                    value={essays.helpPeople}
                    className="w-full h-20 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                  />
                </div>

                {/* risks */}
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-4">
                  <label htmlFor="risks-essay" className="block text-xs font-bold text-[#22D3EE] mb-2 uppercase tracking-wider">
                    {lang === "hi" ? "Q4. लोगों को किन जोखिमों पर विचार करना चाहिए?" : "Q4. What risks should people consider?"}
                  </label>
                  <textarea
                    id="risks-essay"
                    placeholder={
                      lang === "hi"
                        ? "जैसे, सुरक्षा, डेटा सुरक्षा, और गलत अनुस्मारक अलर्ट भेजने वाली मॉडल की अशुद्धता..."
                        : "E.g., Security, data protection, and model inaccuracy leading to miscalendared alerts..."
                    }
                    disabled={essaysSubmitted}
                    onChange={(e) => handleEssayChange("risks", e.target.value)}
                    value={essays.risks}
                    className="w-full h-20 bg-[#131B2E] border border-[#1E293B] text-slate-300 rounded-lg p-2 text-xs resize-none"
                  />
                </div>
              </div>

              {essaysSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center max-w-sm mx-auto">
                  <p className="font-sans text-sm font-bold text-emerald-400">
                    {lang === "hi" ? "✓ प्रस्तुति सबमिट की गई! (+20 XP)" : "✓ Presentation Submitted! (+20 XP)"}
                  </p>
                  <button
                    id="goto-peer-btn"
                    onClick={() => setActiveStepTab("peer")}
                    className="mt-3 inline-flex items-center gap-1 bg-[#22D3EE] text-[#070B14] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#06B6D4]"
                  >
                    <span>{lang === "hi" ? "सहकर्मी परियोजनाओं का विश्लेषण करें" : "Analyze Peer Projects"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center pt-2">
                  <button
                    id="submit-essays-btn"
                    onClick={submitEssays}
                    disabled={!allEssaysFilled}
                    className={`px-8 py-3.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                      !allEssaysFilled
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700"
                        : "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white hover:scale-102"
                    }`}
                  >
                    {lang === "hi" ? "प्रस्तुति पिच लॉक करें" : "Lock Presentation Pitch"}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: AI PEER AUDIT */}
          {activeStepTab === "peer" && (
            <motion.div
              key="peer-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <span className="rounded bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#22D3EE] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                  {lang === "hi" ? "डेटा गवर्नेंस ऑडिट" : "Data Governance Audit"}
                </span>
                <h3 className="font-sans text-lg font-extrabold text-white mt-1">
                  {lang === "hi" ? "ज़िम्मेदार एआई सहकर्मी समीक्षा" : "Responsible AI Peer Review"}
                </h3>
                <p className="font-sans text-xs text-slate-400 max-w-md mx-auto mt-1">
                  {lang === "hi"
                    ? "दो होमवर्क रिमाइंडर प्रोजेक्ट ब्लूप्रिंट का मूल्यांकन करें। कौन सा आर्किटेक्चर ज़िम्मेदार डिज़ाइन और व्यक्तिगत गोपनीयता सीमाओं का अनुपालन करता है?"
                    : "Evaluate two Homework Reminder project blueprints. Which architecture complies with responsible design and personal privacy constraints?"}
                </p>
              </div>

              {/* Comparing cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {peerProjectsList.map((p, index) => {
                  const isSelected = selectedProject === p.id.replace("project_", "").toUpperCase();
                  const isA = p.id === "project_a";

                  let cardStyle = "bg-[#070B14] border-[#1E293B] hover:border-slate-700";
                  if (showPeerFeedback) {
                    if (isA) {
                      cardStyle = "bg-emerald-500/5 border-emerald-500/30 text-emerald-400";
                    } else {
                      cardStyle = "bg-red-500/5 border-red-500/30 text-red-400";
                    }
                  } else if (selectedProject === (isA ? "A" : "B")) {
                    cardStyle = "border-[#06B6D4]";
                  }

                  return (
                    <button
                      id={`peer-${p.id}`}
                      key={p.id}
                      onClick={() => handleProjectSelect(isA ? "A" : "B")}
                      disabled={showPeerFeedback}
                      className={`text-left rounded-xl border p-5 transition-all flex flex-col justify-between ${cardStyle}`}
                    >
                      <div>
                        <h4 className="font-sans text-sm font-bold text-white mb-1">{p.name}</h4>
                        <p className="font-sans text-xs text-slate-400 mb-3">{p.desc}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                              {lang === "hi" ? "एकत्रित डेटा:" : "Collects Data:"}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {p.collects.map((c, i) => (
                                <span key={i} className="rounded bg-[#131B2E] border border-[#1E293B] px-2 py-0.5 text-[9px] text-slate-300 font-mono">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === "hi" ? "अपेक्षित आउटपुट:" : "Expected Output:"}
                            </span>
                            <p className="font-sans text-xs text-slate-300">{p.output}</p>
                          </div>
                        </div>
                      </div>

                      {!showPeerFeedback && (
                        <div className="mt-4 flex items-center justify-end text-xs font-bold text-[#22D3EE] group-hover:text-white pt-2 border-t border-[#1E293B]/60 w-full">
                          <span>{lang === "hi" ? `परियोजना ${isA ? "A" : "B"} चुनें` : `Select Project ${isA ? "A" : "B"}`}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate peer review explanation panel */}
              {showPeerFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl border ${
                    selectedProject === "A"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : "bg-red-500/10 border-red-500/20 text-red-300"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-3xl filter drop-shadow-sm select-none shrink-0">
                      {selectedProject === "A" ? "🎉" : "⚠️"}
                    </span>
                    <div>
                      <h4 className="font-sans text-sm font-bold leading-none mb-1.5">
                        {selectedProject === "A"
                          ? (lang === "hi" ? "ऑडिट स्वीकृत! परियोजना ए ज़िम्मेदार है (+15 XP)" : "Audit Approved! Project A is Responsible (+15 XP)")
                          : (lang === "hi" ? "ऑडिट फ्लैग किया गया! परियोजना बी दखल देने वाली है" : "Audit Flagged! Project B is Invasive")}
                      </h4>
                      <p className="font-sans text-xs leading-relaxed text-slate-300">
                        {selectedProject === "A"
                          ? peerProjectsList[0].reason
                          : `${peerProjectsList[1].reason} ${lang === "hi" ? "परियोजना ए वास्तव में सही और ज़िम्मेदार विकल्प है।" : "Project A is indeed the correct and responsible choice."}`}
                      </p>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          id="goto-stars-btn"
                          onClick={() => setActiveStepTab("stars")}
                          className="flex items-center gap-1.5 bg-[#22D3EE] text-[#070B14] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#06B6D4]"
                        >
                          <span>{lang === "hi" ? "आत्म-मूल्यांकन पर जाएं" : "Go to self-evaluation"}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB 3: STAR SELF-EVALUATION */}
          {activeStepTab === "stars" && (
            <motion.div
              key="stars-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="rounded bg-[#818CF8]/10 border border-[#818CF8]/30 text-[#818CF8] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                  {lang === "hi" ? "गुणवत्ता आश्वासन" : "Quality Assurance"}
                </span>
                <h3 className="font-sans text-lg font-extrabold text-white mt-1">
                  {lang === "hi" ? "परियोजना आत्म-मूल्यांकन रूब्रिक" : "Project Self-Evaluation Rubric"}
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  {lang === "hi"
                    ? "आपका डिज़ाइन किया गया प्रोजेक्ट कैनवास पेशेवर रूब्रिक में कैसा प्रदर्शन करता है? 5 स्टार में से अपने काम का निष्पक्ष मूल्यांकन करें।"
                    : "How strongly does your designed Project Canvas perform across the professional rubric? Evaluate your work fairly out of 5 stars."}
                </p>
              </div>

              {/* Rating metrics lists */}
              <div className="space-y-4 rounded-xl border border-[#1E293B] bg-[#070B14] p-5 mb-6">
                {["problem", "data", "model", "output"].map((metric) => {
                  const metricLabel =
                    metric === "problem"
                      ? (lang === "hi" ? "स्पष्ट समस्या विवरण" : "Clear Problem Statement")
                      : metric === "data"
                      ? (lang === "hi" ? "प्रासंगिक और नैतिक डेटा" : "Relevant & Ethical Data")
                      : metric === "model"
                      ? (lang === "hi" ? "उपयुक्त संरेखित मॉडल" : "Suitable Aligned Model")
                      : (lang === "hi" ? "कार्रवाई योग्य उपयोगी आउटपुट" : "Actionable Useful Output");
                  
                  const score = ratings[metric as keyof typeof ratings];

                  return (
                    <div key={metric} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1E293B] pb-3 last:border-0 last:pb-0">
                      <span className="font-sans text-xs font-semibold text-slate-300">{metricLabel}</span>
                      
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            id={`star-${metric}-${star}`}
                            key={star}
                            onClick={() => setStarRating(metric as any, star)}
                            disabled={starsSubmitted}
                            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
                              star <= score
                                ? "text-amber-400 scale-110"
                                : "text-slate-600 hover:text-slate-400"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {starsSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="font-sans text-sm font-bold text-emerald-400">
                    {lang === "hi" ? "🎉 परियोजना आत्म-मूल्यांकन पूरा हुआ! (+15 XP)" : "🎉 Project Self-Evaluation complete! (+15 XP)"}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {lang === "hi"
                      ? "आपका गुणवत्ता ऑडिट लॉक है। एआई इनोवेशन काउंसिल ने आपके आधिकारिक प्रमाण-पत्र कार्ड को अधिकृत कर दिया है!"
                      : "Your quality audit is locked. The AI Innovation Council has authorized your official certification card!"}
                  </p>
                  <button
                    id="reflection-finish-btn"
                    onClick={onComplete}
                    className="mt-4 inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-xl hover:scale-103 shadow-md shadow-emerald-500/20"
                  >
                    <span>{lang === "hi" ? "बैज प्राप्त करें और मॉड्यूल 6 अनलॉक करें" : "Claim Badge & Unlock Module 6"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    id="submit-stars-btn"
                    onClick={submitStars}
                    className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-bold rounded-xl hover:scale-102"
                  >
                    {lang === "hi" ? "आत्म-मूल्यांकन सबमिट करें" : "Submit Self-Evaluation"}
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
