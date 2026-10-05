import { useState, useEffect } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RingLight() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brightness, setBrightness] = usePersistedState("ring:brightness", 80);
  const [mode, setMode] = usePersistedState("ring:mode", "warm");
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [rgbPhase, setRgbPhase] = useState(0);

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

  // RGB animation
  useEffect(() => {
    if (mode !== "rgb") return;
    const interval = setInterval(() => {
      setRgbPhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [mode]);

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

  const getBackgroundColor = () => {
    const opacity = brightness / 100;
    if (mode === "warm") {
      return `rgba(255, 200, 100, ${opacity})`;
    } else if (mode === "cool") {
      return `rgba(100, 200, 255, ${opacity})`;
    } else {
      // RGB mode with rotating hue
      const hue = rgbPhase;
      return `hsla(${hue}, 100%, 50%, ${opacity})`;
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center transition-all duration-300 overflow-hidden"
      style={{ backgroundColor: getBackgroundColor() }}
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Ring Light Visualization */}
      <motion.div
        className="relative w-96 h-96"
        animate={{
          boxShadow: [
            `0 0 60px 20px ${getBackgroundColor()}`,
            `0 0 80px 30px ${getBackgroundColor()}`,
            `0 0 60px 20px ${getBackgroundColor()}`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 rounded-full border-8 border-white/30 opacity-50" />
        <div className="absolute inset-8 rounded-full border-4 border-white/20 opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm" />
        </div>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 max-w-md">
          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={setMode} className="mb-4">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="warm" className="text-xs">
                Warm
              </TabsTrigger>
              <TabsTrigger value="cool" className="text-xs">
                Cool
              </TabsTrigger>
              <TabsTrigger value="rgb" className="text-xs">
                RGB
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Brightness Control */}
          <div className="flex items-center gap-3 mb-4">
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
      </motion.div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-4xl font-bold text-white/60">Ring Light</h1>
        <p className="text-white/50 mt-2">Professional lighting simulator • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
