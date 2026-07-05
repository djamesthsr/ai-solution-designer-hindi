import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Layers, Check, HelpCircle, ArrowRight, RefreshCw, Sparkles, BookOpenCheck } from "lucide-react";
import { KNOWLEDGE_CHECK_QUESTIONS } from "../data/scenarios";
import { KNOWLEDGE_CHECK_QUESTIONS_HI } from "../data/scenarios_hi";
import { MCQQuestion } from "../types";
import { UI_TRANSLATIONS } from "../data/translations";

interface Activity1ProjectCycleProps {
  onComplete: () => void;
  xp: number;
  addXp: (amount: number) => void;
  lang: "en" | "hi";
}

export default function Activity1ProjectCycle({ onComplete, xp, addXp, lang }: Activity1ProjectCycleProps) {
  const [activeTab, setActiveTab] = useState<"book" | "sequence" | "quiz">("book");
  const t = UI_TRANSLATIONS[lang];
  
  // Interactive Book State
  const [bookPage, setBookPage] = useState<"welcome" | "problem" | "data" | "model" | "output">("welcome");
  const [bookChecks, setBookChecks] = useState<Record<string, boolean>>({});

  // Drag & Drop / Sequence State (Using localized labels if needed, but let's keep internal cards as "Problem", "Data", etc for logic, but render translated values)
  const initialCards = ["Output", "Data", "Problem", "Model"];
  const correctSequence = ["Problem", "Data", "Model", "Output"];
  const [currentSequence, setCurrentSequence] = useState<string[]>(initialCards);
  const [sequenceSuccess, setSequenceSuccess] = useState<boolean>(false);
  const [hasCheckedSequence, setHasCheckedSequence] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Book Page Content
  const bookPagesEn = {
    welcome: {
      title: "Inside the AI Innovation Studio",
      icon: "👋",
      text: "Every AI project starts with a goal, but many fail because developers jump straight to coding. In this studio, you will practice the AI Project Cycle protocol. It is the standardized loop used by top practitioners to guarantee safety, feasibility, and impact.",
      checkQ: "What makes the AI Project Cycle critical?",
      options: [
        "It forces us to code without planning",
        "It guarantees we solve the correct problem safely with valid data",
        "It makes the computers run twice as fast"
      ],
      correctOpt: 1,
      explanation: "Exactly! The cycle ensures we are solving a genuine problem, with proper data, aligned models, and responsible outputs."
    },
    problem: {
      title: "1. The Problem Stage",
      icon: "🎯",
      text: "Before collecting a single data point, you must define the problem. What is the friction? Who experiences it? Why is it a hurdle? If the problem is poorly defined, the AI will optimize the wrong behaviors (e.g., trying to fix cafeteria waste by changing hallway wall colors).",
      checkQ: "Which is a well-defined AI problem statement?",
      options: [
        "School is stressful sometimes.",
        "Students waste 35% of cafeteria meals daily due to mismatched prep sizes.",
        "We need more computers in the lab."
      ],
      correctOpt: 1,
      explanation: "Spot on! It names the specific friction (meal waste), quantifies it (35%), and defines the operational cause (prep sizes)."
    },
    data: {
      title: "2. The Data Stage",
      icon: "📊",
      text: "AI learns through examples. The Data Stage is where we decide what parameters are predictive, gather historical records, and clean the dataset. Remember: garbage data creates garbage models. We must collect relevant, ethical, and representative information.",
      checkQ: "What data is most relevant to predict classroom temperatures?",
      options: [
        "Student homework grades and hair colors",
        "Thermostat logs, outside weather trends, and hourly room occupancy",
        "The brand of air conditioning unit installed"
      ],
      correctOpt: 1,
      explanation: "Correct! Thermostat readings, weather forecast, and occupancy directly correlate with thermal regulation requirements."
    },
    model: {
      title: "3. The Model Stage",
      icon: "🧠",
      text: "This is where the AI algorithm is trained. We feed our cleaned data into our model so it can learn underlying patterns. Different problems require different model families: prediction regression, image classification classifiers, or decision optimization algorithms.",
      checkQ: "What model category scans photos to sort recycling items?",
      options: [
        "Speech-to-text translation model",
        "Image Classification / Computer Vision model",
        "Weather forecast simulator"
      ],
      correctOpt: 1,
      explanation: "Excellent! Computer vision is trained to identify shapes and textures to categorize items in camera captures."
    },
    output: {
      title: "4. The Output Stage",
      icon: "🖥️",
      text: "A model's predictions are useless if people can't use them. The Output Stage turns raw values into clear, user-friendly dashboards, control feeds, or automated switches. It is also where we evaluate if the model operates ethically, fairly, and with high safety.",
      checkQ: "What is a practical output for the cafeteria chef?",
      options: [
        "An automated recipe translation tool",
        "A daily visual dashboard forecasting portion volumes to cook",
        "A notification system telling them it's raining"
      ],
      correctOpt: 1,
      explanation: "Superb! A dashboard directly tells the chef how many portions to cook, preventing physical wastage in real-time."
    }
  };

  const bookPagesHi = {
    welcome: {
      title: "एआई इनोवेशन स्टूडियो के अंदर",
      icon: "👋",
      text: "हर एआई प्रोजेक्ट की शुरुआत एक लक्ष्य से होती है, लेकिन कई प्रोजेक्ट इसलिए असफल हो जाते हैं क्योंकि डेवलपर्स सीधे कोडिंग करने लगते हैं। इस स्टूडियो में, आप एआई प्रोजेक्ट चक्र (AI Project Cycle) प्रोटोकॉल का अभ्यास करेंगे। यह सुरक्षा, व्यवहार्यता और प्रभाव की गारंटी देने के लिए शीर्ष चिकित्सकों द्वारा उपयोग किया जाने वाला मानकीकृत लूप है।",
      checkQ: "एआई प्रोजेक्ट चक्र को क्या महत्वपूर्ण बनाता है?",
      options: [
        "यह हमें बिना योजना के कोड करने के लिए मजबूर करता है",
        "यह गारंटी देता है कि हम वैध डेटा के साथ सही समस्या को सुरक्षित रूप से हल करें",
        "यह कंप्यूटर को दोगुनी गति से चलाता है"
      ],
      correctOpt: 1,
      explanation: "बिल्कुल सही! यह चक्र सुनिश्चित करता है कि हम वास्तविक डेटा, संरेखित मॉडल और ज़िम्मेदार आउटपुट के साथ एक वास्तविक समस्या को हल कर रहे हैं।"
    },
    problem: {
      title: "1. समस्या चरण (Problem Stage)",
      icon: "🎯",
      text: "एक भी डेटा पॉइंट एकत्र करने से पहले, आपको समस्या को परिभाषित करना होगा। घर्षण क्या है? इसका अनुभव कौन करता है? यह एक बाधा क्यों है? यदि समस्या खराब ढंग से परिभाषित है, तो एआई गलत व्यवहार को अनुकूलित करेगा (जैसे, हॉलवे की दीवारों का रंग बदलकर कैफेटेरिया के कचरे को ठीक करने का प्रयास करना)।",
      checkQ: "कौन सा एक अच्छी तरह से परिभाषित एआई समस्या विवरण है?",
      options: [
        "स्कूल में कभी-कभी तनाव होता है।",
        "तैयारी के आकार में बेमेल होने के कारण छात्र दैनिक स्तर पर कैफेटेरिया के 35% भोजन को बर्बाद कर देते हैं।",
        "हमें लैब में अधिक कंप्यूटरों की आवश्यकता है।"
      ],
      correctOpt: 1,
      explanation: "बिल्कुल सही! यह विशिष्ट घर्षण (भोजन की बर्बादी) को नाम देता है, इसे मापता है (35%), और परिचालन कारण (तैयारी का आकार) को परिभाषित करता है।"
    },
    data: {
      title: "2. डेटा चरण (Data Stage)",
      icon: "📊",
      text: "एआई उदाहरणों के माध्यम से सीखता है। डेटा चरण वह जगह है जहाँ हम यह तय करते हैं कि कौन से मापदंड भविष्य कहने वाले हैं, ऐतिहासिक रिकॉर्ड इकट्ठा करते हैं, और डेटासेट को साफ करते हैं। याद रखें: कचरा डेटा कचरा मॉडल बनाता है। हमें प्रासंगिक, नैतिक और प्रतिनिधि जानकारी एकत्र करनी होगी।",
      checkQ: "कक्षा के तापमान का पूर्वानुमान लगाने के लिए कौन सा डेटा सबसे प्रासंगिक है?",
      options: [
        "छात्रों के गृहकार्य ग्रेड और बालों का रंग",
        "थर्मोस्टेट लॉग, बाहरी मौसम के रुझान और कमरे में प्रति घंटा रहने वाले लोगों की संख्या",
        "स्थापित एयर कंडीशनिंग यूनिट का ब्रांड"
      ],
      correctOpt: 1,
      explanation: "सही! थर्मोस्टेट रीडिंग, मौसम का पूर्वानुमान, और कमरे का अधिभोग सीधे तापमान नियंत्रण आवश्यकताओं से संबंधित हैं।"
    },
    model: {
      title: "3. मॉडल चरण (Model Stage)",
      icon: "🧠",
      text: "यह वह जगह है जहाँ एआई एल्गोरिदम को प्रशिक्षित किया जाता है। हम अपने साफ किए गए डेटा को अपने मॉडल में फीड करते हैं ताकि यह अंतर्निहित पैटर्न सीख सके। विभिन्न समस्याओं के लिए अलग-अलग मॉडल परिवारों की आवश्यकता होती है: भविष्यवाणी रिग्रेशन, इमेज क्लासिफिकेशन वर्गीकरण, या निर्णय अनुकूलन एल्गोरिदम।",
      checkQ: "रीसाइक्लिंग वस्तुओं को सॉर्ट करने के लिए तस्वीरों को कौन सी मॉडल श्रेणी स्कैन करती है?",
      options: [
        "स्पीच-टू-टेक्स्ट अनुवाद मॉडल",
        "इमेज क्लासिफिकेशन / कंप्यूटर विज़न मॉडल",
        "मौसम पूर्वानुमान सिम्युलेटर"
      ],
      correctOpt: 1,
      explanation: "उत्कृष्ट! कंप्यूटर विज़न को कैमरा कैप्चर में वस्तुओं को वर्गीकृत करने के लिए आकृतियों और बनावट की पहचान करने के लिए प्रशिक्षित किया जाता है।"
    },
    output: {
      title: "4. आउटपुट चरण (Output Stage)",
      icon: "🖥️",
      text: "यदि लोग उनका उपयोग नहीं कर सकते तो मॉडल की भविष्यवाणियां बेकार हैं। आउटपुट चरण कच्चे मूल्यों को स्पष्ट, उपयोगकर्ता-अनुकूल डैशबोर्ड, नियंत्रण फ़ीड या स्वचालित स्विच में बदल देता है। यह वह जगह भी है जहाँ हम मूल्यांकन करते हैं कि क्या मॉडल नैतिक, निष्पक्ष और उच्च सुरक्षा के साथ काम करता है।",
      checkQ: "कैफेटेरिया शेफ के लिए एक व्यावहारिक आउटपुट क्या है?",
      options: [
        "एक स्वचालित नुस्खा अनुवाद उपकरण",
        "पकाने के लिए हिस्से की मात्रा का पूर्वानुमान लगाने वाला दैनिक विज़ुअल डैशबोर्ड",
        "एक अधिसूचना प्रणाली जो उन्हें बताती है कि बारिश हो रही है"
      ],
      correctOpt: 1,
      explanation: "शानदार! एक डैशबोर्ड सीधे शेफ को बताता है कि कितने हिस्से पकाने हैं, जिससे वास्तविक समय में भोजन की बर्बादी को रोका जा सके।"
    }
  };

  const bookPages = lang === "hi" ? bookPagesHi : bookPagesEn;
  const currentQuestions = lang === "hi" ? KNOWLEDGE_CHECK_QUESTIONS_HI : KNOWLEDGE_CHECK_QUESTIONS;

  const handleBookCheck = (pageId: string, selectedIdx: number) => {
    const page = bookPages[pageId as keyof typeof bookPages];
    if (selectedIdx === page.correctOpt) {
      if (!bookChecks[pageId]) {
        addXp(10); // Reward 10 XP for correct book check
      }
      setBookChecks({ ...bookChecks, [pageId]: true });
    } else {
      alert(t.wrongBookCheck);
    }
  };

  // Drag and drop sequencing mechanics
  const moveCard = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= currentSequence.length) return;

    const newSeq = [...currentSequence];
    const temp = newSeq[fromIndex];
    newSeq[fromIndex] = newSeq[toIndex];
    newSeq[toIndex] = temp;
    setCurrentSequence(newSeq);
  };

  const checkSequence = () => {
    setHasCheckedSequence(true);
    const isCorrect = currentSequence.every((val, index) => val === correctSequence[index]);
    if (isCorrect) {
      setSequenceSuccess(true);
      addXp(20); // Reward 20 XP for correct sequencing!
    } else {
      setSequenceSuccess(false);
    }
  };

  const resetSequence = () => {
    setCurrentSequence(initialCards);
    setHasCheckedSequence(false);
    setSequenceSuccess(false);
  };

  // Quiz mechanics
  const handleSelectQuizAnswer = (qId: number, optionIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionIdx
    });
  };

  const submitQuiz = () => {
    let score = 0;
    currentQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        score += 1;
      }
    });

    const percent = (score / currentQuestions.length) * 100;
    setQuizScore(percent);
    setSubmittedQuiz(true);

    if (percent >= 80) {
      setQuizPassed(true);
      addXp(30); // 30 XP for passing quiz!
      if (percent === 100) {
        addXp(20); // Perfect score bonus XP!
      }
    } else {
      setQuizPassed(false);
    }
  };

  const retryQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setQuizPassed(false);
  };

  const allBookPagesChecked = Object.keys(bookPages).every(page => bookChecks[page] === true);

  // Label card mappings for UI display (so English logic works but renders beautiful Hindi titles)
  const getCardLabel = (cardName: string) => {
    if (lang !== "hi") return cardName;
    if (cardName === "Problem") return "समस्या (Problem)";
    if (cardName === "Data") return "डेटा (Data)";
    if (cardName === "Model") return "मॉडल (Model)";
    if (cardName === "Output") return "आउटपुट (Output)";
    return cardName;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Activity Intro Title */}
      <div className="mb-6 text-center">
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {t.act1Title}
        </h2>
        <p className="font-sans text-sm text-slate-400 mt-1">
          {t.act1Subtitle}
        </p>
      </div>

      {/* Segment Navigation tabs */}
      <div className="flex border-b border-[#1E293B] bg-[#131B2E] rounded-t-2xl overflow-hidden p-1 gap-1">
        <button
          id="tab-book"
          onClick={() => setActiveTab("book")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeTab === "book"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>1. {lang === "hi" ? "इंटरैक्टिव बुक" : "Interactive Book"}</span>
          {allBookPagesChecked && <Check className="h-3 w-3 text-emerald-400" />}
        </button>

        <button
          id="tab-sequence"
          onClick={() => setActiveTab("sequence")}
          disabled={!allBookPagesChecked}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            !allBookPagesChecked
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : activeTab === "sequence"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>2. {lang === "hi" ? "ड्रैग एंड ड्रॉप अनुक्रम" : "Drag & Drop Sequence"}</span>
          {sequenceSuccess && <Check className="h-3 w-3 text-emerald-400" />}
        </button>

        <button
          id="tab-quiz"
          onClick={() => setActiveTab("quiz")}
          disabled={!sequenceSuccess}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
            !sequenceSuccess
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : activeTab === "quiz"
              ? "bg-[#1E293B] text-[#22D3EE] border-b-2 border-[#06B6D4]"
              : "text-slate-400 hover:text-white hover:bg-[#1C2538]"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>3. {lang === "hi" ? "ज्ञान की जाँच" : "Knowledge Check"}</span>
          {quizPassed && <Check className="h-3 w-3 text-emerald-400" />}
        </button>
      </div>

      <div className="bg-[#131B2E] border-x border-b border-[#1E293B] rounded-b-2xl p-6 shadow-xl min-h-[420px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INTERACTIVE BOOK */}
          {activeTab === "book" && (
            <motion.div
              key="book-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {/* Left Column: Page Indexes */}
              <div className="space-y-2 md:col-span-1">
                <p className="font-mono text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-3">{t.chapters}</p>
                {Object.keys(bookPages).map((pageId) => {
                  const page = bookPages[pageId as keyof typeof bookPages];
                  const isCurrent = bookPage === pageId;
                  const isChecked = bookChecks[pageId] === true;

                  return (
                    <button
                      id={`book-idx-${pageId}`}
                      key={pageId}
                      onClick={() => setBookPage(pageId as any)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? "bg-[#1E293B] border-[#06B6D4]/50 text-[#22D3EE]"
                          : "bg-[#070B14] border-[#1E293B] text-slate-300 hover:bg-[#151B2D]"
                      }`}
                    >
                      <span className="font-sans text-xs font-semibold flex items-center gap-2">
                        <span className="text-sm filter drop-shadow-sm">{page.icon}</span>
                        <span>{page.title.split(". ")[1] || page.title}</span>
                      </span>
                      {isChecked && <Check className="h-3.5 w-3.5 text-emerald-400 bg-emerald-500/10 rounded-full p-0.5" />}
                    </button>
                  );
                })}

                {allBookPagesChecked && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center mt-4"
                  >
                    <p className="text-[11px] text-emerald-400 font-bold">{t.textbookComplete}</p>
                    <button
                      id="proceed-seq-btn"
                      onClick={() => setActiveTab("sequence")}
                      className="mt-2 w-full flex items-center justify-center gap-1 bg-[#22D3EE] text-[#070B14] text-xs font-bold py-1.5 rounded-lg hover:bg-[#06B6D4]"
                    >
                      <span>{t.goToSequence}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Right Column: Page Display content */}
              <div className="md:col-span-3 border border-[#1E293B] bg-[#070B14] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[#6366F1]/5 blur-2xl" />

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl select-none">{bookPages[bookPage].icon}</span>
                  <h3 className="font-sans text-xl font-extrabold text-white">
                    {bookPages[bookPage].title}
                  </h3>
                </div>

                <p className="font-sans text-slate-300 text-sm leading-relaxed mb-6">
                  {bookPages[bookPage].text}
                </p>

                {/* Micro-question check */}
                <div className="rounded-xl border border-[#1E293B] bg-[#131B2E] p-4">
                  <h4 className="font-sans text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-2">
                    {lang === "hi" ? "अवधारणा त्वरित-जाँच" : "Concept Quick-Check"}
                  </h4>
                  <p className="font-sans text-sm text-white font-medium mb-3">{bookPages[bookPage].checkQ}</p>
                  
                  <div className="space-y-2">
                    {bookPages[bookPage].options.map((opt, oIdx) => {
                      const isCorrectAnswerChecked = bookChecks[bookPage] === true && oIdx === bookPages[bookPage].correctOpt;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleBookCheck(bookPage, oIdx)}
                          disabled={bookChecks[bookPage] === true}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                            isCorrectAnswerChecked
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : bookChecks[bookPage] === true
                              ? "bg-[#070B14]/40 border-[#1E293B] text-slate-500 cursor-not-allowed"
                              : "bg-[#070B14] border-[#1E293B] text-slate-300 hover:bg-[#1E293B] hover:border-slate-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrectAnswerChecked && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {bookChecks[bookPage] && (
                    <motion.p
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-400 mt-3 flex items-center gap-1.5 font-sans"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{bookPages[bookPage].explanation}</span>
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SEQUENCE CARDS */}
          {activeTab === "sequence" && (
            <motion.div
              key="sequence-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="rounded bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#22D3EE] px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                  {lang === "hi" ? "पाइपलाइन प्रोटोकॉल" : "Pipeline Protocol"}
                </span>
                <h3 className="font-sans text-xl font-extrabold text-white mt-1">{t.dragDropTitle}</h3>
                <p className="font-sans text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  {t.dragDropDesc}
                </p>
              </div>

              {/* Cards list */}
              <div className="space-y-3 mb-6">
                {currentSequence.map((cardName, index) => {
                  const cardColor =
                    cardName === "Problem"
                      ? "border-red-500/30 bg-red-500/5 text-red-300"
                      : cardName === "Data"
                      ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
                      : cardName === "Model"
                      ? "border-indigo-500/30 bg-indigo-500/5 text-indigo-300"
                      : "border-cyan-500/30 bg-cyan-500/5 text-cyan-300";

                  return (
                    <motion.div
                      layout
                      key={cardName}
                      className={`flex items-center justify-between p-4 rounded-xl border ${cardColor} shadow-md`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#070B14] text-xs font-mono font-black text-white">
                          {index + 1}
                        </div>
                        <span className="font-sans text-sm font-bold tracking-tight">{getCardLabel(cardName)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => moveCard(index, "up")}
                          disabled={index === 0}
                          className="h-8 w-8 flex items-center justify-center rounded bg-[#070B14] hover:bg-[#1E293B] border border-[#1E293B] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move item up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveCard(index, "down")}
                          disabled={index === currentSequence.length - 1}
                          className="h-8 w-8 flex items-center justify-center rounded bg-[#070B14] hover:bg-[#1E293B] border border-[#1E293B] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move item down"
                        >
                          ▼
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Feedback status */}
              {hasCheckedSequence && (
                <div className={`p-4 rounded-xl text-center mb-6 border ${
                  sequenceSuccess
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {sequenceSuccess ? (
                    <div>
                      <p className="font-sans text-sm font-bold flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span>{t.sequenceSuccessMsg}</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-sans text-sm font-bold">{lang === "hi" ? "गलत अनुक्रम संरेखण" : "Incorrect Sequence Arrangement"}</p>
                      <p className="text-xs mt-1 text-slate-300">
                        {t.sequenceFailedMsg}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action trigger buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetSequence}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E293B] hover:bg-[#1C2538] text-xs font-semibold text-slate-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t.resetSequenceBtn}</span>
                </button>
                
                {sequenceSuccess ? (
                  <button
                    id="goto-quiz-btn"
                    onClick={() => setActiveTab("quiz")}
                    className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#22D3EE] text-[#070B14] text-xs font-bold hover:bg-[#06B6D4]"
                  >
                    <span>{lang === "hi" ? "क्विज़ पर आगे बढ़ें" : "Proceed to Quiz"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    id="verify-seq-btn"
                    onClick={checkSequence}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {t.checkSequenceBtn}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: KNOWLEDGE CHECK QUIZ */}
          {activeTab === "quiz" && (
            <motion.div
              key="quiz-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="rounded bg-[#818CF8]/10 border border-[#818CF8]/30 text-[#818CF8] px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                  {lang === "hi" ? "सत्यापन प्रोटोकॉल" : "Assessor Protocol"}
                </span>
                <h3 className="font-sans text-xl font-extrabold text-white mt-1">{t.quizTitle}</h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  {t.quizDesc}
                </p>
              </div>

              {/* Questions Feed */}
              <div className="space-y-6 mb-8">
                {currentQuestions.map((q, index) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;

                  return (
                    <div key={q.id} className="rounded-xl border border-[#1E293B] bg-[#070B14] p-5">
                      <p className="font-sans text-xs text-[#818CF8] font-bold uppercase mb-1">
                        {lang === "hi" ? `प्रश्न ${index + 1} / 4` : `Question ${index + 1} of 4`}
                      </p>
                      <h4 className="font-sans text-sm text-white font-bold leading-snug mb-3">{q.text}</h4>

                      <div className="grid grid-cols-1 gap-2.5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          const isCorrect = q.answerIndex === oIdx;
                          
                          let btnStyle = "bg-[#131B2E] border-[#1E293B] text-slate-300 hover:bg-[#1E293B]";
                          if (submittedQuiz) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold";
                            } else if (isSelected) {
                              btnStyle = "bg-red-500/15 border-red-500/30 text-red-400";
                            } else {
                              btnStyle = "bg-[#131B2E]/40 border-[#1E293B]/60 text-slate-500 cursor-not-allowed";
                            }
                          } else if (isSelected) {
                            btnStyle = "bg-[#1E293B] border-[#06B6D4] text-[#22D3EE] font-semibold";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectQuizAnswer(q.id, oIdx)}
                              disabled={submittedQuiz}
                              className={`text-left px-4 py-2.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {submittedQuiz && isCorrect && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation details */}
                      {submittedQuiz && (
                        <div className="mt-3 p-3 rounded-lg bg-[#131B2E] border border-[#1E293B] text-slate-300 text-xs flex gap-2">
                          <BookOpenCheck className="h-4 w-4 text-[#22D3EE] shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Results Card */}
              {submittedQuiz && (
                <div className={`p-6 rounded-2xl border text-center mb-6 shadow-lg ${
                  quizPassed
                    ? "bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border-emerald-500/30 text-emerald-400"
                    : "bg-red-950/20 border-red-500/30 text-red-400"
                }`}>
                  <p className="font-sans text-sm font-bold uppercase tracking-wider mb-1">
                    {lang === "hi" ? "मूल्यांकन स्कोर" : "Evaluation Score"}
                  </p>
                  <p className="font-mono text-3xl font-black">{quizScore}%</p>
                  
                  {quizPassed ? (
                    <div>
                      <p className="font-sans text-sm font-bold text-emerald-400 mt-2">
                        {quizScore === 100 ? t.quizPerfectMsg : t.quizPassMsg}
                      </p>
                      <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                        {lang === "hi" 
                          ? "उत्कृष्ट स्कोर। आपने स्पष्ट समझ का प्रदर्शन किया है कि कैसे समस्याएं स्कूल समाधानों को आउटपुट करने के लिए मॉडल में फीड होती हैं!"
                          : "Excellent score. You have demonstrated clear understanding of how problems feed into models to output school solutions!"}
                      </p>
                      <button
                        id="pcycle-complete-btn"
                        onClick={onComplete}
                        className="mt-4 inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-[#C4B286] to-[#D29264] text-white text-xs font-bold rounded-xl hover:scale-102 active:scale-95 shadow-md shadow-emerald-500/20"
                      >
                        <span>{lang === "hi" ? "सलाहकार चुनौती पर जाएं" : "Go to Consultant Challenge"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-sans text-sm font-bold text-red-400 mt-2">{t.quizFailMsg}</p>
                      <button
                        onClick={retryQuiz}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500/20"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>{t.retryQuizBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit triggers */}
              {!submittedQuiz && (
                <div className="text-center">
                  <button
                    id="submit-quiz-btn"
                    onClick={submitQuiz}
                    disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                    className={`px-8 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                      Object.keys(selectedAnswers).length < currentQuestions.length
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700"
                        : "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    {t.submitQuizBtn}
                  </button>
                  <p className="text-[10px] text-slate-500 mt-2">
                    {lang === "hi" ? "कृपया ऊपर दिए गए सभी 4 प्रश्नों के उत्तर दें।" : "Please answer all 4 questions above."}
                  </p>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
