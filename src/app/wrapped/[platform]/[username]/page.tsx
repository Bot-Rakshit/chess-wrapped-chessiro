"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { WrappedStats } from "@/lib/types";
import { SLIDES, SLIDE_BACKGROUNDS, getCardNumberFromSlide } from "@/components/wrapped/Slides";
import { ProgressBar, Confetti } from "@/components/wrapped/Effects";

export default function WrappedPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params.platform as string;
  const username = params.username as string;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mode, setMode] = useState<"animated" | "static">("animated");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = SLIDES.length;

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/wrapped/${username}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to load stats");
        }
        const data = await response.json();
        setStats(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load wrapped");
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || !stats || mode !== "animated") return;

    autoAdvanceRef.current = setTimeout(() => {
      if (currentSlide < totalSlides - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Show confetti on last slide
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 6000); // 6 seconds per slide

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, [currentSlide, isPaused, stats, totalSlides, mode]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  // Handle tap/click navigation
  const handleTap = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      prevSlide();
    } else if (x > third * 2) {
      nextSlide();
    } else {
      // Middle third - pause/unpause
      setIsPaused(prev => !prev);
    }
  }, [nextSlide, prevSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        router.push("/");
      } else if (e.key === "p") {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, router]);

  // Download current card image
  const handleDownload = async () => {
    const cardNumber = getCardNumberFromSlide(currentSlide);
    if (cardNumber === null) {
      // Intro slide - download card 1 or show message
      alert("This is the intro slide. Navigate to a card to download.");
      return;
    }
    
    try {
      const response = await fetch(`/api/wrapped/${username}/image/${cardNumber}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chess-wrapped-card-${cardNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Share functionality
  const handleShare = async () => {
    const cardNumber = getCardNumberFromSlide(currentSlide);
    if (cardNumber === null) {
      alert("This is the intro slide. Navigate to a card to share.");
      return;
    }
    
    try {
      const response = await fetch(`/api/wrapped/${username}/image/${cardNumber}`);
      const blob = await response.blob();
      const file = new File([blob], `chess-wrapped-card-${cardNumber}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Chess Wrapped`,
          text: `Check out my chess stats! #ChessWrapped`,
        });
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-white/60 text-lg font-[var(--font-syne)]">
            Loading your chess journey...
          </p>
          <p className="text-white/40 text-sm">@{username}</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Oops!</h2>
          <p className="text-white/60 max-w-md">{error || "Something went wrong"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const CurrentSlideComponent = SLIDES[currentSlide];
  const bgGradient = SLIDE_BACKGROUNDS[currentSlide];

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgGradient} transition-colors duration-1000`}
    >
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          {/* Mode toggle */}
          <button
            onClick={() => setMode(mode === "animated" ? "static" : "animated")}
            className="px-3 py-1.5 bg-white/10 rounded-full text-white/70 text-sm hover:bg-white/20 transition-colors"
          >
            {mode === "animated" ? "View Cards" : "View Story"}
          </button>

          {/* Pause indicator */}
          {isPaused && mode === "animated" && (
            <span className="text-white/50 text-sm">Paused</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-50 flex justify-center">
        <ProgressBar
          total={totalSlides}
          current={currentSlide}
          onSegmentClick={goToSlide}
        />
      </div>

      {/* Main content */}
      <div 
        ref={containerRef}
        onClick={handleTap}
        className="w-full max-w-lg h-[80vh] relative cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <CurrentSlideComponent stats={stats} isActive={true} />
          </motion.div>
        </AnimatePresence>

        {/* Touch zones indicator (shows briefly on first load) */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute inset-0 pointer-events-none flex"
        >
          <div className="flex-1 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/20 text-sm">Tap to pause</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom actions - hide on intro slide */}
      {currentSlide > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 z-50"
        >
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-[var(--font-syne)] transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full font-[var(--font-syne)] font-semibold hover:bg-white/90 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </motion.div>
      )}

      {/* Keyboard hints */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="fixed bottom-20 text-white/30 text-xs z-40 hidden md:block"
      >
        ← → to navigate • Space to advance • P to pause
      </motion.p>
    </div>
  );
}
