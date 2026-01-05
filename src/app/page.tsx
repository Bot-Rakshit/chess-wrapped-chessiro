"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    }, 2000);
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#0a0a0a] font-[var(--font-syne)] text-white overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-30%] left-[-20%] w-[80vw] h-[80vw] bg-[#1a1a1a]/50 rounded-full blur-[200px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] right-[-20%] w-[80vw] h-[80vw] bg-[#1a1a1a]/50 rounded-full blur-[200px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
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
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          {/* Capsule 2025 Badge in Black Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-48 h-16 bg-[#111] border border-[#222] rounded-xl mb-6 shadow-2xl"
          >
            <Image
              src="/capsule-2025.png"
              alt="Capsule 2025"
              width={160}
              height={45}
              className="w-40 h-auto"
              priority
            />
          </motion.div>
          
          <h1 className="text-3xl font-bold font-[var(--font-syncopate)] tracking-tight text-white mb-1">
            CHESSIRO
          </h1>
          
          <p className="text-white/30 text-xs font-[var(--font-syne)] tracking-[0.2em] uppercase">
            Chess Wrapped
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full bg-[#111] border border-[#222] rounded-2xl p-6"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Platform Toggle */}
            <div className="grid grid-cols-2 bg-[#0a0a0a] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setPlatform("chesscom")}
                className={`relative py-3 rounded-lg text-xs font-[var(--font-syncopate)] tracking-wider transition-all duration-300 ${
                  platform === "chesscom" 
                    ? "text-white bg-[#1a1a1a] shadow-sm" 
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                Chess.com
              </button>
              <button
                type="button"
                onClick={() => setPlatform("lichess")}
                className={`relative py-3 rounded-lg text-xs font-[var(--font-syncopate)] tracking-wider transition-all duration-300 ${
                  platform === "lichess" 
                    ? "text-white bg-[#1a1a1a] shadow-sm" 
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                Lichess
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Player name"
                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg py-3.5 px-4 text-center text-sm font-[var(--font-syncopate)] placeholder:text-white/15 text-white/80 focus:outline-none focus:border-[#333] focus:bg-[#0a0a0a] transition-all uppercase tracking-wider"
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-white text-black rounded-lg font-[var(--font-syncopate)] font-bold text-xs tracking-[0.15em] hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate Capsule"}
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg"
              >
                <span className="text-white/30 text-[10px] font-[var(--font-syncopate)]">{error}</span>
              </motion.div>
            )}
          </form>

          {/* Quick Examples */}
          <div className="mt-6 pt-5 border-t border-[#222]">
            <p className="text-white/20 text-[9px] font-[var(--font-syncopate)] text-center mb-3 tracking-widest uppercase">
              Try it out
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["hikaru", "magnuscarlsen", "gothamchess"].map((name) => (
                <motion.button
                  key={name}
                  onClick={() => setUsername(name)}
                  whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-md border border-[#222] bg-[#0a0a0a] text-[10px] text-white/30 hover:text-white/60 hover:border-[#333] font-[var(--font-syncopate)] transition-all uppercase tracking-wider"
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
          className="mt-12 flex flex-wrap justify-center gap-8"
        >
          {["Detailed Statistics", "Rating Journey", "Best Openings", "Win Streaks"].map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <span className="text-white/25 text-[10px] font-[var(--font-syne)] tracking-wide">{feature}</span>
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
        <p className="text-white/10 text-[8px] font-[var(--font-syncopate)] tracking-[0.4em] uppercase">
          Chessiro
        </p>
      </motion.div>
    </div>
  );
}
