import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { useI18n } from '../lib/i18n';

interface CheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheatSheet({ isOpen, onClose }: CheatSheetProps) {
  const { locale } = useI18n();

  const isDe = locale === 'de';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <GlassCard className="p-6 md:p-8 flex flex-col space-y-6 relative overflow-y-auto max-h-[85vh]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <HelpCircle className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {isDe ? 'Spickzettel' : 'Cheat Sheet'}
                </h3>
              </div>

              <div className="space-y-6 text-gray-300">
                <section>
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">
                    {isDe ? 'Jahrhundert-Codes' : 'Century Anchors'}
                  </h4>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    <li className="bg-white/5 px-3 py-2 rounded-lg">1800s = 5 {isDe ? '(Fr)' : '(Fri)'}</li>
                    <li className="bg-white/5 px-3 py-2 rounded-lg">1900s = 3 {isDe ? '(Mi)' : '(Wed)'}</li>
                    <li className="bg-white/5 px-3 py-2 rounded-lg">2000s = 2 {isDe ? '(Di)' : '(Tue)'}</li>
                    <li className="bg-white/5 px-3 py-2 rounded-lg">2100s = 0 {isDe ? '(So)' : '(Sun)'}</li>
                  </ul>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">
                    {isDe ? 'Monats-Anker' : 'Month Anchors'}
                  </h4>
                  <div className="space-y-2 text-sm bg-white/5 p-4 rounded-xl">
                    <p><strong>{isDe ? 'Gerade' : 'Even'}:</strong> 4/4, 6/6, 8/8, 10/10, 12/12</p>
                    <p>
                      <strong>{isDe ? 'Ungerade' : 'Odd'}:</strong> {isDe ? '9.5. & 5.9., 7.11. & 11.7.' : '9/5 & 5/9, 7/11 & 11/7'}
                    </p>
                    <p><strong>{isDe ? 'März' : 'March'}:</strong> {isDe ? '14 (Pi Tag)' : '14 (Pi Day)'}</p>
                    <p>
                      <strong>{isDe ? 'Jan & Feb' : 'Jan & Feb'}:</strong>{' '}
                      {isDe ? 'Letzter Tag im Monat (oder 3. Jan / 28. Feb)' : 'Last day of month'}
                      <br/>
                      <span className="text-gray-400 text-xs mt-1 block">
                        {isDe ? 'Schaltjahre: 4. Jan / 29. Feb' : 'Leap years: Jan 4 / Feb 29'}
                      </span>
                    </p>
                  </div>
                </section>
                
                <section>
                   <h4 className="text-lg font-semibold text-emerald-300 mb-2">
                    {isDe ? 'Jahres-Code (Algorithmus)' : 'Year Code (Algorithm)'}
                  </h4>
                  <ol className="list-decimal pl-4 text-sm space-y-1 bg-white/5 p-4 rounded-xl">
                    <li>{isDe ? 'x / 12 (Wie oft passt 12?)' : 'x / 12 (How many times?)'}</li>
                    <li>{isDe ? 'Rest von (1)' : 'Remainder of (1)'}</li>
                    <li>{isDe ? 'Rest / 4' : 'Remainder / 4'}</li>
                    <li>{isDe ? 'Alle drei addieren' : 'Sum all three'}</li>
                    <li>{isDe ? 'Summe mod 7' : 'Sum mod 7'}</li>
                  </ol>
                </section>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
