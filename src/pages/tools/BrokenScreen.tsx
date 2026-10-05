import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BrokenScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [cracks, setCracks] = useState<Array<{ x: number; y: number; angle: number; length: number }>>([]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else if (e.key === "r" || e.key === "R") {
        generateCracks();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideControlsTimer) clearTimeout(hideControlsTimer);
      const timer = setTimeout(() => setShowControls(false), 3000);
      setHideControlsTimer(timer);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideControlsTimer) clearTimeout(hideControlsTimer);
    };
  }, [hideControlsTimer]);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const generateCracks = () => {
    const newCracks = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      angle: Math.random() * 360,
      length: 20 + Math.random() * 40,
    }));
    setCracks(newCracks);
  };

  useEffect(() => {
    generateCracks();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Cracked Glass Effect */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        {cracks.map((crack, idx) => (
          <g key={idx}>
            {/* Main crack line */}
            <line
              x1={`${crack.x}%`}
              y1={`${crack.y}%`}
              x2={`${crack.x + Math.cos((crack.angle * Math.PI) / 180) * crack.length}%`}
              y2={`${crack.y + Math.sin((crack.angle * Math.PI) / 180) * crack.length}%`}
              stroke="#FF4444"
              strokeWidth="3"
              opacity="0.8"
            />
            {/* Secondary cracks */}
            {[1, 2].map((sub) => (
              <line
                key={`sub-${sub}`}
                x1={`${crack.x + Math.cos((crack.angle * Math.PI) / 180) * (crack.length * 0.5)}`}
                y1={`${crack.y + Math.sin((crack.angle * Math.PI) / 180) * (crack.length * 0.5)}`}
                x2={`${crack.x + Math.cos(((crack.angle + 30 * sub) * Math.PI) / 180) * (crack.length * 0.7)}`}
                y2={`${crack.y + Math.sin(((crack.angle + 30 * sub) * Math.PI) / 180) * (crack.length * 0.7)}`}
                stroke="#FF6666"
                strokeWidth="2"
                opacity="0.6"
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Broken Glass Shards */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 15 }).map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute bg-gradient-to-br from-red-500/50 to-red-600/50 border border-red-400/50"
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Error Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center pointer-events-none"
      >
        <div className="text-6xl font-bold text-red-500 mb-4">SCREEN DAMAGED</div>
        <div className="text-2xl text-red-400 mb-8">Your display has encountered an error</div>
        <div className="text-lg text-red-300 font-mono">
          <div>Error Code: DISP_CRIT_001</div>
          <div>Status: CRITICAL</div>
          <div className="mt-4 text-sm text-red-200">This is a prank. Your screen is fine!</div>
        </div>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-6 border border-white/20">
          <Button
            onClick={generateCracks}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            title="Generate new cracks (R)"
          >
            <RotateCcw size={18} />
          </Button>

          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>
        </div>
      </motion.div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-4xl font-bold text-red-500/20">Broken Screen Prank</h1>
        <p className="text-red-400/10 mt-2">Press R to regenerate • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
