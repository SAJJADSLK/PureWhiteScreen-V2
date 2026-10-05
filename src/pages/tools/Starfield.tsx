import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Star {
  x: number;
  y: number;
  z: number;
  vz: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize stars
    const stars: Star[] = [];
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        vz: 5 + Math.random() * 10,
      });
    }
    starsRef.current = stars;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        star.z -= star.vz;

        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const x = (star.x / star.z) * canvas.width + centerX;
        const y = (star.y / star.z) * canvas.height + centerY;
        const size = (1 - star.z / canvas.width) * 3;

        ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z / canvas.width})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw trails
        ctx.strokeStyle = `rgba(100, 200, 255, ${0.5 * (1 - star.z / canvas.width)})`;
        ctx.lineWidth = size / 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + (star.x / star.z) * 5,
          y + (star.y / star.z) * 5
        );
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-6 border border-cyan-500/30">
          <span className="text-cyan-400 text-sm">Starfield</span>
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="ghost"
            className="text-cyan-400 hover:bg-cyan-400/20"
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
        className="fixed top-24 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-4xl font-bold text-cyan-400/20">Starfield</h1>
        <p className="text-cyan-400/10 mt-2">Immersive space experience • Press F for fullscreen</p>
      </motion.div>
    </div>
  );
}
