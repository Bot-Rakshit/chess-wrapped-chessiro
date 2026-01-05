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
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-black font-[var(--font-syne)] text-white overflow-hidden p-4">
      
      {/* Background Ambience - Static & Subtle */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] opacity-30 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[120px] opacity-30 mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center w-full max-w-4xl"
      >
        {/* Main Hero Content - Compact & Centered */}
        <div className="flex flex-col items-center gap-6 w-full">
          
          {/* Title Section */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[var(--font-syncopate)] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              CHESSIRO
            </h1>
          </div>
          
          {/* Visual Centerpiece - Static */}
          <div className="relative w-full max-w-[300px] flex items-center justify-center my-4">
            {/* 2025 Graphic Badge */}
            <div className="w-[180px] md:w-[200px]">
              <Image
                src="/capsule-2025.png"
                alt="Capsule 2025"
                width={200}
                height={60}
                className="w-full h-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          {/* Interaction Zone */}
          <div className="w-full max-w-[360px] backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Platform Toggle */}
              <div className="grid grid-cols-2 p-1 bg-black/40 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPlatform("chesscom")}
                  className={`py-2 rounded-md text-xs font-[var(--font-syncopate)] tracking-wider transition-all duration-300 ${
                    platform === "chesscom" 
                      ? "bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white shadow-lg" 
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  CHESS.COM
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("lichess")}
                  className={`py-2 rounded-md text-xs font-[var(--font-syncopate)] tracking-wider transition-all duration-300 ${
                    platform === "lichess" 
                      ? "bg-gradient-to-r from-gray-100/80 to-white/80 text-black shadow-lg" 
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  LICHESS
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ENTER USERNAME"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-center text-base font-[var(--font-syncopate)] placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all uppercase"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-[var(--font-syncopate)] font-bold text-xs tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  {isLoading ? "GENERATING..." : "GENERATE CAPSULE"}
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-[10px] text-center font-[var(--font-syncopate)] bg-red-500/10 py-1.5 rounded">
                  {error}
                </p>
              )}
            </form>

            {/* Legends */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["hikaru", "magnuscarlsen", "gothamchess"].map((name) => (
                <button
                  key={name}
                  onClick={() => setUsername(name)}
                  className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[9px] text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 uppercase tracking-wider font-[var(--font-syncopate)] transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center">
         <p className="text-white/10 text-[9px] tracking-[0.4em] font-[var(--font-syncopate)]">
            CREATED BY CHESSIRO
         </p>
      </div>
    </div>
  );
}
