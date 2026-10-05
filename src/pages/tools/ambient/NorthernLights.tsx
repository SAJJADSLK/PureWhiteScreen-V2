import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import SoundEngine from "@/components/SoundEngine";

export default function NorthernLights() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);
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
      className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950"
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      <SoundEngine tracks={[{ kind: "aurora", volume }]} />
      {/* Aurora Borealis Waves */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent blur-3xl"
          style={{
            opacity: brightness / 100 * (0.3 - i * 0.05),
          }}
          animate={{
            y: [i * 50, i * 50 - 100, i * 50],
            opacity: [brightness / 100 * (0.3 - i * 0.05) * 0.5, brightness / 100 * (0.3 - i * 0.05), brightness / 100 * (0.3 - i * 0.05) * 0.5],
          }}
          transition={{
            duration: 5 + i * 1,
            repeat: Infinity,
            ease: "easeInOut" as any,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Purple Aurora */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-64 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent blur-3xl"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as any,
        }}
      />

      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            opacity: [Math.random() * 0.7 + 0.3, Math.random() * 0.3 + 0.1, Math.random() * 0.7 + 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-emerald-500/30 max-w-md">
          <div className="space-y-4">
            {/* Brightness Control */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">Brightness</span>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={10}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white text-sm min-w-12">{brightness}%</span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              {volume > 0 ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white" />}
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white text-sm min-w-12">{volume}%</span>
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
        <h1 className="text-4xl font-bold text-emerald-200/20">Northern Lights</h1>
        <p className="text-emerald-200/10 mt-2">Magical aurora borealis • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
