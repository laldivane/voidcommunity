import { Outlet, useLocation } from 'react-router-dom';
import { LeftSidebar } from '../sidebar/LeftSidebar';
import { RightSidebar } from '../sidebar/RightSidebar';
import { AudioPlayer } from '../audio/AudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-void-bg text-moonlit overflow-hidden font-sans selection:bg-crimson/30 selection:text-white relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-crimson/20 rounded-full blur-[120px] float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple/10 rounded-full blur-[120px] float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Main Layout Grid */}
      <LeftSidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <RightSidebar />

      {/* Persistent Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <AudioPlayer />
        </div>
      </div>
    </div>
  );
}
