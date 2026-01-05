"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const loadingMessages = [
  "Analyzing games...",
  "Counting mates...",
  "Tracking streaks...",
  "Mapping journey...",
  "Calculating ratings...",
];

function HomeContent() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const urlUsername = searchParams.get("username");
    if (urlUsername) {
      router.push(`/wrapped/chesscom/${urlUsername}`);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);
    setError("");
    router.push(`/wrapped/chesscom/${username.trim()}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#0a0908] font-[var(--font-syne)] text-white overflow-hidden">
      
      {/* Simplified Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0908] via-[#0d0b09] to-[#0f0c0a]" />
        
        {/* Subtle Ambient Glow */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[200px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(194, 155, 95, 0.3) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[200px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(168, 120, 70, 0.25) 0%, transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Very subtle noise */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center w-full max-w-md px-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold font-[var(--font-syncopate)] tracking-tighter text-[#e8dcc8] mb-1">
            CHESSIRO
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#8b7d6b] text-sm font-[var(--font-syne)] tracking-widest uppercase mb-6"
          >
            Presents
          </motion.p>
          {/* Capsule 2025 Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="flex items-center justify-center w-full mb-8"
          >
            <Image
              src="/capsule-2025.png"
              alt="Capsule 2025"
              width={280}
              height={80}
              className="w-full max-w-[240px] h-auto drop-shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Input Field */}
            <div className="relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Chess.com Username"
                className="w-full rounded-full py-4 px-6 text-center text-base font-[var(--font-syne)] placeholder:text-[#5a4a3a] text-[#e8dcc8] focus:outline-none transition-all duration-300"
                style={{ 
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(139, 115, 85, 0.2)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(194, 155, 95, 0.5)";
                  e.target.style.background = "rgba(255, 255, 255, 0.05)";
                  e.target.style.boxShadow = "0 0 30px rgba(194, 155, 95, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(139, 115, 85, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.03)";
                  e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full font-[var(--font-syncopate)] font-bold text-sm tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
              style={{ 
                background: "#e8dcc8",
                color: "#0a0908",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[#0a0908]/30 border-t-[#0a0908] rounded-full"
                  />
                  <span>PROCESSING</span>
                </span>
              ) : (
                "GENERATE"
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <span className="text-red-400/80 text-xs font-[var(--font-syne)] tracking-wide">{error}</span>
              </motion.div>
            )}
          </form>

          {/* Clean Suggestions */}
          <div className="mt-12">
            <p className="text-[#4a3a2a] text-[10px] font-[var(--font-syne)] text-center mb-4 uppercase tracking-widest opacity-60">
              Popular Players
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["hikaru", "magnuscarlsen", "gothamchess"].map((name) => (
                <button
                  key={name}
                  onClick={() => setUsername(name)}
                  className="px-4 py-2 rounded-full text-xs font-[var(--font-syne)] transition-all duration-300 hover:text-[#e8dcc8] hover:bg-white/5"
                  style={{ 
                    color: "#8b7d6b",
                    border: "1px solid rgba(139, 115, 85, 0.15)",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Minimal Footer */}
      <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none">
        <p className="text-[#3a2a1a] text-[9px] font-[var(--font-syncopate)] tracking-[0.4em] uppercase opacity-40">
          Chessiro
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0908]">
        <div className="w-8 h-8 border-2 border-[#e8dcc8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
