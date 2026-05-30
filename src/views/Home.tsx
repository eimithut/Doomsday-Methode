import { Calendar, Brain, Activity, Globe } from "lucide-react";
import { ViewState } from "../types";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { motion } from "motion/react";
import { useI18n } from "../lib/i18n";

interface HomeProps {
  key?: string;
  setViewState: (view: ViewState) => void;
}

export function Home({ setViewState }: HomeProps) {
  const { locale, setLocale } = useI18n();

  const isDe = locale === 'de';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto w-full space-y-8"
    >
      <div className="flex justify-end w-full">
        <Button 
          variant="ghost" 
          onClick={() => setLocale(locale === 'de' ? 'en' : 'de')}
          className="text-sm border border-white/10"
        >
          <Globe className="w-4 h-4 mr-2" />
          {isDe ? 'Switch to English' : 'Auf Deutsch wechseln'}
        </Button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          {isDe ? 'Doomsday Methode' : 'Doomsday Algorithm'}
        </h1>
        <p className="text-xl text-gray-400">
          {isDe 
            ? 'Meistere die Kopfrechnung zur Bestimmung des Wochentags.' 
            : 'Master the mental calculation of the day of the week.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <GlassCard className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Brain className="w-12 h-12 text-blue-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {isDe ? 'Lernen' : 'Learn'}
            </h2>
            <p className="text-gray-400">
              {isDe 
                ? 'Schritt-für-Schritt Anleitung zur Doomsday-Methode.' 
                : 'Step-by-step guide to the Doomsday method.'}
            </p>
          </div>
          <Button onClick={() => setViewState('learn')} className="w-full mt-auto">
            {isDe ? 'Lernen starten' : 'Start Learning'}
          </Button>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-purple-500/10 rounded-full">
            <Calendar className="w-12 h-12 text-purple-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
               {isDe ? 'Training' : 'Train'}
            </h2>
            <p className="text-gray-400">
               {isDe 
                ? 'Übe mit zufälligen Daten, um schneller zu werden.' 
                : 'Practice with random dates to improve speed.'}
            </p>
          </div>
          <Button onClick={() => setViewState('train')} className="w-full mt-auto">
             {isDe ? 'Training starten' : 'Start Training'}
          </Button>
        </GlassCard>
      </div>

      <div className="pt-8">
        <GlassCard 
          className="p-6 cursor-pointer hover:bg-white/[0.07] transition-colors" 
          onClick={() => setViewState('analytics')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>
                <p className="text-sm text-gray-400">
                  {isDe 
                    ? 'Verfolge deinen Fortschritt und deine Genauigkeit.' 
                    : 'Track your progress and accuracy.'}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setViewState('analytics')}>
              {isDe ? 'Statistiken ansehen' : 'View Stats'}
            </Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
