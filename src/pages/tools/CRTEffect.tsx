import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CRTEffect() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
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

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden"
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* CRT Screen */}
      <motion.div
        className="relative w-96 h-72 bg-gradient-to-br from-green-900 to-black rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden"
        animate={{
          boxShadow: [
            "0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.8)",
            "0 0 60px rgba(0, 255, 0, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.8)",
            "0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.8)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Screen content */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 to-black flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold text-green-400 font-mono mb-4"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ▮
            </motion.div>
            <p className="text-green-400 font-mono text-sm">RETRO CRT MODE</p>
            <p className="text-green-400 font-mono text-xs mt-2 opacity-70">Press any key...</p>
          </div>
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="h-px bg-black/30 w-full"
              style={{ marginTop: "3px" }}
            />
          ))}
        </div>

        {/* Glare effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />

        {/* Bezel */}
        <div className="absolute inset-0 rounded-2xl border-4 border-gray-800/50 pointer-events-none" />
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-6 border border-green-500/30">
          <span className="text-green-400 text-sm font-mono">CRT EFFECT</span>
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="ghost"
            className="text-green-400 hover:bg-green-400/20"
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
        <h1 className="text-4xl font-bold text-green-400/20 font-mono">CRT RETRO</h1>
        <p className="text-green-400/10 mt-2 font-mono">Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
