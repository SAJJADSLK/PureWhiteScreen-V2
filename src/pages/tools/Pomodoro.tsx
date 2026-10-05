import { useState, useEffect, useRef } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { motion } from "framer-motion";
import { Maximize, Minimize, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

function beep() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    [0, 0.25, 0.5].forEach((d) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + d;
      o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.22);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch { /* audio unavailable */ }
}

export default function Pomodoro() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workTime, setWorkTime] = usePersistedState("pomo:work", 25);
  const [breakTime, setBreakTime] = usePersistedState("pomo:break", 5);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  const latest = useRef({ isWorkSession, workTime, breakTime });
  latest.current = { isWorkSession, workTime, breakTime };

  // Timestamp-based timer: stays accurate in background tabs and has no side effects inside state updaters
  useEffect(() => {
    if (!isPlaying) return;
    const endAt = Date.now() + timeLeft * 1000;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      if (remaining > 0) {
        setTimeLeft(remaining);
        return;
      }
      beep();
      const nextWork = !latest.current.isWorkSession;
      setIsWorkSession(nextWork);
      setTimeLeft((nextWork ? latest.current.workTime : latest.current.breakTime) * 60);
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isWorkSession]);

  useEffect(() => {
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const ss = String(timeLeft % 60).padStart(2, "0");
    if (isPlaying) document.title = `${mm}:${ss} ${isWorkSession ? "Work" : "Break"} - Pomodoro`;
    return () => { document.title = "Pomodoro Timer - Pure White Screen"; };
  }, [timeLeft, isPlaying, isWorkSession]);

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

  const reset = () => {
    setIsPlaying(false);
    setIsWorkSession(true);
    setTimeLeft(workTime * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-[oklch(0.08_0.02_270)] via-[oklch(0.1_0.02_265)] to-[oklch(0.12_0.03_180)]"
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Timer Display */}
      <motion.div className="text-center">
        <motion.div
          className={`text-9xl font-bold mb-8 font-mono ${
            isWorkSession ? "text-[oklch(0.7_0.25_180)]" : "text-[oklch(0.65_0.25_280)]"
          }`}
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </motion.div>

        <motion.h2
          className={`text-4xl font-bold mb-8 ${
            isWorkSession ? "text-[oklch(0.7_0.25_180)]" : "text-[oklch(0.65_0.25_280)]"
          }`}
          animate={{
            opacity: [1, 0.7, 1],
          }}
          transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
        >
          {isWorkSession ? "Work Time" : "Break Time"}
        </motion.h2>

        {/* Progress Ring */}
        <motion.div
          className="w-48 h-48 mx-auto mb-8 rounded-full border-8 border-[oklch(0.2_0.02_270)]"
          style={{
            borderTopColor: isWorkSession ? "oklch(0.7 0.25 180)" : "oklch(0.65 0.25 280)",
            rotate: `${(timeLeft / (isWorkSession ? workTime * 60 : breakTime * 60)) * 360}deg`,
          }}
        />
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-[oklch(0.12_0.02_270)]/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-[oklch(0.2_0.02_270)] max-w-2xl">
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center gap-4 justify-center">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="sm"
                className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button
                onClick={reset}
                size="sm"
                variant="outline"
                className="text-white border-[oklch(0.7_0.25_180)]"
              >
                <RotateCcw size={20} />
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

            {/* Time Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">Work Time (min)</label>
                <Slider
                  value={[workTime]}
                  onValueChange={(value) => {
                    setWorkTime(value[0]);
                    if (isWorkSession && !isPlaying) {
                      setTimeLeft(value[0] * 60);
                    }
                  }}
                  min={1}
                  max={60}
                  step={1}
                />
                <span className="text-white text-xs mt-1">{workTime} min</span>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Break Time (min)</label>
                <Slider
                  value={[breakTime]}
                  onValueChange={(value) => {
                    setBreakTime(value[0]);
                    if (!isWorkSession && !isPlaying) {
                      setTimeLeft(value[0] * 60);
                    }
                  }}
                  min={1}
                  max={30}
                  step={1}
                />
                <span className="text-white text-xs mt-1">{breakTime} min</span>
              </div>
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
        <h1 className="text-4xl font-bold text-white/60">Pomodoro Timer</h1>
        <p className="text-white/50 mt-2">Press SPACE to play/pause • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
