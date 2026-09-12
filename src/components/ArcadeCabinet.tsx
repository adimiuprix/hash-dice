import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface ArcadeCabinetProps {
  reels: [number, number, number, number];
  isRolling: boolean;
  themeMode: ThemeMode;
  lastWon?: boolean;
}

export const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({
  reels,
  isRolling,
  themeMode,
  lastWon,
}) => {
  return (
    <div
      id="arcade-stage-container"
      className="relative w-full max-w-[620px] aspect-[1.12/1] min-h-[480px] bg-gradient-to-b from-[#191928] via-[#151522] to-[#0f0f18] rounded-[28px] border border-[#26283e] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center select-none"
    >
      {/* Starfield / cosmic dots background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[12%] left-[8%] w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
        <div className="absolute top-[22%] left-[22%] w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute top-[38%] left-[6%] w-1 h-1 bg-cyan-300/60 rounded-full" />
        <div className="absolute top-[8%] left-[45%] w-1 h-1 bg-white/30 rounded-full" />
        <div className="absolute top-[14%] right-[22%] w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
        <div className="absolute top-[28%] right-[10%] w-1 h-1 bg-cyan-200/50 rounded-full" />
        <div className="absolute top-[42%] right-[14%] w-1 h-1 bg-white/30 rounded-full" />
        <div className="absolute top-[6%] right-[38%] w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute bottom-[28%] left-[12%] w-1 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Floating Derpy Moon (Top Left) */}
      {themeMode === 'meme' && (
        <motion.div
          id="meme-moon"
          animate={{
            y: [0, -6, 0],
            rotate: [0, -2, 0, 2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[14%] left-[6%] sm:left-[8%] z-10 w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Moon Body */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="#a4afbf"
              stroke="#1a1e27"
              strokeWidth="4.5"
            />
            {/* Moon Craters */}
            <ellipse cx="25" cy="30" rx="6" ry="5" fill="#8896a8" opacity="0.8" />
            <ellipse cx="78" cy="35" rx="5" ry="4" fill="#8896a8" opacity="0.7" />
            <ellipse cx="32" cy="72" rx="7" ry="5.5" fill="#8896a8" opacity="0.8" />
            <ellipse cx="70" cy="68" rx="5" ry="4" fill="#8896a8" opacity="0.7" />
            <ellipse cx="20" cy="52" rx="4" ry="3" fill="#8896a8" opacity="0.6" />

            {/* Left Eye */}
            <ellipse cx="40" cy="36" rx="7.5" ry="9" fill="#ffffff" stroke="#1a1e27" strokeWidth="3" />
            <ellipse cx="43" cy="36" rx="4" ry="4.5" fill="#1a1e27" />
            <ellipse cx="44.5" cy="34" rx="1.5" ry="1.5" fill="#ffffff" />
            {/* Left Eyebrow */}
            <path d="M33 24 Q41 21 48 24" stroke="#1a1e27" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Right Eye */}
            <ellipse cx="64" cy="36" rx="7.5" ry="9" fill="#ffffff" stroke="#1a1e27" strokeWidth="3" />
            <ellipse cx="67" cy="36" rx="4" ry="4.5" fill="#1a1e27" />
            <ellipse cx="68.5" cy="34" rx="1.5" ry="1.5" fill="#ffffff" />
            {/* Right Eyebrow */}
            <path d="M57 24 Q65 21 72 24" stroke="#1a1e27" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Smile Mouth with Tongue */}
            <path
              d="M36 50 Q52 64 68 50"
              stroke="#1a1e27"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="#1a1e27"
            />
            {/* Tongue */}
            <path
              d="M48 55 C46 64, 48 72, 57 71 C64 70, 62 61, 58 54 Z"
              fill="#f43f5e"
              stroke="#1a1e27"
              strokeWidth="2.5"
            />
            <path d="M53 57 L54 66" stroke="#be123c" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}

      {/* Main Arcade Slot Machine Cabinet */}
      <div
        id="arcade-machine-cabinet"
        className="relative w-[340px] sm:w-[380px] h-[400px] sm:h-[430px] rounded-[32px] bg-[#532f35] border-[6px] border-[#1d1013] shadow-[0_16px_36px_rgba(0,0,0,0.8),inset_0_4px_12px_rgba(255,255,255,0.08)] flex flex-col items-center justify-start pt-5 px-5 z-10"
      >
        {/* Top Marquee Display Box: HASH DICE */}
        <div
          id="cabinet-marquee-screen"
          className="relative w-[210px] sm:w-[230px] h-[100px] sm:h-[110px] bg-[#122333] rounded-[18px] border-[3.5px] border-[#119db6] shadow-[0_0_24px_rgba(17,157,182,0.45),inset_0_0_15px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle screen scanline reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

          {/* Marquee Glowing Text: HASH DICE */}
          <h1
            className="font-arcade text-[#4fe1fa] text-[34px] sm:text-[38px] leading-[0.9] tracking-[0.04em] text-center drop-shadow-[0_0_12px_rgba(79,225,250,0.85)] select-none m-0 [text-shadow:0_0_10px_#38bdf8,0_0_20px_#0284c7]"
          >
            HASH<br />DICE
          </h1>
        </div>

        {/* Right side controls panel on the cabinet */}
        <div className="absolute right-4 sm:right-5 top-8 flex flex-col items-center gap-3">
          {/* Coin insert slot */}
          <div className="w-8 h-4 rounded-md bg-[#0f151c] border-2 border-[#119db6] flex items-center justify-center shadow-[0_0_8px_rgba(17,157,182,0.4)]">
            <div className="w-4 h-1 bg-black rounded-sm" />
          </div>

          {/* 4 Colored indicator pills/buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="w-6 h-2.5 rounded-full bg-[#2563eb] border border-[#1d4ed8] shadow-[0_0_6px_rgba(37,99,235,0.7)]" />
            <div className="w-6 h-2.5 rounded-full bg-[#f97316] border border-[#ea580c] shadow-[0_0_6px_rgba(249,115,22,0.7)]" />
            <div className="w-6 h-2.5 rounded-full bg-[#06b6d4] border border-[#0891b2] shadow-[0_0_6px_rgba(6,182,212,0.7)]" />
            <div className="w-6 h-2.5 rounded-full bg-[#334155] border border-[#1e293b]" />
          </div>
        </div>

        {/* Reels Frame (The 4-digit roller tumbler window) */}
        <div
          id="cabinet-reels-window"
          className="relative mt-5 sm:mt-6 w-[250px] sm:w-[275px] h-[86px] sm:h-[94px] bg-[#11141b] rounded-[16px] border-[4px] border-[#222733] shadow-[inset_0_8px_16px_rgba(0,0,0,0.9),0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center px-2 py-2 overflow-hidden"
        >
          {/* Grid of 4 tumbler cylinders */}
          <div className="w-full h-full grid grid-cols-4 gap-2 items-center">
            {reels.map((digit, idx) => (
              <div
                key={idx}
                id={`reel-cylinder-${idx}`}
                className="relative h-full rounded-[10px] overflow-hidden flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.5)] border border-[#1e232e] bg-[linear-gradient(180deg,#101318_0%,#202734_22%,#556379_50%,#202734_78%,#101318_100%)]"
              >
                {/* 3D cylindrical lighting overlays */}
                <div className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

                {/* Number digit */}
                <motion.div
                  key={isRolling ? `rolling-${idx}-${Date.now()}` : `static-${idx}-${digit}`}
                  animate={
                    isRolling
                      ? {
                          y: [0, -70, -140, -210, 0],
                        }
                      : {
                          y: [lastWon ? -4 : 0, 0],
                        }
                  }
                  transition={
                    isRolling
                      ? {
                          repeat: Infinity,
                          duration: 0.18 + idx * 0.04,
                          ease: 'linear',
                        }
                      : { duration: 0.15 }
                  }
                  className="relative font-bold text-white text-[32px] sm:text-[38px] tracking-normal select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {digit}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Lower slot / coin return mouth */}
        <div
          id="cabinet-dispenser-mouth"
          className="mt-5 w-[190px] sm:w-[210px] h-[36px] sm:h-[40px] bg-[#10141c] rounded-[14px] border-[3px] border-[#109cb3] shadow-[0_0_14px_rgba(16,156,179,0.35),inset_0_4px_8px_rgba(0,0,0,0.8)]"
        />
      </div>

      {/* Stack of Gold Coins (Bottom Left) */}
      {themeMode === 'meme' && (
        <div
          id="meme-gold-coins"
          className="absolute left-3 sm:left-6 bottom-2 z-20 w-[110px] sm:w-[130px] h-[95px] sm:h-[110px] pointer-events-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
        >
          <svg viewBox="0 0 140 120" className="w-full h-full overflow-visible">
            {/* Left stack */}
            {/* Coin 1 */}
            <ellipse cx="40" cy="100" rx="28" ry="10" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="40" cy="95" rx="28" ry="10" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="40" cy="95" rx="24" ry="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Coin 2 */}
            <ellipse cx="38" cy="85" rx="28" ry="10" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="38" cy="80" rx="28" ry="10" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="38" cy="80" rx="24" ry="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Coin 3 */}
            <ellipse cx="42" cy="70" rx="28" ry="10" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="42" cy="65" rx="28" ry="10" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="42" cy="65" rx="24" ry="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Coin 4 */}
            <ellipse cx="40" cy="55" rx="28" ry="10" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="40" cy="50" rx="28" ry="10" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="40" cy="50" rx="24" ry="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Right overlapping stack */}
            {/* Coin R1 */}
            <ellipse cx="85" cy="102" rx="26" ry="9.5" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="85" cy="97" rx="26" ry="9.5" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="85" cy="97" rx="22" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Coin R2 */}
            <ellipse cx="86" cy="88" rx="26" ry="9.5" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="86" cy="83" rx="26" ry="9.5" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="86" cy="83" rx="22" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Coin R3 */}
            <ellipse cx="88" cy="74" rx="26" ry="9.5" fill="#ca8a04" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="88" cy="69" rx="26" ry="9.5" fill="#eab308" stroke="#1c1917" strokeWidth="3" />
            <ellipse cx="88" cy="69" rx="22" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Fallen coin resting in front */}
            <ellipse cx="106" cy="90" rx="18" ry="8" fill="#ca8a04" stroke="#1c1917" strokeWidth="2.5" />
            <ellipse cx="106" cy="86" rx="18" ry="8" fill="#facc15" stroke="#1c1917" strokeWidth="2.5" />
          </svg>
        </div>
      )}

      {/* Toilet Paper Rolls (Bottom Center) */}
      {themeMode === 'meme' && (
        <div
          id="meme-toilet-paper"
          className="absolute left-[34%] sm:left-[35%] bottom-2 z-20 w-[95px] sm:w-[110px] h-[55px] sm:h-[62px] pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
        >
          <svg viewBox="0 0 120 70" className="w-full h-full overflow-visible">
            {/* Roll 1 (Left) */}
            <path
              d="M10 32 C10 22, 35 22, 35 32 L35 55 C35 63, 10 63, 10 55 Z"
              fill="#e2e8f0"
              stroke="#1e293b"
              strokeWidth="2.8"
            />
            <ellipse cx="22.5" cy="32" rx="12.5" ry="5.5" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.8" />
            <ellipse cx="22.5" cy="32" rx="4.5" ry="2.2" fill="#64748b" />

            {/* Unwound paper trailing on floor */}
            <path
              d="M10 55 Q2 58 4 64 Q25 66 32 60"
              fill="#f1f5f9"
              stroke="#1e293b"
              strokeWidth="2.2"
            />

            {/* Roll 2 (Right, slightly tilted) */}
            <path
              d="M48 34 C48 24, 74 24, 74 34 L74 58 C74 66, 48 66, 48 58 Z"
              fill="#e2e8f0"
              stroke="#1e293b"
              strokeWidth="2.8"
            />
            <ellipse cx="61" cy="34" rx="13" ry="5.5" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.8" />
            <ellipse cx="61" cy="34" rx="4.5" ry="2.2" fill="#64748b" />

            {/* Trailing ribbon from Roll 2 */}
            <path
              d="M74 48 C85 52, 98 56, 102 62 C88 64, 70 63, 64 59 Z"
              fill="#f8fafc"
              stroke="#1e293b"
              strokeWidth="2.2"
            />
          </svg>
        </div>
      )}

      {/* Pepe Praying Character (Bottom Right) */}
      {themeMode === 'meme' && (
        <div
          id="meme-pepe-praying"
          className="absolute right-4 sm:right-6 bottom-1 z-20 w-[140px] sm:w-[165px] h-[190px] sm:h-[225px] pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
        >
          <svg viewBox="0 0 160 210" className="w-full h-full overflow-visible">
            {/* Toilet paper behind Pepe */}
            <g opacity="0.9">
              <path
                d="M130 145 C130 138, 150 138, 150 145 L150 165 C150 171, 130 171, 130 165 Z"
                fill="#cbd5e1"
                stroke="#1e293b"
                strokeWidth="2.5"
              />
              <ellipse cx="140" cy="145" rx="10" ry="4" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
            </g>

            {/* Frog Feet */}
            {/* Left Foot */}
            <path
              d="M48 190 C42 190, 36 198, 48 202 C58 203, 68 201, 72 192 Z"
              fill="#566276"
              stroke="#18202d"
              strokeWidth="3"
            />
            {/* Right Foot */}
            <path
              d="M80 190 C78 198, 88 204, 104 202 C116 201, 120 194, 112 188 Z"
              fill="#566276"
              stroke="#18202d"
              strokeWidth="3"
            />
            {/* Toe lines */}
            <path d="M46 198 L48 202" stroke="#18202d" strokeWidth="2.5" />
            <path d="M96 198 L98 202" stroke="#18202d" strokeWidth="2.5" />
            <path d="M106 196 L108 200" stroke="#18202d" strokeWidth="2.5" />

            {/* Grey Pants */}
            <path
              d="M44 148 L46 192 L74 192 L76 160 L84 160 L86 190 L114 188 L116 148 Z"
              fill="#434e62"
              stroke="#18202d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Navy Blue Sweater Body */}
            <path
              d="M32 94 C32 90, 48 82, 78 82 C108 82, 126 90, 126 98 L124 152 C124 154, 114 156, 78 156 C42 156, 32 154, 32 152 Z"
              fill="#1b2537"
              stroke="#18202d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Left Arm / Sleeve */}
            <path
              d="M34 98 C30 112, 38 136, 56 138 C60 138, 62 130, 52 120 C46 114, 44 104, 44 98 Z"
              fill="#1b2537"
              stroke="#18202d"
              strokeWidth="3"
            />

            {/* Right Arm / Sleeve */}
            <path
              d="M124 100 C128 116, 120 138, 102 140 C98 140, 96 132, 106 122 C112 116, 114 106, 114 100 Z"
              fill="#1b2537"
              stroke="#18202d"
              strokeWidth="3"
            />

            {/* Praying Frog Hands (Clasped in front of chest) */}
            <g id="pepe-praying-hands">
              {/* Left hand & fingers */}
              <path
                d="M66 120 C62 110, 72 96, 77 96 C80 96, 82 108, 80 120 Z"
                fill="#566276"
                stroke="#18202d"
                strokeWidth="2.8"
              />
              {/* Right hand & fingers */}
              <path
                d="M86 120 C90 110, 80 96, 75 96 C72 96, 70 108, 72 120 Z"
                fill="#566276"
                stroke="#18202d"
                strokeWidth="2.8"
              />
              {/* Finger crease lines */}
              <path d="M72 102 L74 114" stroke="#18202d" strokeWidth="2" strokeLinecap="round" />
              <path d="M78 102 L76 114" stroke="#18202d" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Pepe Head */}
            <path
              d="M24 64 C20 42, 36 22, 60 22 C72 22, 82 28, 92 24 C106 18, 126 28, 128 50 C130 68, 124 82, 108 86 C88 88, 48 88, 32 82 C25 78, 24 72, 24 64 Z"
              fill="#566276"
              stroke="#18202d"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Pepe Left Eye */}
            <ellipse cx="56" cy="42" rx="14" ry="12" fill="#ffffff" stroke="#18202d" strokeWidth="3.5" />
            {/* Left Drooping Eyelid fold */}
            <path
              d="M40 38 Q56 28 72 38"
              stroke="#18202d"
              strokeWidth="3.5"
              fill="#566276"
            />
            {/* Left Pupil (looking up-right) */}
            <ellipse cx="62" cy="42" rx="5" ry="5.5" fill="#18202d" />
            <ellipse cx="64" cy="40" rx="1.8" ry="1.8" fill="#ffffff" />
            {/* Under-eye bag */}
            <path d="M44 54 Q56 59 68 53" stroke="#18202d" strokeWidth="2.5" fill="none" />

            {/* Pepe Right Eye */}
            <ellipse cx="94" cy="42" rx="14" ry="12" fill="#ffffff" stroke="#18202d" strokeWidth="3.5" />
            {/* Right Drooping Eyelid fold */}
            <path
              d="M78 38 Q94 28 110 38"
              stroke="#18202d"
              strokeWidth="3.5"
              fill="#566276"
            />
            {/* Right Pupil (looking up-right) */}
            <ellipse cx="100" cy="42" rx="5" ry="5.5" fill="#18202d" />
            <ellipse cx="102" cy="40" rx="1.8" ry="1.8" fill="#ffffff" />
            {/* Under-eye bag */}
            <path d="M82 54 Q94 59 106 53" stroke="#18202d" strokeWidth="2.5" fill="none" />

            {/* Pepe Mouth & Lips (Subtle sad/hopeful prayer curl) */}
            <path
              d="M38 68 C48 76, 102 76, 116 66"
              stroke="#18202d"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lower lip fold */}
            <path
              d="M50 78 Q76 83 102 77"
              stroke="#18202d"
              strokeWidth="2.8"
              fill="none"
            />

            {/* Nostril dots */}
            <ellipse cx="72" cy="58" rx="1.8" ry="1.8" fill="#18202d" />
            <ellipse cx="80" cy="58" rx="1.8" ry="1.8" fill="#18202d" />
          </svg>
        </div>
      )}
    </div>
  );
};
