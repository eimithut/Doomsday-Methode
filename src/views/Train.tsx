import { useState, useRef } from "react";
import { ViewState } from "../types";
import { generateRandomDateFromEpochs, calculateDoomsday, getDayName } from "../lib/doomsday";
import { addSession, addAnswer } from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "motion/react";
import { Home, Check, X, HelpCircle, ArrowLeft } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { CheatSheet } from "../components/CheatSheet";

interface TrainProps {
  key?: string;
  setViewState: (view: ViewState) => void;
}

export function Train({ setViewState }: TrainProps) {
  const { locale, formatDate } = useI18n();
  const isDe = locale === 'de';

  // State phases
  const [phase, setPhase] = useState<'config' | 'training'>('config');
  
  // Config state
  const AVAILABLE_EPOCHS = [1800, 1900, 2000, 2100];
  const [selectedEpochs, setSelectedEpochs] = useState<number[]>([...AVAILABLE_EPOCHS]);
  
  // Training state
  const [currentDate, setCurrentDate] = useState(() => generateRandomDateFromEpochs(selectedEpochs));
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, cAct: string, show: boolean }>({ isCorrect: false, cAct: "", show: false });
  
  // Cheat sheet state
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [usedCheatSheetCurrentQ, setUsedCheatSheetCurrentQ] = useState(false);

  const startTraining = async () => {
    if (selectedEpochs.length === 0) return;
    const id = await addSession({
      date: new Date().toISOString(),
      duration: 0,
      score: 0,
      total: 0
    });
    setSessionId(id);
    setCurrentDate(generateRandomDateFromEpochs(selectedEpochs));
    setStartTime(Date.now());
    setPhase('training');
  };

  const handleEpochToggle = (epoch: number) => {
    setSelectedEpochs(prev => {
      if (prev.includes(epoch)) {
        return prev.length > 1 ? prev.filter(e => e !== epoch) : prev;
      }
      return [...prev, epoch];
    });
  };

  const handleAnswer = async (dayIndex: number) => {
    if (!sessionId) return;
    const timeTaken = Date.now() - startTime;
    const correctDay = calculateDoomsday(currentDate.year, currentDate.month, currentDate.day);
    const isCorrect = dayIndex === correctDay;

    let status: 'correct' | 'incorrect' | 'correct_with_help' | 'incorrect_with_help' = isCorrect ? 'correct' : 'incorrect';
    if (usedCheatSheetCurrentQ) {
      status = isCorrect ? 'correct_with_help' : 'incorrect_with_help';
    }

    await addAnswer({
      sessionId,
      dateGiven: `${currentDate.year}-${currentDate.month.toString().padStart(2, '0')}-${currentDate.day.toString().padStart(2, '0')}`,
      userAnswer: dayIndex,
      correctAnswer: correctDay,
      timeMs: timeTaken,
      status, // Use updated status system
      isCorrect, // Keep for legacy
      century: Math.floor(currentDate.year / 100) * 100,
      month: currentDate.month
    });

    if (isCorrect) setScore(s => s + 1);
    setTotal(t => t + 1);

    setFeedback({ isCorrect, cAct: getDayName(correctDay, locale), show: true });
    
    setTimeout(() => {
      setFeedback({ isCorrect: false, cAct: "", show: false });
      setCurrentDate(generateRandomDateFromEpochs(selectedEpochs));
      setUsedCheatSheetCurrentQ(false); // Reset cheat sheet state
      setStartTime(Date.now());
    }, 1200);
  };

  const handleFinish = async () => {
    if (phase === 'config') {
      setViewState('home');
      return;
    }
    setViewState('analytics');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-3xl mx-auto w-full space-y-6"
    >
      <CheatSheet 
        isOpen={cheatSheetOpen} 
        onClose={() => setCheatSheetOpen(false)} 
      />

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleFinish}>
          {phase === 'config' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <Home className="w-4 h-4 mr-2" />} 
          {phase === 'config' ? (isDe ? 'Zurück' : 'Back') : (isDe ? 'Training beenden' : 'End Training')}
        </Button>
        {phase === 'training' && (
          <div className="text-gray-400 font-mono text-lg flex items-center gap-2">
            {isDe ? 'Punkte:' : 'Score:'} <span className="text-white">{score}</span> / {total}
          </div>
        )}
      </div>

      <GlassCard className="p-8 text-center relative overflow-hidden min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {phase === 'config' ? (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {isDe ? 'Epochen-Auswahl' : 'Select Centuries'}
                </h2>
                <p className="text-gray-400">
                  {isDe 
                    ? 'Wähle aus, aus welchen Jahrhunderten Daten generiert werden sollen.' 
                    : 'Choose which centuries to practice with.'}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {AVAILABLE_EPOCHS.map(epoch => {
                  const isActive = selectedEpochs.includes(epoch);
                  return (
                    <div 
                      key={epoch}
                      onClick={() => handleEpochToggle(epoch)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isActive 
                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-1">{epoch}s</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-8">
                <Button onClick={startTraining} size="lg" className="w-full md:w-auto md:px-12 py-3 text-lg">
                  {isDe ? 'Training starten' : 'Start Training'}
                </Button>
              </div>
            </motion.div>
          ) : !feedback.show ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-12 relative"
            >
              <div className="absolute top-[-2rem] right-0">
                <Button 
                  variant="secondary" 
                  className="text-sm border-white/20 bg-black/20 backdrop-blur-md"
                  onClick={() => {
                    setUsedCheatSheetCurrentQ(true);
                    setCheatSheetOpen(true);
                  }}
                >
                  <HelpCircle className="w-4 h-4 mr-2 text-blue-400" />
                  {isDe ? 'Spickzettel' : 'Cheat Sheet'}
                </Button>
              </div>

              <div className="space-y-4 pt-8">
                <p className="text-gray-400 uppercase tracking-widest text-sm">
                  {isDe ? 'Welcher Wochentag ist das?' : 'What day is it?'}
                </p>
                <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight py-4">
                  {formatDate(currentDate.year, currentDate.month, currentDate.day)}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <Button
                    key={day}
                    variant="secondary"
                    className="py-4 text-xl"
                    onClick={() => handleAnswer(day)}
                  >
                    {getDayName(day, locale).substring(0, 3)}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              {feedback.isCorrect ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Check className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-semibold text-emerald-400">
                    {isDe ? 'Richtig!' : 'Correct!'}
                  </h3>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <X className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-3xl font-semibold text-red-400">
                     {isDe ? 'Falsch' : 'Incorrect'}
                  </h3>
                  <p className="text-xl text-gray-300">
                     {isDe ? `Es war ein ${feedback.cAct}` : `It was a ${feedback.cAct}`}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
