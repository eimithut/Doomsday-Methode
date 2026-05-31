import { useState, useEffect, lazy, Suspense } from 'react';
import { ViewState } from './types';
import { AnimatePresence } from 'motion/react';
import { getDB } from './lib/db';
import { I18nProvider } from './lib/i18n';

const Home = lazy(() => import('./views/Home').then(m => ({ default: m.Home })));
const Learn = lazy(() => import('./views/Learn').then(m => ({ default: m.Learn })));
const Train = lazy(() => import('./views/Train').then(m => ({ default: m.Train })));
const Analytics = lazy(() => import('./views/Analytics').then(m => ({ default: m.Analytics })));
const Daily = lazy(() => import('./views/Daily').then(m => ({ default: m.Daily })));

const Loader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [view, setViewState] = useState<ViewState>('home');

  useEffect(() => {
    // Initialize DB on app load
    getDB().catch(console.error);
  }, []);

  return (
    <I18nProvider>
      <div className="min-h-screen bg-[#020617] text-gray-100 selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
        {/* Abstract Background Design */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
        </div>

        <main className="relative z-10 w-full min-h-screen p-6 md:p-12 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <Suspense key="s-home" fallback={<Loader />}>
                <Home setViewState={setViewState} />
              </Suspense>
            )}
            {view === 'learn' && (
              <Suspense key="s-learn" fallback={<Loader />}>
                <Learn setViewState={setViewState} />
              </Suspense>
            )}
            {view === 'train' && (
              <Suspense key="s-train" fallback={<Loader />}>
                <Train setViewState={setViewState} />
              </Suspense>
            )}
            {view === 'daily' && (
              <Suspense key="s-daily" fallback={<Loader />}>
                <Daily setViewState={setViewState} />
              </Suspense>
            )}
            {view === 'analytics' && (
              <Suspense key="s-analytics" fallback={<Loader />}>
                <Analytics setViewState={setViewState} />
              </Suspense>
            )}
          </AnimatePresence>
        </main>
      </div>
    </I18nProvider>
  );
}
