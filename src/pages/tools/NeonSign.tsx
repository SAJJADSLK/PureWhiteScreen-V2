import { useState, useEffect } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NeonSign() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [text, setText] = usePersistedState("neon:text", "NEON");
  const [color, setColor] = usePersistedState("neon:color", "#00FFFF");
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
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-black"
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Neon Text Display */}
      <motion.div
        className="text-center"
        animate={{
          textShadow: [
            `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
            `0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
            `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <h1
          className="text-9xl font-bold font-mono tracking-widest"
          style={{
            color: color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
          }}
        >
          {text}
        </h1>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 max-w-md">
          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <label className="text-white text-sm mb-2 block">Text</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase().slice(0, 20))}
                className="bg-white/10 text-white border-white/20 placeholder-white/30"
                placeholder="Enter text..."
              />
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-3">
              <label className="text-white text-sm">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-2 border-white/30"
              />
              <span className="text-white text-sm flex-1">{color}</span>
            </div>

            {/* Fullscreen Button */}
            <div className="flex justify-end">
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-4xl font-bold text-white/60">Neon Sign Generator</h1>
        <p className="text-white/50 mt-2">Create custom neon signs • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
