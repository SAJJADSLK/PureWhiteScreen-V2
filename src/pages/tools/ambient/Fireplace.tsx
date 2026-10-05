import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import SoundEngine from "@/components/SoundEngine";

export default function Fireplace() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brightness, setBrightness] = useState(80);
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
      className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-900 via-red-900 to-black"
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      <SoundEngine tracks={[{ kind: "fire", volume }]} />
      {/* Fireplace Animation */}
      <div className="absolute inset-0 opacity-80">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-32 h-64 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-300 rounded-full blur-3xl"
            style={{
              left: `${(i / 8) * 100}%`,
              opacity: brightness / 100,
            }}
            animate={{
              y: [0, -20, 0],
              scaleY: [1, 1.2, 1],
              opacity: [brightness / 100 * 0.6, brightness / 100, brightness / 100 * 0.6],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut" as any,
            }}
          />
        ))}
      </div>

      {/* Foreground Logs */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-orange-500/30 max-w-md">
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
        <h1 className="text-4xl font-bold text-orange-300/20">Fireplace</h1>
        <p className="text-orange-300/10 mt-2">Cozy ambient fireplace • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
