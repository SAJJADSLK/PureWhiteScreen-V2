import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const hackerCode = `
> ACCESSING MAINFRAME...
> INITIALIZING SECURITY PROTOCOLS
> BYPASSING FIREWALL... [████████░░] 80%
> DECRYPTING DATABASE... [██████████] 100%
> ACCESSING ROOT DIRECTORY
> /usr/bin/system32/security.exe
> LOADING KERNEL MODULES...
> [CRITICAL] UNAUTHORIZED ACCESS DETECTED
> INITIATING COUNTER-MEASURES
> DEPLOYING FIREWALL DEFENSE
> WARNING: SYSTEM UNDER ATTACK
> ACTIVATING DEFENSE GRID
> [ERROR] DEFENSE SYSTEMS OFFLINE
> REROUTING THROUGH BACKUP SERVERS
> ESTABLISHING SECURE TUNNEL
> ENCRYPTION LEVEL: MILITARY GRADE
> ACCESSING CLASSIFIED FILES...
> [████████████████████] 100%
> SYSTEM COMPROMISED
> INITIATING SHUTDOWN SEQUENCE
> WARNING: DATA EXFILTRATION IN PROGRESS
> UPLOADING TO REMOTE SERVER...
`;

export default function HackerTyper() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else if (e.key === "r" || e.key === "R") {
        resetTyper();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsTyping(!isTyping);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, isTyping]);

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
    if (!isTyping) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < hackerCode.length) {
        setDisplayText(hackerCode.substring(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isTyping]);

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

  const resetTyper = () => {
    setDisplayText("");
    setIsTyping(true);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="h-px bg-green-500 mb-1" />
        ))}
      </div>

      {/* Terminal Content */}
      <div className="relative z-10 w-full h-full p-8 overflow-hidden flex flex-col">
        <motion.div
          className="flex-1 font-mono text-green-400 text-sm leading-relaxed overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <pre className="whitespace-pre-wrap break-words">
            {displayText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-green-400 ml-1"
              />
            )}
          </pre>
        </motion.div>

        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />
        </div>
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-6 border border-green-400/30">
          <Button
            onClick={resetTyper}
            size="sm"
            variant="ghost"
            className="text-green-400 hover:bg-green-400/20"
            title="Reset (R)"
          >
            <RotateCcw size={18} />
          </Button>

          <Button
            onClick={() => setIsTyping(!isTyping)}
            size="sm"
            variant="ghost"
            className="text-green-400 hover:bg-green-400/20"
            title="Pause/Resume (Space)"
          >
            {isTyping ? "⏸" : "▶"}
          </Button>

          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="ghost"
            className="text-green-400 hover:bg-green-400/20"
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
        <h1 className="text-2xl font-bold text-green-400/30">HACKER TYPER</h1>
        <p className="text-green-400/20 mt-2">Space to pause • R to reset • F for fullscreen</p>
      </motion.div>
    </div>
  );
}
