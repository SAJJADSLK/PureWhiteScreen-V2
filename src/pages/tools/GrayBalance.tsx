import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function GrayBalance() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [grayLevel, setGrayLevel] = useState(128);

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

  const grayColor = `rgb(${grayLevel}, ${grayLevel}, ${grayLevel})`;

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center"
      style={{ backgroundColor: grayColor }}
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Gray Level Display */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-6xl font-bold mb-4"
          style={{ color: grayLevel > 128 ? "black" : "white" }}
        >
          {grayLevel}
        </h1>
        <p
          className="text-xl"
          style={{ color: grayLevel > 128 ? "black" : "white" }}
        >
          Gray Balance Level
        </p>
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
            {/* Gray Level Slider */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">Level</span>
              <Slider
                value={[grayLevel]}
                onValueChange={(value) => setGrayLevel(value[0])}
                min={0}
                max={255}
                step={1}
                className="flex-1"
              />
              <span className="text-white text-sm min-w-12">{grayLevel}</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => setGrayLevel(0)}
                size="sm"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Black
              </Button>
              <Button
                onClick={() => setGrayLevel(128)}
                size="sm"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Mid
              </Button>
              <Button
                onClick={() => setGrayLevel(255)}
                size="sm"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                White
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
        <h1
          className="text-4xl font-bold"
          style={{ color: grayLevel > 128 ? "black" : "white", opacity: 0.2 }}
        >
          Gray Balance
        </h1>
        <p
          className="mt-2"
          style={{ color: grayLevel > 128 ? "black" : "white", opacity: 0.1 }}
        >
          Calibrate your display • Press F for fullscreen
        </p>
      </motion.div>
    </div>
  );
}
