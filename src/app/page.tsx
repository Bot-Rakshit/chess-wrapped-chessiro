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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black">
      {/* Colored ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Chessiro Logo - Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6"
      >
        <Image
          src="/chessiro-logo.svg"
          alt="Chessiro"
          width={70}
          height={24}
          className="brightness-0 invert opacity-50"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Year + Chess + Capsule Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-4 mb-10"
        >
          {/* 2025 CHESS */}
          <div className="flex items-center gap-3">
            <span className="text-cyan-400/70 text-sm tracking-[0.3em] font-medium">2025</span>
            <span className="text-white/20">·</span>
            <span className="text-white/50 text-sm tracking-[0.3em] font-light">CHESS</span>
          </div>
          
          {/* Capsule SVG */}
          <Image
            src="/capsule-logo.svg"
            alt="Capsule"
            width={260}
            height={75}
            className="brightness-0 invert"
            priority
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/40 text-sm mb-10 tracking-wide"
        >
          Your year in chess, <span className="text-amber-400/70">10 shareable cards</span>
        </motion.p>

        {/* Platform Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-1 mb-5 p-1 rounded-full border border-white/10 bg-white/[0.02]"
        >
          <button
            onClick={() => setPlatform("chesscom")}
            className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
              platform === "chesscom"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/20"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Chess.com
          </button>
          <button
            onClick={() => setPlatform("lichess")}
            className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
              platform === "lichess"
                ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium shadow-lg shadow-purple-500/20"
                : "text-white/40 hover:text-white/70"
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
          className="w-full max-w-xs"
        >
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-5 py-3 bg-white/[0.03] border border-white/10 rounded-full text-white placeholder-white/30 text-center focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium text-sm hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              "Generate Capsule"
            )}
          </button>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400/80 text-xs mt-3"
            >
              {error}
            </motion.p>
          )}
        </motion.form>

        {/* Quick try */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-white/30 text-xs"
        >
          {["hikaru", "magnuscarlsen", "gothamchess"].map((name, i) => (
            <span key={name}>
              {i > 0 && <span className="mx-2 text-white/15">·</span>}
              <button
                onClick={() => setUsername(name)}
                className="hover:text-cyan-400/70 transition-colors"
              >
                {name}
              </button>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 text-white/15 text-xs"
      >
        chessiro.com
      </motion.p>
    </div>
  );
}
