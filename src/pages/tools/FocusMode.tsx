import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export default function FocusMode() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer logic
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          if (soundEnabled) {
            playNotificationSound();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, soundEnabled]);

  // Play notification sound
  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isActive) {
          setIsActive(false);
        } else if (timeLeft > 0) {
          setIsActive(true);
        }
      } else if (e.key === "Escape") {
        if (isActive) {
          resetSession();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isActive, timeLeft]);

  // Auto-hide controls
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

  const startFocusSession = () => {
    if (customMinutes > 0) {
      const sessionDuration = customMinutes * 60;
      setTimeLeft(sessionDuration);
      setTotalTime(sessionDuration);
      setIsActive(true);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    const duration = customMinutes * 60;
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center transition-all duration-300"
      style={{
        backgroundColor: `rgba(10, 10, 20, ${opacity / 100})`,
      }}
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Main Timer Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center"
      >
        {/* Circular Progress */}
        <div className="relative w-64 h-64 mb-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#focusGradient)"
              strokeWidth="4"
              strokeDasharray={`${565.48 * (progress / 100)} 565.48`}
              animate={{ strokeDasharray: `${565.48 * (progress / 100)} 565.48` }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {formatTime(timeLeft)}
              </div>
              <p className="text-white/60 mt-4 text-lg">
                {isActive ? "Focus Time" : "Ready to Focus"}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Control Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-2xl">
              {!isActive ? (
                <div className="space-y-6 min-w-80">
                  {/* Time Input */}
                  <div className="space-y-3">
                    <label className="text-white/80 text-sm font-medium">Focus Duration (minutes)</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                        className="bg-white/10 border-white/20 text-white text-center w-20"
                      />
                      <Slider
                        value={[customMinutes]}
                        onValueChange={(value) => setCustomMinutes(value[0])}
                        min={1}
                        max={120}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Opacity Control */}
                  <div className="space-y-3">
                    <label className="text-white/80 text-sm font-medium">Screen Opacity</label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[opacity]}
                        onValueChange={(value) => setOpacity(value[0])}
                        min={10}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-white text-sm min-w-12">{opacity}%</span>
                    </div>
                  </div>

                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-white/80 text-sm font-medium">Notification Sound</label>
                    <Button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      variant="ghost"
                      className={`${
                        soundEnabled ? "text-cyan-400 bg-cyan-400/20" : "text-white/40"
                      } hover:bg-white/20`}
                    >
                      <Volume2 size={20} />
                    </Button>
                  </div>

                  {/* Start Button */}
                  <Button
                    onClick={startFocusSession}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Start Focus Session
                  </Button>

                  {/* Keyboard Hint */}
                  <p className="text-white/40 text-xs text-center">SPACE to start • ESC to exit</p>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  {/* Pause/Resume Button */}
                  <Button
                    onClick={() => setIsActive(!isActive)}
                    variant="ghost"
                    className="text-white hover:bg-white/20 px-6 py-3"
                  >
                    {isActive ? "Pause" : "Resume"}
                  </Button>

                  {/* Stop Button */}
                  <Button
                    onClick={resetSession}
                    variant="ghost"
                    className="text-red-400 hover:bg-red-400/20"
                  >
                    <X size={20} />
                  </Button>

                  {/* Keyboard Hint */}
                  <p className="text-white/40 text-xs">SPACE to pause • ESC to stop</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Text */}
      <AnimatePresence>
        {showControls && !isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
          >
            <h1 className="text-4xl font-bold text-white/60">Focus Mode</h1>
            <p className="text-white/50 mt-2">Eliminate distractions and enter deep focus</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
