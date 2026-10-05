import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import SoundEngine from "@/components/SoundEngine";

interface SoundTrack {
  name: string;
  icon: string;
  color: string;
  volume: number;
}

export default function SoundMixer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [sounds, setSounds] = useState<SoundTrack[]>([
    { name: "Rain", icon: "🌧️", color: "from-blue-500 to-cyan-400", volume: 50 },
    { name: "White Noise", icon: "🌫️", color: "from-gray-400 to-gray-300", volume: 40 },
    { name: "Cafe", icon: "☕", color: "from-amber-600 to-orange-400", volume: 30 },
  ]);

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

  const updateVolume = (index: number, volume: number) => {
    const newSounds = [...sounds];
    newSounds[index].volume = volume;
    setSounds(newSounds);
  };

  const totalVolume = Math.round(sounds.reduce((sum, s) => sum + s.volume, 0) / sounds.length);

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-[oklch(0.08_0.02_270)] via-[oklch(0.1_0.02_265)] to-[oklch(0.12_0.03_180)] overflow-hidden"
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      <SoundEngine tracks={sounds.map((t) => ({ kind: ({ Rain: "rain", "White Noise": "white", Cafe: "cafe" } as Record<string, string>)[t.name], volume: t.volume }))} />
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        {sounds.map((sound, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r ${sound.color} blur-3xl`}
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              opacity: sound.volume / 100 * 0.3,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [sound.volume / 100 * 0.2, sound.volume / 100 * 0.4, sound.volume / 100 * 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut" as any,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-8xl font-bold text-white mb-8"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {totalVolume}%
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">Sound Mixer</h1>
        <p className="text-white/70 mb-8">Balance your ambient sounds</p>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 max-w-2xl w-96">
          <div className="space-y-4">
            {/* Sound Tracks */}
            {sounds.map((sound, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">
                    {sound.icon} {sound.name}
                  </span>
                  <span className="text-white/70 text-xs">{sound.volume}%</span>
                </div>
                <Slider
                  value={[sound.volume]}
                  onValueChange={(value) => updateVolume(index, value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}

            {/* Divider */}
            <div className="border-t border-white/20 my-4" />

            {/* Master Controls */}
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Master Volume</span>
              <span className="text-white/70 text-xs">{totalVolume}%</span>
            </div>

            {/* Fullscreen Button */}
            <div className="flex justify-end pt-2">
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
        <h1 className="text-4xl font-bold text-white/60">Ambient Sound Mixer</h1>
        <p className="text-white/50 mt-2">Mix rain, white noise, and cafe sounds • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
