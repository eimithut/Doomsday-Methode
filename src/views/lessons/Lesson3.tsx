import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { motion } from "motion/react";
import { getCenturyAnchor, getDayName } from "../../lib/doomsday";
import { cn } from "../../lib/utils";
import { useI18n } from "../../lib/i18n";

export function Lesson3({ onComplete }: { onComplete: () => void }) {
  const { locale } = useI18n();
  const isDe = locale === 'de';

  const [questions, setQuestions] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    // Generate 5 random years across centuries
    const years = Array.from({ length: 5 }).map(() => {
      const centuries = [1700, 1800, 1900, 2000, 2100];
      const century = centuries[Math.floor(Math.random() * centuries.length)];
      return century + Math.floor(Math.random() * 100);
    });
    setQuestions(years);
  }, []);

  const handleAnswer = (dayIndex: number) => {
    if (status === "success") return;
    
    const correctAnchor = getCenturyAnchor(questions[currentIndex]);

    if (dayIndex === correctAnchor) {
      setStatus("success");
      setTimeout(() => {
        if (currentIndex < 4) {
          setCurrentIndex(c => c + 1);
          setStatus("idle");
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 600);
    }
  };

  if (!isQuizMode) {
    return (
      <div className="space-y-6">
        <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
          {isDe ? (
            <>
              <p>Großartig! Nun schauen wir uns das <strong>Jahrhundert</strong> an.</p>
              <p>Jedes Jahrhundert hat einen festen Basis-Tag (Century Anchor).</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-white">
                <li>1800er Jahre: <strong>Freitag</strong></li>
                <li>1900er Jahre: <strong>Mittwoch</strong> (We-dnesday)</li>
                <li>2000er Jahre: <strong>Dienstag</strong> (Two-sday)</li>
                <li>2100er Jahre: <strong>Sonntag</strong></li>
              </ul>
              <p>Das Muster wiederholt sich alle 400 Jahre (z.B. 1600 = 2000 = Dienstag).</p>
            </>
          ) : (
            <>
              <p>Great! Now let's look at the <strong>century</strong>.</p>
              <p>Every century has a fixed base day (Century Anchor).</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-white">
                <li>1800s: <strong>Friday</strong></li>
                <li>1900s: <strong>Wednesday</strong> (We-dnesday)</li>
                <li>2000s: <strong>Tuesday</strong> (Two-sday)</li>
                <li>2100s: <strong>Sunday</strong></li>
              </ul>
              <p>The pattern repeats every 400 years (e.g., 1600 = 2000 = Tuesday).</p>
            </>
          )}
        </div>
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <Button onClick={() => setIsQuizMode(true)}>{isDe ? 'Weiter zum Mini-Quiz' : 'Proceed to Mini-Quiz'}</Button>
        </div>
      </div>
    );
  }

  const currentYear = questions[currentIndex];

  return (
    <div className="space-y-8 flex flex-col items-center">
      <h3 className="text-2xl font-semibold text-white">Mini-Quiz ({currentIndex + 1}/5)</h3>
      <p className="text-gray-400">
        {isDe ? 'Welchen Anker-Tag hat das Jahrhundert für das Jahr ' : 'What is the century anchor day for the year '}
        <strong className="text-white">{currentYear}</strong>?
      </p>
      
      <motion.div 
        animate={status === "error" ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "w-full transition-shadow duration-300 rounded-2xl p-4",
          status === "error" ? "shadow-[0_0_30px_rgba(239,68,68,0.1)] bg-red-500/10" : 
          status === "success" ? "shadow-[0_0_30px_rgba(16,185,129,0.1)] bg-emerald-500/10" : ""
        )}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <Button
              key={day}
              variant="secondary"
              className="py-4 text-lg"
              onClick={() => handleAnswer(day)}
            >
              {getDayName(day, locale)}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
