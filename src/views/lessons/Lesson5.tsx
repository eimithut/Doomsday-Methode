import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { motion, AnimatePresence } from "motion/react";
import { generateRandomDate, calculateDoomsday, getDayName, getMonthName } from "../../lib/doomsday";
import { cn } from "../../lib/utils";
import { useI18n } from "../../lib/i18n";

export function Lesson5({ onComplete }: { onComplete: () => void }) {
  const { locale, formatDate } = useI18n();
  const isDe = locale === 'de';

  const [questions, setQuestions] = useState<{year: number, month: number, day: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    // 3 random dates
    const dates = Array.from({ length: 3 }).map(() => generateRandomDate(1800, 2199));
    setQuestions(dates);
  }, []);

  const handleAnswer = (dayIndex: number) => {
    if (status === "success") return;
    
    const d = questions[currentIndex];
    const correctDay = calculateDoomsday(d.year, d.month, d.day);

    if (dayIndex === correctDay) {
      setStatus("success");
      setTimeout(() => {
        if (currentIndex < 2) {
          setCurrentIndex(c => c + 1);
          setStatus("idle");
        } else {
          onComplete();
        }
      }, 1500);
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
              <p>Das Finale! Jetzt setzen wir alles zusammen: <strong>Jahrhundert + Jahr + Monat = Zieldatum.</strong></p>
              <p>Beispiel: <strong className="text-white">20. Juli 1969</strong></p>
              <ol className="list-decimal pl-5 mt-4 space-y-2 text-white">
                <li><strong>Jahrhundert:</strong> 1900er = Mittwoch (3).</li>
                <li><strong>Jahr (69):</strong> 69/12=5, Rest 9. 9/4=2. Summe = 5 + 9 + 2 = 16. 16 % 7 = <strong>2</strong>.</li>
                <li><strong>Jahres-Doomsday:</strong> Basis(3) + Jahr(2) = 5 (Freitag). Der Doomsday für 1969 ist Freitag!</li>
                <li><strong>Monat:</strong> Juli (7/11). Also ist der 11. Juli ein Freitag.</li>
                <li><strong>Ziel:</strong> 20. Juli. Differenz: 20 - 11 = +9 Tage.</li>
                <li><strong>Ergebnis:</strong> Freitag (5) + 9 = 14. 14 % 7 = <strong>0 (Sonntag)</strong>.</li>
              </ol>
              <p>Perfekt! Neil Armstrong betrat den Mond an einem Sonntag.</p>
            </>
          ) : (
            <>
              <p>The Finale! Now we put it all together: <strong>Century + Year + Month = Target Date.</strong></p>
              <p>Example: <strong className="text-white">July 20, 1969</strong></p>
              <ol className="list-decimal pl-5 mt-4 space-y-2 text-white">
                <li><strong>Century:</strong> 1900s = Wednesday (3).</li>
                <li><strong>Year (69):</strong> 69/12=5, Remainder 9. 9/4=2. Sum = 5 + 9 + 2 = 16. 16 % 7 = <strong>2</strong>.</li>
                <li><strong>Year's Doomsday:</strong> Base(3) + Year(2) = 5 (Friday). The Doomsday for 1969 is Friday!</li>
                <li><strong>Month:</strong> July (7/11). So July 11th is a Friday.</li>
                <li><strong>Target:</strong> July 20th. Difference: 20 - 11 = +9 days.</li>
                <li><strong>Result:</strong> Friday (5) + 9 = 14. 14 % 7 = <strong>0 (Sunday)</strong>.</li>
              </ol>
              <p>Perfect! Neil Armstrong stepped on the moon on a Sunday.</p>
            </>
          )}
        </div>
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <Button onClick={() => setIsQuizMode(true)}>{isDe ? 'Abschluss-Test starten' : 'Start Final Test'}</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;
  const d = questions[currentIndex];

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      <h3 className="text-2xl font-semibold text-white">
        {isDe ? 'Abschluss-Test' : 'Final Test'} ({currentIndex + 1}/3)
      </h3>
      
      <motion.div 
        animate={status === "error" ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "w-full max-w-2xl p-8 rounded-2xl border bg-white/5 backdrop-blur-md transition-shadow duration-300 text-center",
          status === "error" ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : 
          status === "success" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-white/10"
        )}
      >
        <p className="text-gray-400 uppercase tracking-widest text-sm mb-4">
          {isDe ? 'Welcher Wochentag ist das?' : 'What day is it?'}
        </p>
        <h2 className="text-5xl font-bold text-white tracking-tight mb-12">
          {formatDate(d.year, d.month, d.day)}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <Button
              key={day}
              variant="secondary"
              className="py-4 text-lg"
              onClick={() => handleAnswer(day)}
            >
              {getDayName(day, locale).substring(0, 3)}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
