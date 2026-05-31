import { useState, useEffect } from "react";
import { ViewState } from "../types";
import { calculateDoomsday, getDayName } from "../lib/doomsday";
import { generateDailyDates } from "../lib/prng";
import { saveDailyStreak, getFullProgress } from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Home, Share2, Target, Clock, Zap } from "lucide-react";
import { useI18n } from "../lib/i18n";

interface DailyProps {
  setViewState: (view: ViewState) => void;
}

export function Daily({ setViewState }: DailyProps) {
  const { locale, formatDate } = useI18n();
  const isDe = locale === 'de';
  const isLv = locale === 'lv';

  const [questions, setQuestions] = useState<{year: number, month: number, day: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, cAct: string, show: boolean }>({ isCorrect: false, cAct: "", show: false });
  const [copied, setCopied] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const dates = generateDailyDates(5);
      setQuestions(dates);

      const progress = await getFullProgress();
      const todayStr = getTodayStr();

      if (progress?.lastDailyDate === todayStr) {
        setAlreadyCompleted(true);
        setCurrentStreak(progress?.streak || 0);
      }
      setStartTime(Date.now());
    };
    checkStatus();
  }, []);

  const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  };

  const handleAnswer = async (dayIndex: number) => {
    if (finished || alreadyCompleted || status !== "idle") return;
    
    const d = questions[currentIndex];
    const correctDay = calculateDoomsday(d.year, d.month, d.day);
    const isCorrect = dayIndex === correctDay;

    setAnswers(prev => [...prev, isCorrect]);
    setStatus(isCorrect ? "success" : "error");
    setFeedback({ isCorrect, cAct: getDayName(correctDay, locale), show: true });

    setTimeout(async () => {
      setFeedback({ isCorrect: false, cAct: "", show: false });
      setStatus("idle");
      
      if (currentIndex < 4) {
        setCurrentIndex(c => c + 1);
      } else {
        const timeEnd = Date.now();
        setEndTime(timeEnd);
        setFinished(true);

        const newAnswers = [...answers, isCorrect];
        const allCorrect = newAnswers.every(a => a);
        
        let finalStreak = currentStreak;
        if (allCorrect) {
          const todayStr = getTodayStr();
          await saveDailyStreak(todayStr);
          const updatedProgress = await getFullProgress();
          finalStreak = updatedProgress?.streak || 0;
          setCurrentStreak(finalStreak);
        }
      }
    }, 1200);
  };

  const handleShare = () => {
    const blocks = answers.map(a => a ? '■' : '□').join(' ');
    const timeSec = ((endTime - startTime) / 1000).toFixed(1);
    
    let dateFmt = '';
    const today = new Date();
    if (locale === 'de') {
      dateFmt = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth()+1).toString().padStart(2, '0')}.`;
    } else if (locale === 'lv') {
      dateFmt = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth()+1).toString().padStart(2, '0')}.`;
    } else {
      dateFmt = `${(today.getMonth()+1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    }

    const shareText = `Doomsday Daily ${dateFmt}
Streak: ${currentStreak} ✦
Time: ${timeSec}s
${blocks}`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Translations
  let tDailyChallenge = "Daily Challenge";
  let tAlreadyCompleted = "You've already completed today's challenge!";
  let tComeBack = "Come back tomorrow for a new set of dates.";
  let tMenu = "Menu";
  let tCorrect = "Correct";
  let tIncorrect = "Incorrect";
  let tCompleted = "Challenge Completed!";
  let tTime = "Time";
  let tStreak = "Streak";
  let tShare = "Share Result";
  let tCopied = "Copied!";

  if (isDe) {
    tDailyChallenge = "Tägliche Challenge";
    tAlreadyCompleted = "Du hast die heutige Challenge bereits abgeschlossen!";
    tComeBack = "Komm morgen für neue Daten zurück.";
    tMenu = "Menü";
    tCorrect = "Richtig";
    tIncorrect = "Falsch";
    tCompleted = "Challenge abgeschlossen!";
    tTime = "Zeit";
    tStreak = "Streak";
    tShare = "Ergebnis teilen";
    tCopied = "Kopiert!";
  } else if (isLv) {
    tDailyChallenge = "Dienas Izaicinājums";
    tAlreadyCompleted = "Jūs jau esat pabeidzis šodienas izaicinājumu!";
    tComeBack = "Atgriezieties rīt, lai saņemtu jaunus datumus.";
    tMenu = "Izvēlne";
    tCorrect = "Pareizi";
    tIncorrect = "Nepareizi";
    tCompleted = "Izaicinājums pabeigts!";
    tTime = "Laiks";
    tStreak = "Sērija";
    tShare = "Dalīties ar rezultātu";
    tCopied = "Kopēts!";
  }

  if (alreadyCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full space-y-8 pb-12 text-center mt-12"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Zap className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">{tAlreadyCompleted}</h2>
        <p className="text-gray-400">{tComeBack}</p>
        
        <div className="flex justify-center mt-8">
          <GlassCard className="inline-flex flex-col items-center p-6 border-amber-500/30">
            <span className="text-gray-400 uppercase tracking-widest text-xs mb-2">{tStreak}</span>
            <div className="flex items-center gap-2 text-4xl font-bold text-amber-400">
              {currentStreak}
              <span className="text-amber-400">✦</span>
            </div>
          </GlassCard>
        </div>

        <div className="pt-8">
          <Button onClick={() => setViewState('home')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {tMenu}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full flex flex-col min-h-[80vh]"
    >
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => setViewState('home')} className="px-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> {tMenu}
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 font-medium rounded-full text-sm border border-blue-500/20">
          <Target className="w-4 h-4" />
          {tDailyChallenge}
        </div>
        <div className="w-[100px] text-right text-gray-400">
          {currentIndex + 1} / 5
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {!finished && questions.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <GlassCard 
                className={`relative overflow-hidden p-8 md:p-12 text-center transition-colors duration-500 ${
                  status === "success" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-emerald-500/5" :
                  status === "error" ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-red-500/5" : ""
                }`}
              >
                <div className="space-y-2 mb-12">
                  <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                    {formatDate(questions[currentIndex].year, questions[currentIndex].month, questions[currentIndex].day)}
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {[0,1,2,3,4,5,6].map((day) => (
                    <Button
                      key={day}
                      variant="outline"
                      className={`h-16 text-lg font-medium transition-all ${
                        status === 'idle' ? 'hover:bg-white/10 hover:-translate-y-1' : 'opacity-50 pointer-events-none'
                      }`}
                      onClick={() => handleAnswer(day)}
                    >
                      {getDayName(day, locale).substring(0, 3)}
                    </Button>
                  ))}
                </div>

                <AnimatePresence>
                  {feedback.show && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`absolute inset-x-0 bottom-0 p-6 backdrop-blur-md border-t ${
                        feedback.isCorrect 
                          ? 'bg-emerald-500/20 border-emerald-500/30' 
                          : 'bg-red-500/20 border-red-500/30'
                      }`}
                    >
                      <p className={`text-xl font-bold flex items-center justify-center gap-2 ${
                        feedback.isCorrect ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {feedback.isCorrect ? tCorrect : `${tIncorrect} ( ${feedback.cAct} )`}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )}

          {finished && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xl space-y-8"
            >
              <GlassCard className="p-8 text-center border-blue-500/30 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                
                <h2 className="text-3xl font-bold text-white mb-6">
                  {tCompleted}
                </h2>
                
                <div className="flex gap-2 justify-center mb-8">
                  {answers.map((a, i) => (
                    <div 
                      key={i} 
                      className={`w-10 h-10 rounded flex items-center justify-center font-bold font-mono text-lg ${
                        a ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {a ? '■' : '□'}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1 uppercase tracking-wider">
                      <Clock className="w-4 h-4" /> {tTime}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {((endTime - startTime) / 1000).toFixed(1)}s
                    </div>
                  </div>
                  
                  <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-500 text-sm mb-1 uppercase tracking-wider">
                      <Zap className="w-4 h-4" /> {tStreak}
                    </div>
                    <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                      {currentStreak}
                      <span className="text-amber-400">✦</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="primary" className="flex-1" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    {copied ? tCopied : tShare}
                  </Button>
                </div>
              </GlassCard>
              
              <div className="text-center">
                 <Button variant="ghost" onClick={() => setViewState('home')}>
                   <Home className="w-4 h-4 mr-2" /> {tMenu}
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
