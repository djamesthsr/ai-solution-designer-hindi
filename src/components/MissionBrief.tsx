import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, ChevronRight, Play, Users, Trophy } from "lucide-react";
import { UI_TRANSLATIONS } from "../data/translations";

interface MissionBriefProps {
  onComplete: () => void;
  xp: number;
  addXp: (amount: number) => void;
  lang: "en" | "hi";
}

export default function MissionBrief({ onComplete, xp, addXp, lang }: MissionBriefProps) {
  const [slide, setSlide] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const t = UI_TRANSLATIONS[lang];

  const startMission = () => {
    setHasStarted(true);
    addXp(10); // Reward 10 XP for beginning!
  };

  const nextSlide = () => {
    if (slide < 3) {
      setSlide(slide + 1);
      addXp(5); // 5 XP per read-through slide!
    } else {
      onComplete();
    }
  };

  const advisors = [
    {
      name: lang === "hi" ? "डॉ. क्लारा चेन" : "Dr. Clara Chen",
      role: lang === "hi" ? "एआई मुख्य वैज्ञानिक" : "AI Lead Scientist",
      quote: lang === "hi" 
        ? "एआई कोई जादू नहीं है; यह एक संरचनात्मक चक्र (structural loop) है। यदि हम पहले समस्या को स्पष्ट रूप से परिभाषित नहीं करते हैं, तो मॉडल समाधान नहीं बल्कि शोर सीखता है।" 
        : "AI isn't magic; it's a structural loop. If we don't define the problem clearly first, the model learns noise, not solutions.",
      avatar: "👩‍🔬"
    },
    {
      name: lang === "hi" ? "देव पटेल" : "Dev Patel",
      role: lang === "hi" ? "सिस्टम आर्किटेक्ट" : "Systems Architect",
      quote: lang === "hi"
        ? "डेटा ही जीवनदायिनी है। सामान्य डेटा के साथ सबसे साफ मॉडल बिना किसी ईंधन के चलने वाली तेज गति वाली स्पोर्ट्स कार की तरह है।"
        : "Data is the lifeblood. The cleanest model with generic data is like a high-speed sports car running without any fuel.",
      avatar: "👨‍💻"
    },
    {
      name: lang === "hi" ? "प्रिंसिपल रॉबर्ट्स" : "Principal Roberts",
      role: lang === "hi" ? "क्लाइंट / स्कूल प्रायोजक" : "Client / School Sponsor",
      quote: lang === "hi"
        ? "हमारा स्कूल ऊर्जा, भोजन और छात्रों की समय-सारणी का समय बर्बाद करता है। हमें समाधान चक्र को तैयार करने के लिए आप जैसे जूनियर डिजाइनरों की आवश्यकता है।"
        : "Our school wastes energy, food, and student scheduling time. We need junior designers like you to architect the solution cycle.",
      avatar: "👨‍🏫"
    }
  ];

  if (!hasStarted) {
    return (
      <div id="brief-gate" className="mx-auto max-w-4xl px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#1E293B] bg-[#131B2E] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Ambient light effects in background */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#06B6D4]/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#6366F1]/10 blur-3xl" />

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] shadow-lg shadow-[#6366F1]/20">
            <Shield className="h-8 w-8 text-white animate-pulse" />
          </div>

          <p className="font-mono text-xs font-bold tracking-widest text-[#22D3EE] uppercase mb-2">{t.missionTheme}</p>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
            {t.missionTitle}
          </h2>
          <p className="mx-auto max-w-xl font-sans text-base text-slate-300 leading-relaxed mb-8">
            {t.missionSubtitle}
          </p>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-xl bg-[#070B14] p-4 border border-[#1E293B]">
              <Trophy className="h-5 w-5 text-[#F97316] mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{t.collectXP}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.collectXPDesc}</p>
            </div>
            <div className="rounded-xl bg-[#070B14] p-4 border border-[#1E293B]">
              <Sparkles className="h-5 w-5 text-[#22D3EE] mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{t.interactiveBook}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.interactiveBookDesc}</p>
            </div>
            <div className="rounded-xl bg-[#070B14] p-4 border border-[#1E293B]">
              <Users className="h-5 w-5 text-[#818CF8] mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{t.aiMentorFeedback}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.aiMentorFeedbackDesc}</p>
            </div>
          </div>

          <button
            id="start-mission-btn"
            onClick={startMission}
            className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-[#6366F1]/30 active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>{t.launchBriefing}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="brief-slider" className="mx-auto max-w-4xl px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-[#1E293B] bg-[#131B2E] p-6 md:p-10 shadow-xl"
        >
          {/* Header Progress */}
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4 mb-6">
            <span className="font-mono text-xs font-bold text-[#22D3EE]">{t.briefingProgress} ({slide}/3)</span>
            <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-[#070B14]">
              <div
                className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] transition-all duration-300"
                style={{ width: `${(slide / 3) * 100}%` }}
              />
            </div>
          </div>

          {slide === 1 && (
            <div id="slide-1">
              <h3 className="font-sans text-2xl font-extrabold text-white mb-4">
                {t.objectiveTitle}
              </h3>
              <p className="font-sans text-slate-300 text-sm leading-relaxed mb-6">
                {t.objectiveDesc}
              </p>
              
              <div className="rounded-2xl bg-[#070B14] p-5 border border-[#1E293B] mb-6">
                <h4 className="font-sans text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#F97316]" />
                  {t.missionInstructions}
                </h4>
                <ul className="space-y-3 font-sans text-xs text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-[#22D3EE] font-bold">1.</span>
                    <span><strong>{t.deconstruct}:</strong> {t.deconstructDesc}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#22D3EE] font-bold">2.</span>
                    <span><strong>{t.consult}:</strong> {t.consultDesc}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#22D3EE] font-bold">3.</span>
                    <span><strong>{t.architect}:</strong> {t.architectDesc}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {slide === 2 && (
            <div id="slide-2">
              <h3 className="font-sans text-2xl font-extrabold text-white mb-4">
                {t.meetAdvisors}
              </h3>
              <p className="font-sans text-slate-300 text-sm leading-relaxed mb-6">
                {t.advisorsDesc}
              </p>

              <div className="space-y-4 mb-6">
                {advisors.map((adv, idx) => (
                  <div key={idx} className="flex gap-4 rounded-xl bg-[#070B14] p-4 border border-[#1E293B]">
                    <div className="text-3xl filter drop-shadow-sm select-none">{adv.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{adv.name}</h4>
                        <span className="rounded bg-[#1E293B] px-1.5 py-0.5 font-mono text-[9px] text-[#22D3EE]">{adv.role}</span>
                      </div>
                      <p className="mt-1 font-sans text-xs text-slate-400 italic">"{adv.quote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide === 3 && (
            <div id="slide-3">
              <h3 className="font-sans text-2xl font-extrabold text-white mb-4">
                {t.protocolTitle}
              </h3>
              <p className="font-sans text-slate-300 text-sm leading-relaxed mb-4">
                {t.protocolDesc}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
                <div className="rounded-xl border border-dashed border-[#1E293B] bg-[#070B14]/40 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 font-sans font-black text-sm">P</div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{t.stageProblem}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{t.stageProblemDesc}</p>
                </div>

                <div className="rounded-xl border border-dashed border-[#1E293B] bg-[#070B14]/40 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-sans font-black text-sm">D</div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{t.stageData}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{t.stageDataDesc}</p>
                </div>

                <div className="rounded-xl border border-dashed border-[#1E293B] bg-[#070B14]/40 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-sans font-black text-sm">M</div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{t.stageModel}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{t.stageModelDesc}</p>
                </div>

                <div className="rounded-xl border border-dashed border-[#1E293B] bg-[#070B14]/40 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-sans font-black text-sm">O</div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{t.stageOutput}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{t.stageOutputDesc}</p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4 text-center">
                <p className="font-sans text-xs text-emerald-400 font-semibold">
                  {t.fullyBriefed}
                </p>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-[#1E293B] pt-4 mt-6">
            <button
              onClick={() => slide > 1 && setSlide(slide - 1)}
              disabled={slide === 1}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                slide === 1 ? "text-slate-600 cursor-not-allowed" : "text-slate-300 hover:bg-[#1E293B]"
              }`}
            >
              {t.back}
            </button>
            <button
              id="brief-next-btn"
              onClick={nextSlide}
              className="flex items-center gap-1 text-xs font-bold bg-[#22D3EE] text-[#070B14] px-4 py-2.5 rounded-lg hover:bg-[#06B6D4] transition-colors"
            >
              <span>{slide === 3 ? t.beginLab : t.nextStep}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
