import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { motion } from "motion/react";
import { getMonthAnchor } from "../../lib/doomsday";
import { cn } from "../../lib/utils";
import { useI18n } from "../../lib/i18n";

export function Lesson2({ onComplete }: { onComplete: () => void }) {
  const { locale } = useI18n();
  const isDe = locale === 'de';

  const LESSON_MONTHS = [
    { month: 4, isLeap: false, label: isDe ? "April (4/4)" : "April (4/4)" },
    { month: 6, isLeap: false, label: isDe ? "Juni (6/6)" : "June (6/6)" },
    { month: 8, isLeap: false, label: isDe ? "August (8/8)" : "August (8/8)" },
    { month: 10, isLeap: false, label: isDe ? "Oktober (10/10)" : "October (10/10)" },
    { month: 12, isLeap: false, label: isDe ? "Dezember (12/12)" : "December (12/12)" },
    { month: 9, isLeap: false, label: isDe ? "September (9-to-5)" : "September (9-to-5)" },
    { month: 5, isLeap: false, label: isDe ? "Mai (9-to-5)" : "May (9-to-5)" },
    { month: 7, isLeap: false, label: isDe ? "Juli (7-11)" : "July (7-11)" },
    { month: 11, isLeap: false, label: isDe ? "November (7-11)" : "November (7-11)" },
    { month: 3, isLeap: false, label: isDe ? "März (Pi-Day)" : "March (Pi-Day)" },
    { month: 1, isLeap: false, label: isDe ? "Januar (Normales Jahr)" : "January (Non-Leap)" },
    { month: 1, isLeap: true, label: isDe ? "Januar (Schaltjahr)" : "January (Leap Year)" },
    { month: 2, isLeap: false, label: isDe ? "Februar (Normales Jahr)" : "February (Non-Leap)" },
    { month: 2, isLeap: true, label: isDe ? "Februar (Schaltjahr)" : "February (Leap Year)" },
  ];

  const [questions, setQuestions] = useState<typeof LESSON_MONTHS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    const shuffled = [...LESSON_MONTHS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, [locale]); // re-roll if locale change maybe, but labels update mostly.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "success") return;
    
    const parsed = parseInt(inputVal, 10);
    const correctAnchor = getMonthAnchor(questions[currentIndex].month, questions[currentIndex].isLeap);

    if (parsed === correctAnchor) {
      setStatus("success");
      setTimeout(() => {
        if (currentIndex < 4) {
          setCurrentIndex(c => c + 1);
          setInputVal("");
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
              <p>Lass uns zunächst die Basis-Daten lernen. Dies sind Daten, die immer exakt auf den Doomsday eines Jahres fallen.</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-white">
                <li><strong>Gerade Monate:</strong> Stimmen mit dem Monat überein! 4.4., 6.6., 8.8., 10.10., 12.12.</li>
                <li><strong>Ungerade Monate (9 bis 5):</strong> "I work 9 to 5" &rarr; 9.5. und 5.9.</li>
                <li><strong>Ungerade Monate (7-11):</strong> "im 7-11" &rarr; 7.11. und 11.7.</li>
                <li><strong>März:</strong> Der 14. März (Pi-Day 3.14).</li>
                <li><strong>Jan & Feb:</strong> Der letzte Tag des Monats (Oder 3. Jan/28. Feb außer in Schaltjahren!).<br/>Merke: <strong>3. Januar</strong> / <strong>28. Februar</strong> (Normales Jahr). <strong>4. Januar</strong> / <strong>29. Februar</strong> (Schaltjahr).</li>
              </ul>
            </>
          ) : (
            <>
              <p>First, let's learn the anchor dates. These are dates that always fall on the year's Doomsday.</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-white">
                <li><strong>Even Months:</strong> Match the month number! 4/4, 6/6, 8/8, 10/10, 12/12.</li>
                <li><strong>Odd Months (9 to 5):</strong> "I work 9 to 5" &rarr; Sept 5th (9/5) and May 9th (5/9).</li>
                <li><strong>Odd Months (7-11):</strong> "at the 7-11" &rarr; July 11th (7/11) and Nov 7th (11/7).</li>
                <li><strong>March:</strong> March 14th (Pi-Day 3.14).</li>
                <li><strong>Jan & Feb:</strong> The last day of the month.<br/>Note: <strong>Jan 3rd</strong> / <strong>Feb 28th</strong> (Non-Leap Year). <strong>Jan 4th</strong> / <strong>Feb 29th</strong> (Leap Year).</li>
              </ul>
            </>
          )}
        </div>
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <Button onClick={() => setIsQuizMode(true)}>{isDe ? 'Weiter zum Mini-Quiz' : 'Proceed to Mini-Quiz'}</Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-8 flex flex-col items-center">
      <h3 className="text-2xl font-semibold text-white">Mini-Quiz ({currentIndex + 1}/5)</h3>
      <p className="text-gray-400">{isDe ? 'Auf welchen Tag fällt der Anker in diesem Monat?' : 'What is the anchor day for this month?'}</p>
      
      <motion.div 
        animate={status === "error" ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "p-8 rounded-2xl border-2 bg-white/5 backdrop-blur-md text-center max-w-sm w-full transition-shadow duration-300",
          status === "error" ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]" : 
          status === "success" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "border-white/10"
        )}
      >
        <h2 className="text-3xl font-bold text-white mb-8">{currentQ?.label}</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="number"
            autoFocus
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            disabled={status === "success"}
            className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 text-2xl text-center text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder={isDe ? "Tag (1-31)" : "Day (1-31)"}
          />
          <Button type="submit" variant="primary">{isDe ? 'Prüfen' : 'Check'}</Button>
        </form>
      </motion.div>
    </div>
  );
}
