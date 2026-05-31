import { useState, useEffect } from "react";
import { Calendar, Brain, Activity, Globe, Target, Zap } from "lucide-react";
import { ViewState } from "../types";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { motion } from "motion/react";
import { useI18n, Locale } from "../lib/i18n";
import { getFullProgress } from "../lib/db";

interface HomeProps {
  key?: string;
  setViewState: (view: ViewState) => void;
}

export function Home({ setViewState }: HomeProps) {
  const { locale, setLocale } = useI18n();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getFullProgress().then(progress => {
      setStreak(progress?.streak || 0);
    });
  }, []);

  const isDe = locale === 'de';
  const isLv = locale === 'lv';

  const handleLanguageSwitch = () => {
    if (locale === 'de') setLocale('en');
    else if (locale === 'en') setLocale('lv');
    else setLocale('de');
  };

  const tTitle = isDe ? 'Doomsday Methode' : isLv ? 'Pastardienas Metode' : 'Doomsday Algorithm';
  const tSubtitle = isDe ? 'Meistere die Kopfrechnung zur Bestimmung des Wochentags.' : isLv ? 'Apgūstiet nedēļas dienas prāta aprēķinus.' : 'Master the mental calculation of the day of the week.';
  const tLearn = isDe ? 'Lernen' : isLv ? 'Mācīties' : 'Learn';
  const tLearnDesc = isDe ? 'Schritt-für-Schritt Anleitung zur Doomsday-Methode.' : isLv ? 'Soli pa solim ceļvedis Pastardienas metodei.' : 'Step-by-step guide to the Doomsday method.';
  const tStartLearning = isDe ? 'Lernen starten' : isLv ? 'Sākt mācīties' : 'Start Learning';
  const tTrain = isDe ? 'Training' : isLv ? 'Apmācība' : 'Train';
  const tTrainDesc = isDe ? 'Übe mit zufälligen Daten, um schneller zu werden.' : isLv ? 'Trenējieties ar nejaušiem datumiem, lai uzlabotu ātrumu.' : 'Practice with random dates to improve speed.';
  const tStartTraining = isDe ? 'Training starten' : isLv ? 'Sākt apmācību' : 'Start Training';
  const tDaily = isDe ? 'Tägliche Challenge' : isLv ? 'Dienas Izaicinājums' : 'Daily Challenge';
  const tDailyDesc = isDe ? 'Löse 5 Daten des Tages. Setze deinen Streak fort!' : isLv ? 'Atrisiniet 5 šīs dienas datumus. Turpiniet savu sēriju!' : 'Solve 5 dates of the day. Keep your streak going!';
  const tStartDaily = isDe ? 'Spielen' : isLv ? 'Spēlēt' : 'Play';
  const tStatsDesc = isDe ? 'Verfolge deinen Fortschritt und deine Genauigkeit.' : isLv ? 'Sekojiet līdzi savam progresam un precizitātei.' : 'Track your progress and accuracy.';
  const tViewStats = isDe ? 'Statistiken ansehen' : isLv ? 'Skatīt statistiku' : 'View Stats';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto w-full space-y-8"
    >
      <div className="flex items-center justify-between w-full">
        <GlassCard className="px-4 py-2 border-amber-500/20 bg-amber-500/5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-amber-400">{streak}</span>
          <span className="text-amber-500/50 text-sm ml-1">✦</span>
        </GlassCard>
        
        <Button 
          variant="ghost" 
          onClick={handleLanguageSwitch}
          className="text-sm border border-white/10 uppercase tracking-widest min-w-[80px]"
        >
          <Globe className="w-4 h-4 mr-2 text-gray-400" />
          {locale}
        </Button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          {tTitle}
        </h1>
        <p className="text-xl text-gray-400">
          {tSubtitle}
        </p>
      </div>

      <div className="pt-4">
        <GlassCard className="p-8 flex items-center justify-between border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-500/20 rounded-2xl relative">
              <Target className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-left space-y-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {tDaily}
                {streak > 0 && <span className="text-sm px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-bold">✦ {streak}</span>}
              </h2>
              <p className="text-gray-400">{tDailyDesc}</p>
            </div>
          </div>
          <Button onClick={() => setViewState('daily')} variant="primary" className="px-8 py-6 text-lg">
            {tStartDaily}
          </Button>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <GlassCard className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-white/5 rounded-full">
            <Brain className="w-12 h-12 text-gray-300" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {tLearn}
            </h2>
            <p className="text-gray-400">
              {tLearnDesc}
            </p>
          </div>
          <Button onClick={() => setViewState('learn')} className="w-full mt-auto">
            {tStartLearning}
          </Button>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-purple-500/10 rounded-full">
            <Calendar className="w-12 h-12 text-purple-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
               {tTrain}
            </h2>
            <p className="text-gray-400">
               {tTrainDesc}
            </p>
          </div>
          <Button onClick={() => setViewState('train')} className="w-full mt-auto">
             {tStartTraining}
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
                  {tStatsDesc}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setViewState('analytics')}>
              {tViewStats}
            </Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
