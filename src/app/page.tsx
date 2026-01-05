"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<"chesscom" | "lichess">("chesscom");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);
    setError("");

    // Navigate to the wrapped experience
    router.push(`/wrapped/${platform}/${username.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pulse-glow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <span className="font-[var(--font-syncopate)] text-sm tracking-[0.3em] text-white/60 uppercase">
            Chessiro
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-[var(--font-syncopate)] text-5xl md:text-7xl font-bold mb-6 text-gradient"
        >
          CAPSULE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl md:text-2xl text-white/70 mb-12 font-[var(--font-syne)]"
        >
          Your chess year, beautifully wrapped
        </motion.p>

        {/* Platform Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-2 mb-6 p-1 bg-white/5 rounded-full"
        >
          <button
            onClick={() => setPlatform("chesscom")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              platform === "chesscom"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Chess.com
          </button>
          <button
            onClick={() => setPlatform("lichess")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              platform === "lichess"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Lichess
          </button>
        </motion.div>

        {/* Username Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md"
        >
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 text-lg font-[var(--font-syne)] focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading
                </span>
              ) : (
                "Unwrap"
              )}
            </button>
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-3"
            >
              {error}
            </motion.p>
          )}
        </motion.form>

        {/* Example usernames */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 text-white/40 text-sm"
        >
          <span>Try: </span>
          <button
            onClick={() => setUsername("hikaru")}
            className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
          >
            hikaru
          </button>
          <span>, </span>
          <button
            onClick={() => setUsername("magnuscarlsen")}
            className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
          >
            magnuscarlsen
          </button>
          <span>, </span>
          <button
            onClick={() => setUsername("gothamchess")}
            className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
          >
            gothamchess
          </button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 text-white/30 text-sm"
      >
        Made with love for chess enthusiasts
      </motion.footer>
    </div>
  );
}
