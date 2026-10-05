import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const colors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#00FF00" },
  { name: "Blue", hex: "#0000FF" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Magenta", hex: "#FF00FF" },
];

export default function DeadPixelTest() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else if (e.key === " " || e.key === "ArrowRight") {
        nextColor();
      } else if (e.key === "ArrowLeft") {
        prevColor();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, currentColorIndex]);

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

  const nextColor = () => {
    setCurrentColorIndex((prev) => (prev + 1) % colors.length);
  };

  const prevColor = () => {
    setCurrentColorIndex((prev) => (prev - 1 + colors.length) % colors.length);
  };

  const currentColor = colors[currentColorIndex];

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center transition-all duration-300"
      style={{ backgroundColor: currentColor.hex }}
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Test Pattern Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-10 h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-6 border border-white/20">
          {/* Color Navigation */}
          <div className="flex items-center gap-3">
            <Button
              onClick={prevColor}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              ←
            </Button>
            <div className="text-white text-sm font-medium min-w-24 text-center">
              {currentColor.name}
            </div>
            <Button
              onClick={nextColor}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* Fullscreen Button */}
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>

          {/* Keyboard Shortcuts */}
          <div className="text-white/60 text-xs hidden sm:block">
            <p>SPACE/→: Next | ←: Prev | F: Fullscreen</p>
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
        <h1 className="text-4xl font-bold text-white/60">Dead Pixel Test</h1>
        <p className="text-white/50 mt-2">Look for stuck or dead pixels • Use arrow keys to change colors</p>
      </motion.div>

      {/* Color Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 flex gap-2"
      >
        {colors.map((color, index) => (
          <motion.div
            key={color.hex}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentColorIndex ? "ring-2 ring-white scale-125" : "opacity-50"
            }`}
            style={{ backgroundColor: color.hex }}
            onClick={() => setCurrentColorIndex(index)}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
