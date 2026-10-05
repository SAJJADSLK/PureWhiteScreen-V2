import { useState, useEffect } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { motion } from "framer-motion";
import { Maximize, Minimize, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function Teleprompter() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [speed, setSpeed] = usePersistedState("tele:speed", 30);
  const [fontSize, setFontSize] = usePersistedState("tele:size", 32);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [text, setText] = useState(
    "Welcome to Pure White Screen Teleprompter.\n\nThis is a professional teleprompter tool for content creators and presenters.\n\nYou can adjust the speed, font size, and text color to suit your needs.\n\nUse the controls below to manage playback and scroll speed.\n\nPress F for fullscreen mode.\n\nHappy presenting!"
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setScrollPosition((prev) => prev + speed / 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, isPlaying]);

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
      {/* Text Display */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden px-8">
        <motion.div
          className="text-center text-white"
          style={{
            fontSize: `${fontSize}px`,
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {text.split("\n").map((line, i) => (
            <p key={i} className="mb-6 leading-relaxed">
              {line}
            </p>
          ))}
        </motion.div>
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 max-w-2xl">
          <div className="space-y-4">
            {/* Play/Pause */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="sm"
                className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              {/* Speed Control */}
              <div className="flex items-center gap-2 flex-1">
                <span className="text-white text-sm min-w-12">Speed</span>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={5}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-white text-sm min-w-12">{speed}%</span>
              </div>

              {/* Font Size Control */}
              <div className="flex items-center gap-2 flex-1">
                <span className="text-white text-sm min-w-12">Size</span>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={16}
                  max={72}
                  step={2}
                  className="flex-1"
                />
                <span className="text-white text-sm min-w-12">{fontSize}px</span>
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
            </div>

            {/* Text Input */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded p-2 text-xs h-20 resize-none"
              placeholder="Enter your teleprompter text here..."
            />
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
        <h1 className="text-4xl font-bold text-white/60">Teleprompter</h1>
        <p className="text-white/50 mt-2">Press SPACE to play/pause • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
