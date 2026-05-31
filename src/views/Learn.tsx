import { useState, useEffect } from "react";
import { ViewState } from "../types";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "motion/react";
import { Home as HomeIcon, CheckCircle2 } from "lucide-react";

import { Lesson1 } from "./lessons/Lesson1";
import { Lesson2 } from "./lessons/Lesson2";
import { Lesson3 } from "./lessons/Lesson3";
import { Lesson4 } from "./lessons/Lesson4";
import { Lesson5 } from "./lessons/Lesson5";
import { saveProgress, getProgress } from "../lib/db";
import { useI18n } from "../lib/i18n";

interface LearnProps {
  key?: string;
  setViewState: (view: ViewState) => void;
}

export function Learn({ setViewState }: LearnProps) {
  const { locale } = useI18n();
  const isDe = locale === 'de';
  const isLv = locale === 'lv';

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProgress().then(saved => {
      setCompleted(saved || []);
      // Resume from last uncompleted
      let nextUncompleted = 0;
      for (let i = 0; i < 5; i++) {
        if (!saved.includes(i)) {
          nextUncompleted = i;
          break;
        }
      }
      if (saved.length === 5) nextUncompleted = 0; // If all done, start from beginning
      setCurrentStep(nextUncompleted);
      setLoaded(true);
    });
  }, []);

  const handleLessonComplete = async () => {
    const newCompleted = [...new Set([...completed, currentStep])];
    setCompleted(newCompleted);
    await saveProgress(newCompleted);
    
    // Slight delay before transition
    setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(c => c + 1);
      } else {
        setViewState('train'); // Finished all lessons, go to training
      }
    }, 600);
  };

  const LESSON_TITLES = isDe ? [
    "Das Doomsday-Konzept",
    "Die Monats-Anker",
    "Die Jahrhundert-Codes",
    "Der Jahres-Code",
    "Das Finale"
  ] : isLv ? [
    "Pastardienas Koncepcija",
    "Mēnešu Enkuri",
    "Gadsimtu Kodi",
    "Gada Kods",
    "Fināls"
  ] : [
    "The Doomsday Concept",
    "The Month Anchors",
    "The Century Codes",
    "The Year Code",
    "The Finale"
  ];

  if (!loaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto w-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setViewState('home')}>
          <HomeIcon className="w-4 h-4 mr-2" /> {isDe ? 'Menü' : isLv ? 'Izvēlne' : 'Menu'}
        </Button>
        <div className="text-gray-400">
          {isDe ? `Lektion ${currentStep + 1} von 5` : isLv ? `Nodarbība ${currentStep + 1} no 5` : `Lesson ${currentStep + 1} of 5`}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 w-full h-2 mb-8">
        {[0, 1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`flex-1 rounded-full bg-white/10 relative overflow-hidden transition-colors cursor-pointer ${step === currentStep ? 'ring-2 ring-blue-500/50' : ''}`}
            onClick={() => {
              // Allow jumping to already completed steps or the immediate next
              if (completed.includes(step) || step <= Math.max(0, ...completed) + 1 || (completed.length === 0 && step === 0)) {
                setCurrentStep(step);
              }
            }}
          >
            {(completed.includes(step) || (currentStep === step && completed.includes(step))) && (
              <motion.div 
                layoutId={`progress-${step}`}
                className="absolute inset-0 bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
              />
            )}
            {completed.includes(step) && step !== currentStep && (
              <div className="absolute inset-0 bg-emerald-500 rounded-full" />
            )}
          </div>
        ))}
      </div>

      <GlassCard className="p-8 min-h-[500px] flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 space-y-8 flex flex-col"
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              {currentStep > 0 && (
                <Button 
                  variant="ghost" 
                  className="px-3"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  &larr; {isDe ? 'Zurück' : isLv ? 'Atpakaļ' : 'Back'}
                </Button>
              )}
              <h2 className="flex-1 text-3xl font-bold text-white flex items-center gap-3">
                {completed.includes(currentStep) && <CheckCircle2 className="text-emerald-400 w-6 h-6" />}
                {LESSON_TITLES[currentStep]}
              </h2>
            </div>
            
            <div className="flex-1">
              {currentStep === 0 && <Lesson1 onComplete={handleLessonComplete} />}
              {currentStep === 1 && <Lesson2 onComplete={handleLessonComplete} />}
              {currentStep === 2 && <Lesson3 onComplete={handleLessonComplete} />}
              {currentStep === 3 && <Lesson4 onComplete={handleLessonComplete} />}
              {currentStep === 4 && <Lesson5 onComplete={handleLessonComplete} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
