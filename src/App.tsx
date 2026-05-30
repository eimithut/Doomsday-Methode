import { useState, useEffect } from 'react';
import { ViewState } from './types';
import { Home } from './views/Home';
import { Learn } from './views/Learn';
import { Train } from './views/Train';
import { Analytics } from './views/Analytics';
import { AnimatePresence } from 'motion/react';
import { getDB } from './lib/db';
import { I18nProvider } from './lib/i18n';

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
            {view === 'home' && <Home key="home" setViewState={setViewState} />}
            {view === 'learn' && <Learn key="learn" setViewState={setViewState} />}
            {view === 'train' && <Train key="train" setViewState={setViewState} />}
            {view === 'analytics' && <Analytics key="analytics" setViewState={setViewState} />}
          </AnimatePresence>
        </main>
      </div>
    </I18nProvider>
  );
}
