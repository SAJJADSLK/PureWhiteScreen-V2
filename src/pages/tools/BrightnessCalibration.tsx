import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function BrightnessCalibration() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [brightness, setBrightness] = useState(50);
  const [mode, setMode] = useState<"gradient" | "pattern" | "stripes">("gradient");

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

  const renderPattern = () => {
    switch (mode) {
      case "gradient":
        return (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, rgb(0,0,0), rgb(${brightness * 5}, ${brightness * 5}, ${brightness * 5}), rgb(255,255,255))`,
            }}
          />
        );
      case "pattern":
        return (
          <div className="absolute inset-0 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  backgroundColor: i % 2 === 0 ? `rgb(${brightness * 5}, ${brightness * 5}, ${brightness * 5})` : "white",
                }}
              />
            ))}
          </div>
        );
      case "stripes":
        return (
          <div className="absolute inset-0 flex flex-col">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  backgroundColor: i % 2 === 0 ? `rgb(${brightness * 5}, ${brightness * 5}, ${brightness * 5})` : "white",
                }}
              />
            ))}
          </div>
        );
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
      {/* Pattern Display */}
      <div className="absolute inset-0">
        {renderPattern()}
      </div>

      {/* Brightness Value Overlay */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="text-8xl font-bold text-black/30">{brightness}%</div>
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
            {/* Brightness Slider */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">Brightness</span>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white text-sm min-w-12">{brightness}%</span>
            </div>

            {/* Pattern Modes */}
            <div className="flex gap-2">
              <Button
                onClick={() => setMode("gradient")}
                size="sm"
                variant={mode === "gradient" ? "default" : "outline"}
                className={mode === "gradient" ? "bg-white text-black" : "text-white border-white/30"}
              >
                Gradient
              </Button>
              <Button
                onClick={() => setMode("pattern")}
                size="sm"
                variant={mode === "pattern" ? "default" : "outline"}
                className={mode === "pattern" ? "bg-white text-black" : "text-white border-white/30"}
              >
                Pattern
              </Button>
              <Button
                onClick={() => setMode("stripes")}
                size="sm"
                variant={mode === "stripes" ? "default" : "outline"}
                className={mode === "stripes" ? "bg-white text-black" : "text-white border-white/30"}
              >
                Stripes
              </Button>
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
        <h1 className="text-4xl font-bold text-white/60">Brightness Calibration</h1>
        <p className="text-white/50 mt-2">Adjust your display brightness • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
