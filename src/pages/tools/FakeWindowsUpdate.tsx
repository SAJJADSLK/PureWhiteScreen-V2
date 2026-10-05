import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FakeWindowsUpdate() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  const stages = [
    "Preparing to install...",
    "Downloading updates...",
    "Installing updates...",
    "Configuring system...",
    "Finalizing installation...",
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else if (e.key === "r" || e.key === "R") {
        resetUpdate();
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

  useEffect(() => {
    if (progress >= 100) {
      if (stage < stages.length - 1) {
        setTimeout(() => {
          setStage(stage + 1);
          setProgress(0);
        }, 1000);
      }
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 99));
    }, 500);

    return () => clearInterval(interval);
  }, [progress, stage, stages.length]);

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

  const resetUpdate = () => {
    setProgress(0);
    setStage(0);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center">
      {/* Windows Update Dialog */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 rounded-lg shadow-2xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚙</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Windows Update</h1>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Windows is installing important updates. Please don't turn off your computer.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {stages[Math.min(stage, stages.length - 1)]}
          </p>

          {/* Progress Bar */}
          <div className="bg-gray-300 rounded-full h-6 overflow-hidden mb-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full flex items-center justify-center"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              {progress > 10 && (
                <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
              )}
            </motion.div>
          </div>

          {/* Time Estimate */}
          <p className="text-xs text-gray-500 text-center">
            {progress < 100
              ? `Time remaining: ${Math.ceil((100 - progress) / 10)} minutes`
              : stage < stages.length - 1
                ? "Installing..."
                : "Installation complete. Restarting..."}
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>Do not:</strong> Turn off your PC, close this window, or unplug power
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center">
          <p>This is a prank. Your computer is fine!</p>
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
            onClick={resetUpdate}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            title="Reset (R)"
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
        className="fixed top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-2xl font-bold text-white/60">Fake Windows Update Prank</h1>
        <p className="text-white/50 mt-2">R to reset • F for fullscreen</p>
      </motion.div>
    </div>
  );
}
