import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Award, Zap, ChevronRight, RefreshCw, Layers, Sparkles, BookOpenCheck } from "lucide-react";
import { UI_TRANSLATIONS } from "../data/translations";

interface BadgeUnlockProps {
  xp: number;
  onReset: () => void;
  lang: "en" | "hi";
}

export default function BadgeUnlock({ xp, onReset, lang }: BadgeUnlockProps) {
  const [showSparkles, setShowSparkles] = useState(false);
  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    // Trigger celebratory sparkles after render
    const timer = setTimeout(() => {
      setShowSparkles(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="badge-unlock-screen" className="mx-auto max-w-3xl px-4 py-8 md:py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl border border-[#1E293B] bg-[#131B2E] p-8 md:p-12 relative overflow-hidden shadow-2xl"
      >
        {/* Decorative lighting grids in background */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#6366F1]/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#06B6D4]/10 blur-3xl animate-pulse" />

        {/* Dynamic badge scaling container */}
        <div className="relative inline-block mb-6">
          {showSparkles && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] rounded-full blur-xl opacity-40 animate-pulse"
            />
          )}

          <motion.div
            initial={{ y: 20, rotate: -15, scale: 0.8 }}
            animate={{ y: 0, rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#6366F1] via-[#06B6D4] to-yellow-400 p-1 shadow-2xl"
          >
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#070B14]">
              <span className="text-5xl filter drop-shadow-md select-none animate-bounce mt-1">💡</span>
            </div>
          </motion.div>
        </div>

        <p className="font-mono text-xs font-bold tracking-widest text-[#22D3EE] uppercase mb-2">
          {lang === "hi" ? "मिशन पूरा हुआ" : "Mission Accomplished"}
        </p>
        <h2 className="font-sans text-3xl font-black text-white md:text-4xl leading-tight">
          {lang === "hi" ? "एआई समाधान डिजाइनर बैज अनलॉक हुआ!" : "AI Solution Designer Badge Unlocked!"}
        </h2>
        
        <p className="mx-auto max-w-md font-sans text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === "hi" 
            ? "एआई इनोवेशन काउंसिल आधिकारिक तौर पर आपको एक सत्यापित एआई समाधान आर्किटेक्ट के रूप में प्रमाणित करती है। आपने समुदाय की दुविधाओं का सफलतापूर्वक विश्लेषण किया और मजबूत परियोजना चक्रों का निर्माण किया!"
            : "The AI Innovation Council officially certifies you as a verified AI Solution Architect. You successfully deconstructed community dilemmas and mapped robust project cycles!"}
        </p>

        {/* Points & Achievements statistics breakdown */}
        <div className="mx-auto max-w-md bg-[#070B14] rounded-2xl border border-[#1E293B] p-5 my-8">
          <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left border-b border-[#1E293B] pb-2 mb-3">
            {lang === "hi" ? "उपलब्धियों का विवरण" : "Tally of Achievements"}
          </h3>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <BookOpenCheck className="h-4 w-4 text-emerald-400" />
                <span>{lang === "hi" ? "पाठ्यपुस्तक और ज्ञान जाँच" : "Textbook & MCQ Check"}</span>
              </span>
              <span className="font-mono font-bold text-white">+50 XP</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#818CF8]" />
                <span>{lang === "hi" ? "परिदृश्य समाधान" : "Branching Scenario Resolve"}</span>
              </span>
              <span className="font-mono font-bold text-white">+30 XP</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#22D3EE]" />
                <span>{lang === "hi" ? "एआई कैनवास आर्किटेक्ट और चिंतन" : "AI Canvas Architect & Reflection"}</span>
              </span>
              <span className="font-mono font-bold text-white">+45 XP</span>
            </div>

            <div className="flex justify-between items-center text-xs pt-2.5 border-t border-[#1E293B] font-bold">
              <span className="text-white flex items-center gap-1.5">
                <Zap className="h-4.5 w-4.5 text-[#F97316] animate-pulse" />
                <span>{lang === "hi" ? "कुल संचित स्कोर" : "Total Accumulated Score"}</span>
              </span>
              <span className="font-mono text-sm text-[#F97316]">{xp} XP {lang === "hi" ? "अंक" : "Points"}</span>
            </div>
          </div>
        </div>

        {/* Sneak peek / teaser transition briefing for Module 6 */}
        <div className="rounded-2xl border border-[#06B6D4]/30 bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 p-5 text-left mb-8 max-w-lg mx-auto">
          <p className="font-mono text-[9px] font-extrabold text-[#22D3EE] uppercase tracking-wider mb-1">
            {lang === "hi" ? "एक झलक: मॉड्यूल 6" : "Sneak Peek: Module 6"}
          </p>
          <h4 className="font-sans text-xs font-bold text-white mb-1.5">
            {lang === "hi" ? "मॉडल प्रशिक्षण में परिवर्तन" : "Transitioning to Model Training"}
          </h4>
          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            {lang === "hi"
              ? "मॉड्यूल 5 में, आपने वैचारिक रूप से संपूर्ण एआई सिस्टम डिज़ाइन किए। मॉड्यूल 6 के लिए तैयार हो जाइए, जहाँ आप व्यावहारिक कार्यान्वयन की सीमा को पार करेंगे! आप PictoBlox का उपयोग करके अपने स्वयं के इमेज क्लासिफिकेशन मॉडल को प्रशिक्षित, परीक्षण और ट्यून करेंगे।"
              : "In Module 5, you designed complete AI systems conceptually. Get ready for Module 6, where you will cross the boundary into physical implementation! You'll train, test, and tune your own image classification model using PictoBlox."}
          </p>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-[#1E293B] bg-[#131B2E] text-slate-300 text-xs font-semibold rounded-xl hover:bg-[#1C2538] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t.resetProgress}</span>
          </button>

          <button
            onClick={() => {
              alert(
                lang === "hi"
                  ? "बधाई हो! आपने संपूर्ण मॉड्यूल 5 पूरा कर लिया है। अपने शिक्षक को अपना अनलॉक किया हुआ बैज दिखाएं।"
                  : "Congratulations! You have completed the entire Module 5. Show your unlocked badge to your teacher to claim your official credentials."
              );
            }}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-[#6366F1]/20"
          >
            <span>{lang === "hi" ? "मॉड्यूल 5 समाप्त करें" : "Finish Module 5"}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </motion.div>
    </div>
  );
}
