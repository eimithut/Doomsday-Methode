import { useState, useEffect } from "react";
import { ViewState, Answer } from "../types";
import { getAllAnswers } from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { motion } from "motion/react";
import { Home, Target, Clock, AlertTriangle, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useI18n } from "../lib/i18n";

interface AnalyticsProps {
  key?: string;
  setViewState: (view: ViewState) => void;
}

export function Analytics({ setViewState }: AnalyticsProps) {
  const { locale } = useI18n();
  const isDe = locale === 'de';

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAnswers().then(data => {
      setAnswers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-20">{isDe ? 'Daten werden geladen...' : 'Loading data...'}</div>;
  }

  if (answers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">{isDe ? 'Noch keine Daten' : 'No Data Yet'}</h2>
        <p className="text-gray-400">{isDe ? 'Absolviere einige Trainings-Sessions, um deine Statistiken zu sehen.' : 'Complete some training sessions to see your analytics.'}</p>
        <Button onClick={() => setViewState('home')}>{isDe ? 'Zurück' : 'Go Back'}</Button>
      </div>
    );
  }

  // Calculate generic properties allowing legacy format (isCorrect boolean fallback)
  const isStatusCorrect = (a: Answer) => a.status === 'correct' || a.status === 'correct_with_help' || a.isCorrect === true;
  
  const accuracy = (answers.filter(isStatusCorrect).length / answers.length) * 100;
  const avgTime = answers.reduce((acc, curr) => acc + curr.timeMs, 0) / answers.length;

  // Process data for charts
  const accuracyOverTime = answers.reduce((acc: any[], curr, i) => {
    if (i % 5 === 0) {
      const chunk = answers.slice(Math.max(0, i - 4), i + 1);
      const chunkAcc = (chunk.filter(isStatusCorrect).length / chunk.length) * 100;
      acc.push({ name: `Q${i+1}`, accuracy: Math.round(chunkAcc) });
    }
    return acc;
  }, []);

  // Weak centuries
  const centuryStats = answers.reduce((acc: Record<string, { total: number, correct: number }>, curr) => {
    const c = curr.century;
    if (!acc[c]) acc[c] = { total: 0, correct: 0 };
    acc[c].total++;
    if (isStatusCorrect(curr)) acc[c].correct++;
    return acc;
  }, {});

  const weakPoints = Object.entries(centuryStats)
    .map(([c, data]: [string, any]) => ({ name: c, acc: (data.correct / data.total) * 100 }))
    .sort((a, b) => a.acc - b.acc);

  // Analyze months
  const monthStats = answers.reduce((acc: Record<number, { total: number, err: number }>, curr) => {
    const m = curr.month;
    if (!acc[m]) acc[m] = { total: 0, err: 0 };
    acc[m].total++;
    if (!isStatusCorrect(curr)) acc[m].err++;
    return acc;
  }, {});

  const monthErrors = Object.entries(monthStats)
    .map(([m, data]: [string, any]) => ({
      name: isDe ? ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][parseInt(m)-1] : locale === 'lv' ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jūn', 'Jūl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'][parseInt(m)-1] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m)-1],
      errorRate: Math.round((data.err / data.total) * 100)
    }))
    .sort((a, b) => b.errorRate - a.errorRate) // highest error rate first
    .slice(0, 5); // top 5 hardest months

  // Cheat Sheet Usage Analysis
  const cheatUsedCount = answers.filter(a => a.status === 'correct_with_help' || a.status === 'incorrect_with_help').length;
  
  const COLORS = ['#ef4444', '#3b82f6', '#10b981'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto w-full space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => setViewState('home')} className="px-2">
          <Home className="w-4 h-4 mr-2" /> {isDe ? 'Menü' : 'Menu'}
        </Button>
        <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h2>
        <div className="hidden sm:block w-[100px]"></div> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-full">
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">{isDe ? 'Gesamtgenauigkeit' : 'Overall Accuracy'}</p>
            <p className="text-3xl font-bold text-white">{accuracy.toFixed(1)}%</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">{isDe ? 'Ø Reaktionszeit' : 'Avg. Time'}</p>
            <p className="text-3xl font-bold text-white">{(avgTime / 1000).toFixed(2)}s</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">{isDe ? 'Schwächstes Jhd.' : 'Weakest Century'}</p>
            <p className="text-3xl font-bold text-white">{weakPoints[0]?.name || "-"}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4 border-purple-500/20">
          <div className="p-4 bg-purple-500/10 rounded-full">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">{isDe ? 'Spickzettel genutzt' : 'Cheat Sheet Usage'}</p>
            <p className="text-3xl font-bold text-white">{cheatUsedCount}x</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">{isDe ? 'Genauigkeits-Trend (Gleitend)' : 'Accuracy Trend'}</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8'}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#34d399" strokeWidth={3} dot={{ fill: '#059669', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">{isDe ? 'Genauigkeit nach Jahrhundert' : 'Accuracy by Century'}</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weakPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8'}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="acc" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6">{isDe ? 'Schwierigste Monate (Fehlerquote %)' : 'Hardest Months (Error Rate %)'}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthErrors} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8'}} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="errorRate" fill="#f43f5e" radius={[0, 4, 4, 0]}>
                {monthErrors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Jan' || entry.name === 'Feb' ? '#fb923c' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-gray-400 text-sm mt-4 text-center">
          {isDe ? 'Ein hoher orangefarbener Balken (Jan/Feb) deutet oft auf Probleme mit Schaltjahr-Regeln hin.' : 'A high orange bar (Jan/Feb) often indicates struggles with leap year rules.'}
        </p>
      </GlassCard>
    </motion.div>
  );
}
