import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useI18n } from "../../lib/i18n";

export function Lesson4({ onComplete }: { onComplete: () => void }) {
  const { locale } = useI18n();
  const isDe = locale === 'de';

  const [questions, setQuestions] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isQuizMode, setIsQuizMode] = useState(false);

  const [inputs, setInputs] = useState({ step1: "", step2: "", step3: "", result: "" });

  useEffect(() => {
    // 3 random years
    const years = Array.from({ length: 3 }).map(() => Math.floor(Math.random() * 100));
    setQuestions(years);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "success") return;
    
    const year = questions[currentIndex]; // e.g. 26
    
    // Calculate correct values
    const a = Math.floor(year / 12);
    const b = year % 12;
    const c = Math.floor(b / 4);
    const final = (a + b + c) % 7;

    const userA = parseInt(inputs.step1);
    const userB = parseInt(inputs.step2);
    const userC = parseInt(inputs.step3);
    const userFinal = parseInt(inputs.result);

    if (userA === a && userB === b && userC === c && userFinal === final) {
      setStatus("success");
      setTimeout(() => {
        if (currentIndex < 2) {
          setCurrentIndex(c => c + 1);
          setInputs({ step1: "", step2: "", step3: "", result: "" });
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
              <p>Das ist die Königsdisziplin: Der <strong>Jahres-Code</strong> (die letzten 2 Ziffern des Jahres).</p>
              <p>Wir verwenden die Division-durch-12-Methode. Beispiel für <strong>2026</strong> (wir schauen nur auf <strong className="text-white">26</strong>):</p>
              <ol className="list-decimal pl-5 mt-4 space-y-2 text-white">
                <li><strong>Wie oft passt die 12 in 26?</strong> &rarr; 2 mal.</li>
                <li><strong>Was ist der Rest?</strong> &rarr; 2 (denn 2 * 12 = 24. 26 - 24 = 2).</li>
                <li><strong>Wie oft passt die 4 in diesen Rest?</strong> &rarr; 0 mal (denn 2 / 4 = 0).</li>
                <li><strong>Alles addieren:</strong> 2 + 2 + 0 = 4.</li>
              </ol>
              <p>Die <strong>4</strong> ist der Jahrescode. (Wir machen am Ende Modulo 7, also falls die Summe größer als 6 ist, einfach 7 abziehen, bis man zwischen 0 und 6 ist).</p>
            </>
          ) : (
            <>
              <p>This is the ultimate challenge: The <strong>Year Code</strong> (the last 2 digits of the year).</p>
              <p>We use the divide-by-12 method. Example for <strong>2026</strong> (we only look at <strong className="text-white">26</strong>):</p>
              <ol className="list-decimal pl-5 mt-4 space-y-2 text-white">
                <li><strong>How many times does 12 fit into 26?</strong> &rarr; 2 times.</li>
                <li><strong>What is the remainder?</strong> &rarr; 2 (since 2 * 12 = 24. 26 - 24 = 2).</li>
                <li><strong>How many times does 4 fit into this remainder?</strong> &rarr; 0 times (since 2 / 4 = 0).</li>
                <li><strong>Add everything together:</strong> 2 + 2 + 0 = 4.</li>
              </ol>
              <p><strong>4</strong> is the year code. (We do modulo 7 at the end, so if the sum is greater than 6, simply subtract 7 until you are between 0 and 6).</p>
            </>
          )}
        </div>
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <Button onClick={() => setIsQuizMode(true)}>{isDe ? 'Weiter zum Mini-Quiz' : 'Proceed to Mini-Quiz'}</Button>
        </div>
      </div>
    );
  }

  const year = questions[currentIndex];

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      <h3 className="text-2xl font-semibold text-white">Mini-Quiz ({currentIndex + 1}/3)</h3>
      <p className="text-gray-400">
        {isDe ? 'Berechne den Jahrescode für das Jahr XX' : 'Calculate the year code for the year XX'}
        <strong className="text-white text-2xl">{year?.toString().padStart(2, '0') || '00'}</strong>
      </p>
      
      <motion.div 
        animate={status === "error" ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "w-full max-w-lg p-6 rounded-2xl border bg-white/5 backdrop-blur-md transition-shadow duration-300",
          status === "error" ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : 
          status === "success" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-white/10"
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">1. {year} / 12 {isDe ? '(ganzzahlig)' : '(integer)'}</label>
            <input type="number" required value={inputs.step1} onChange={e => setInputs({...inputs, step1: e.target.value})} className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-2 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">2. {isDe ? 'Rest von Schritt 1' : 'Remainder of step 1'}</label>
            <input type="number" required value={inputs.step2} onChange={e => setInputs({...inputs, step2: e.target.value})} className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-2 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">3. {isDe ? '(Rest aus Schritt 2)' : '(Remainder from step 2)'} / 4 {isDe ? '(ganzzahlig)' : '(integer)'}</label>
            <input type="number" required value={inputs.step3} onChange={e => setInputs({...inputs, step3: e.target.value})} className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-2 text-white" />
          </div>
          <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="text-sm text-amber-400 font-semibold">4. {isDe ? 'Summe modulo 7 (Endergebnis)' : 'Sum modulo 7 (Final result)'}</label>
            <input type="number" required value={inputs.result} onChange={e => setInputs({...inputs, result: e.target.value})} className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xl font-bold text-center focus:border-amber-400" />
          </div>
          
          <Button type="submit" variant="primary" className="w-full mt-4">{isDe ? 'Prüfen' : 'Check'}</Button>
        </form>
      </motion.div>
    </div>
  );
}
