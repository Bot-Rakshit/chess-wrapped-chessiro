"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    router.push(`/wrapped/${platform}/${username.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-black font-[var(--font-syne)]">
      {/* Colored ambient glows - Responsive sizing */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[500px] h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] max-w-[300px] h-[300px] bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[50vw] max-w-[250px] h-[250px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Chessiro Logo - Top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 sm:top-12"
      >
        <Image
          src="/chessiro-logo.svg"
          alt="Chessiro"
          width={80}
          height={28}
          className="w-[60px] sm:w-[80px]"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-md"
      >
        {/* Year + Chess + Capsule Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {/* 2025 CHESS */}
          <div className="flex items-center gap-3">
            <span className="text-cyan-400/80 text-xs sm:text-sm tracking-[0.3em] font-medium font-[var(--font-syncopate)]">2025</span>
            <span className="text-white/20">·</span>
            <span className="text-white/50 text-xs sm:text-sm tracking-[0.3em] font-light font-[var(--font-syncopate)]">CHESS</span>
          </div>
          
          {/* Capsule SVG */}
          <div className="w-[220px] sm:w-[280px]">
            <Image
              src="/capsule-logo.svg"
              alt="Capsule"
              width={280}
              height={80}
              className="brightness-0 invert w-full h-auto"
              priority
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/60 text-sm sm:text-base mb-8 sm:mb-10 tracking-wide max-w-[280px] sm:max-w-none mx-auto leading-relaxed"
        >
          Your year in chess, <span className="text-amber-400/80 font-medium">10 shareable cards</span>
        </motion.p>

        {/* Platform Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-1 mb-6 sm:mb-8 p-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        >
          <button
            onClick={() => setPlatform("chesscom")}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base transition-all duration-300 ${
              platform === "chesscom"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/20 scale-105"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            Chess.com
          </button>
          <button
            onClick={() => setPlatform("lichess")}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base transition-all duration-300 ${
              platform === "lichess"
                ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium shadow-lg shadow-purple-500/20 scale-105"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            Lichess
          </button>
        </motion.div>

        {/* Username Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onSubmit={handleSubmit}
          className="w-full max-w-[320px]"
        >
          <div className="relative group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="w-full px-6 py-4 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-white/30 text-center text-lg focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-cyan-500/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generatin...</span>
              </span>
            ) : (
              "Generate Capsule"
            )}
          </button>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 overflow-hidden"
            >
              <p className="text-red-400/90 text-sm bg-red-500/10 py-2 px-4 rounded-lg inline-block border border-red-500/20">
                {error}
              </p>
            </motion.div>
          )}
        </motion.form>

        {/* Quick try */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 sm:mt-12 text-white/30 text-sm flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-widest opacity-50">Or try these legends</span>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {["hikaru", "magnuscarlsen", "gothamchess"].map((name) => (
              <button
                key={name}
                onClick={() => setUsername(name)}
                className="px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 text-white/10 text-xs tracking-widest font-[var(--font-syncopate)]"
      >
        CHESSIRO.COM
      </motion.p>
    </div>
  );
}
