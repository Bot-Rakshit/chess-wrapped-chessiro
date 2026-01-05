"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { WrappedStats } from "@/lib/types";
import { SLIDES, SLIDE_BACKGROUNDS, getCardNumberFromSlide, GallerySlide } from "@/components/wrapped/Slides";
import { ProgressBar, Confetti } from "@/components/wrapped/Effects";

// Dynamically import Three.js components to avoid SSR issues
const ThreeBackground = dynamic(
  () => import("@/components/wrapped/ThreeBackground").then(mod => mod.ThreeBackground),
  { ssr: false }
);

const ThreeLoader = dynamic(
  () => import("@/components/wrapped/ThreeBackground").then(mod => mod.ThreeLoader),
  { ssr: false }
);

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
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalSlides = SLIDES.length;

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/capsule-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    const handleCanPlay = () => setAudioReady(true);
    audioRef.current.addEventListener("canplaythrough", handleCanPlay);
    audioRef.current.load();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
      }
    };
  }, []);

  // Play audio when user interacts (to comply with autoplay policies)
  const startAudio = useCallback(() => {
    if (audioRef.current && audioReady && !isMuted) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, will play on next interaction
      });
    }
  }, [audioReady, isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
        if (!newMuted && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
      return newMuted;
    });
  }, []);

  // Auto-hide controls after 4 seconds of inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

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
    
    // Don't auto-advance on gallery slide
    if (currentSlide === totalSlides - 1) return;

    autoAdvanceRef.current = setTimeout(() => {
      if (currentSlide < totalSlides - 1) {
        setCurrentSlide(prev => prev + 1);
        // Show confetti when reaching the summary card (slide 10)
        if (currentSlide === 9) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    }, 6000);

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, [currentSlide, isPaused, stats, totalSlides, mode]);

  // Initialize controls timer
  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimer]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    resetControlsTimer();
    startAudio();
  }, [resetControlsTimer, startAudio]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    resetControlsTimer();
    startAudio();
  }, [currentSlide, totalSlides, resetControlsTimer, startAudio]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
    resetControlsTimer();
    startAudio();
  }, [currentSlide, resetControlsTimer, startAudio]);

  // Handle gallery card selection
  const handleSelectCard = useCallback((cardNumber: number) => {
    goToSlide(cardNumber);
  }, [goToSlide]);

  // Handle tap/click navigation
  const handleTap = useCallback((e: React.MouseEvent) => {
    // Don't handle taps on the gallery slide (let buttons handle it)
    if (currentSlide === totalSlides - 1) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    resetControlsTimer();
    startAudio();

    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      prevSlide();
    } else if (x > third * 2) {
      nextSlide();
    } else {
      setIsPaused(prev => !prev);
    }
  }, [nextSlide, prevSlide, resetControlsTimer, startAudio, currentSlide, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      startAudio();
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
      } else if (e.key === "m") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, router, resetControlsTimer, startAudio, toggleMute]);

  // Download current card image
  const handleDownload = async (cardNum?: number) => {
    const cardNumber = cardNum ?? getCardNumberFromSlide(currentSlide);
    if (cardNumber === null) return;
    
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
  const handleShare = async (cardNum?: number) => {
    const cardNumber = cardNum ?? getCardNumberFromSlide(currentSlide);
    if (cardNumber === null) return;
    
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
        handleDownload(cardNumber);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Determine Three.js background variant based on slide
  const getBackgroundVariant = () => {
    if (currentSlide === 0) return "intro";
    if (currentSlide === 10 || currentSlide === 11) return "celebration";
    return "journey";
  };

  // Loading state with 3D loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
        <ThreeLoader />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Chessiro Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src="/chessiro-logo.svg"
              alt="Chessiro"
              width={120}
              height={40}
              className="brightness-0 invert opacity-80"
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-base font-[var(--font-syne)]"
          >
            Preparing your capsule...
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/40 text-sm"
          >
            @{username}
          </motion.p>
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
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Oops!</h2>
          <p className="text-white/60 max-w-md text-sm">{error || "Something went wrong"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const CurrentSlideComponent = SLIDES[currentSlide];
  const bgGradient = SLIDE_BACKGROUNDS[currentSlide];
  const isGallerySlide = currentSlide === totalSlides - 1;
  const canDownload = getCardNumberFromSlide(currentSlide) !== null;

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgGradient} transition-colors duration-1000 relative overflow-hidden`}
    >
      {/* Three.js Background */}
      <ThreeBackground variant={getBackgroundVariant()} intensity={0.7} />
      
      <Confetti active={showConfetti} />

      {/* Progress bar - at the very top, no margin */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-2 pb-1 bg-gradient-to-b from-black/40 to-transparent">
        <ProgressBar
          total={totalSlides}
          current={currentSlide}
          onSegmentClick={goToSlide}
          compact={!showControls}
        />
      </div>

      {/* Header Row - Logo left, Mute right - just below progress bar */}
      <div className="fixed top-8 left-0 right-0 z-50 px-3 flex items-center justify-between">
        {/* Chessiro Logo - left, always visible */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/")}
          className="cursor-pointer"
        >
          <Image
            src="/chessiro-logo.svg"
            alt="Chessiro"
            width={70}
            height={24}
            className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
          />
        </motion.div>

        {/* Right side - Mute button */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          {/* Pause indicator */}
          {isPaused && mode === "animated" && (
            <span className="text-white/50 text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">Paused</span>
          )}
          
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-all"
            title={isMuted ? "Unmute (M)" : "Mute (M)"}
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </motion.div>
      </div>

      {/* Main content */}
      <div 
        ref={containerRef}
        onClick={handleTap}
        className="w-full max-w-lg h-[85vh] relative cursor-pointer will-change-transform z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.98, rotateY: -5 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.02, rotateY: 5 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full will-change-transform"
            style={{ perspective: 1000 }}
          >
            {isGallerySlide ? (
              <GallerySlide 
                stats={stats} 
                isActive={true} 
                onSelectCard={handleSelectCard}
                username={username}
              />
            ) : (
              <CurrentSlideComponent stats={stats} isActive={true} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Touch zones indicator (shows briefly on first load) */}
        {!isGallerySlide && (
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute inset-0 pointer-events-none flex"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-white/20 text-xs">Tap to pause</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Bar - More visible download/share buttons + mute */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-0 right-0 flex justify-center items-center gap-3 z-50 px-4"
          >
            {/* Mute button - left side */}
            <button
              onClick={toggleMute}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white transition-all"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            {/* Download & Share buttons - center, more prominent */}
            {canDownload && (
              <>
                <button
                  onClick={() => handleDownload()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-white font-medium transition-all border border-white/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={() => handleShare()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm">Share</span>
                </button>
              </>
            )}

            {/* Gallery button if not on gallery slide */}
            {!isGallerySlide && currentSlide > 0 && (
              <button
                onClick={() => goToSlide(totalSlides - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white transition-all"
                title="View All Cards"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hints - only on desktop */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 0.3 : 0 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 text-white/30 text-[10px] z-40 hidden md:block"
      >
        ← → navigate • Space advance • P pause • M mute
      </motion.p>
    </div>
  );
}
