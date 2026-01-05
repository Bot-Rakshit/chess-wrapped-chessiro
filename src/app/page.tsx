"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const loadingMessages = [
  "Analyzing your games...",
  "Counting checkmates...",
  "Tracking your streaks...",
  "Mapping your journey...",
  "Calculating ratings...",
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<"chesscom" | "lichess">("chesscom");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    const oauth = searchParams.get("oauth");

    if (urlUsername) {
      setUsername(urlUsername);
      if (oauth) {
        setPlatform("lichess");
        router.push(`/wrapped/lichess/${urlUsername}?oauth=${encodeURIComponent(oauth)}`);
      } else {
        router.push(`/wrapped/chesscom/${urlUsername}`);
      }
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
    
    if (platform === "lichess") {
      router.push(`/wrapped/lichess/${username.trim()}`);
    } else {
      router.push(`/wrapped/chesscom/${username.trim()}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#0a0908] font-[var(--font-syne)] text-white overflow-hidden">
      
      {/* Deep Background Layers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Layer 1 - Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0908] via-[#0d0b09] to-[#0f0c0a]" />
        
        {/* Layer 2 - Animated amber orbs */}
        <motion.div
          className="absolute top-[-50%] left-[-40%] w-[120vw] h-[120vw] rounded-full blur-[180px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(194, 155, 95, 0.4) 0%, rgba(139, 90, 43, 0.2) 40%, transparent 70%)" }}
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-50%] right-[-40%] w-[120vw] h-[120vw] rounded-full blur-[180px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(168, 120, 70, 0.35) 0%, rgba(120, 85, 50, 0.2) 40%, transparent 70%)" }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        
        {/* Layer 3 - Subtle accent glow */}
        <motion.div
          className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(194, 155, 95, 0.5) 0%, transparent 70%)" }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Layer 4 - Vignette effect */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
        }} />
        
        {/* Layer 5 - Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
        
        {/* Layer 6 - Floating particles */}
        <AnimatePresence>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? "rgba(194, 155, 95, 0.3)" : i % 3 === 1 ? "rgba(168, 120, 70, 0.25)" : "rgba(139, 90, 43, 0.2)",
                boxShadow: i % 3 === 0 ? "0 0 6px rgba(194, 155, 95, 0.3)" : "none"
              }}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{ 
                y: [null, Math.random() * -200 - 100],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center w-full max-w-md px-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-10"
        >
          {/* Capsule 2025 Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center justify-center w-full mb-6"
          >
            <Image
              src="/capsule-2025.png"
              alt="Capsule 2025"
              width={320}
              height={90}
              className="w-full max-w-[280px] h-auto"
              priority
            />
          </motion.div>
          
          <h1 className="text-3xl font-bold font-[var(--font-syncopate)] tracking-tight text-[#c2b59b] mb-1">
            CHESSIRO
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#8b7d6b] text-xs font-[var(--font-syne)] tracking-[0.3em] uppercase"
          >
            Chess Wrapped
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          className="w-full rounded-2xl p-6"
          style={{
            background: "linear-gradient(145deg, rgba(20, 16, 12, 0.95) 0%, rgba(12, 10, 8, 0.98) 100%)",
            border: "1px solid rgba(139, 115, 85, 0.12)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 115, 85, 0.08) inset, 0 0 40px rgba(139, 90, 43, 0.05)"
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Platform Toggle */}
            <div 
              className="grid grid-cols-2 rounded-xl p-0.5"
              style={{ background: "rgba(139, 115, 85, 0.08)" }}
            >
              {["chesscom", "lichess"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p as "chesscom" | "lichess")}
                  className={`relative py-3 rounded-lg text-xs font-[var(--font-syncopate)] tracking-wider transition-all duration-300 ${
                    platform === p 
                      ? "text-white" 
                      : "text-[#6a5a4a] hover:text-[#a89078]"
                  }`}
                  style={platform === p ? { background: "rgba(139, 115, 85, 0.25)" } : {}}
                >
                  {p === "chesscom" ? "Chess.com" : "Lichess"}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Player name"
                className="w-full rounded-lg py-3.5 px-4 text-center text-sm font-[var(--font-syncopate)] placeholder:text-[#4a3a2a] text-[#e8dcc8] focus:outline-none transition-all uppercase tracking-wider"
                style={{ 
                  background: "rgba(139, 115, 85, 0.06)",
                  border: "1px solid rgba(139, 115, 85, 0.1)"
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(194, 155, 95, 0.35)";
                  e.target.style.background = "rgba(139, 115, 85, 0.1)";
                  e.target.style.boxShadow = "0 0 20px rgba(194, 155, 95, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(139, 115, 85, 0.1)";
                  e.target.style.background = "rgba(139, 115, 85, 0.06)";
                  e.target.style.boxShadow = "none";
                }}
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-lg font-[var(--font-syncopate)] font-bold text-xs tracking-[0.2em] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: "linear-gradient(135deg, #c2a05d 0%, #a88b4a 50%, #c2a05d 100%)",
                  backgroundSize: "200% 200%",
                  color: "#0a0908"
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-[#0a0908]/30 border-t-[#0a0908] rounded-full"
                    />
                    GENERATING...
                  </span>
                ) : (
                  "GENERATE CAPSULE"
                )}
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "rgba(139, 60, 60, 0.08)", border: "1px solid rgba(139, 60, 60, 0.15)" }}
              >
                <span className="text-[#c48a6a] text-[10px] font-[var(--font-syncopate)]">{error}</span>
              </motion.div>
            )}
          </form>

          {/* Quick Examples */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(139, 115, 85, 0.1)" }}>
            <p className="text-[#5a4a3a] text-[9px] font-[var(--font-syncopate)] text-center mb-3 tracking-widest uppercase">
              Try it out
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["hikaru", "magnuscarlsen", "gothamchess"].map((name) => (
                <motion.button
                  key={name}
                  onClick={() => setUsername(name)}
                  whileHover={{ scale: 1.03, borderColor: "rgba(194, 155, 95, 0.35)", color: "#c2b59b" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-md text-[10px] font-[var(--font-syncopate)] transition-all uppercase tracking-wider"
                  style={{ 
                    color: "#7a6a5a",
                    border: "1px solid rgba(139, 115, 85, 0.15)",
                    background: "rgba(139, 115, 85, 0.03)"
                  }}
                >
                  {name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {["Detailed Statistics", "Rating Journey", "Best Openings", "Win Streaks"].map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <span className="text-[#5a4a3a] text-[10px] font-[var(--font-syne)] tracking-wide">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-0 w-full text-center"
      >
        <p className="text-[#3a2a1a] text-[8px] font-[var(--font-syncopate)] tracking-[0.5em] uppercase">
          Chessiro
        </p>
      </motion.div>
    </div>
  );
}
