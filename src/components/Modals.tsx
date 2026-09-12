import React, { useState } from 'react';
import { X, Copy, Check, Shuffle, RotateCcw, Activity, Keyboard, Info } from 'lucide-react';
import { RollHistoryItem } from '../types';

interface ModalsProps {
  activeModal: 'fairness' | 'stats' | 'hotkeys' | 'rules' | null;
  onClose: () => void;
  history: RollHistoryItem[];
  currency: string;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  history,
  currency,
}) => {
  const [activeServerSeed, setActiveServerSeed] = useState(
    'b873e213910bb3af5277308bd23b733d4ac558e59d911c3cd26bdec954d389a'
  );
  const [nextServerSeed, setNextServerSeed] = useState(
    'e0196777a1110097311ba4afcb8228ffdfbd050f7f528897018c595fd0a4f32'
  );
  const [clientSeed, setClientSeed] = useState(
    'fd13d2c3be0ede5b471a4304140a87e'
  );
  const [nonceOffset, setNonceOffset] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!activeModal) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleShuffleClientSeed = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setClientSeed(result);
  };

  const handleRotateSeed = () => {
    setActiveServerSeed(nextServerSeed);
    const chars = '0123456789abcdef';
    let newNext = '';
    for (let i = 0; i < 64; i++) {
      newNext += chars[Math.floor(Math.random() * chars.length)];
    }
    setNextServerSeed(newNext);
    setNonceOffset(history.length);
  };

  const currentNonce = Math.max(0, history.length - nonceOffset);

  const totalBets = history.length;
  const wins = history.filter((h) => h.won).length;
  const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) : '0.0';
  const totalWagered = history.reduce((acc, h) => acc + h.amount, 0).toFixed(6);
  const totalProfit = history.reduce((acc, h) => acc + h.profit, 0).toFixed(6);
  const isNetPositive = parseFloat(totalProfit) >= 0;

  return (
    <div
      id="app-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="app-modal-container"
        className="relative w-full max-w-[530px] bg-[#141820] border border-[#222938] rounded-2xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button 'X' top right */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#758195] hover:text-white p-1 rounded-lg hover:bg-[#1e2533] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Provably Fair Modal - Exact 1:1 match to screenshot */}
        {activeModal === 'fairness' && (
          <div className="flex flex-col">
            {/* Title & Subtitle */}
            <h2 className="text-[22px] font-bold text-white tracking-tight leading-tight">
              Provably fair
            </h2>
            <p className="text-[14px] text-[#8e9aa9] mt-2 mb-6">
              Every roll is derived from sha512(server seed : client seed : nonce).
            </p>

            {/* Active Server Seed (Hashed) */}
            <div className="flex flex-col mb-4">
              <label className="text-[11px] font-bold text-[#677487] tracking-wider uppercase mb-2">
                Active server seed (hashed)
              </label>
              <div className="h-12 bg-[#1a202c] border border-[#232b3b] rounded-xl px-3.5 flex items-center justify-between gap-2 focus-within:border-[#38465d] transition-colors">
                <span className="font-mono text-[13px] text-[#c4ccd7] truncate select-all">
                  {activeServerSeed.slice(0, 48)}...
                </span>
                <button
                  onClick={() => handleCopy(activeServerSeed, 'active')}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#232c3d] hover:bg-[#2d384d] active:scale-95 text-white text-[12px] font-medium rounded-lg transition-all border border-[#2b364a]"
                >
                  {copiedField === 'active' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Next Server Seed (Hashed) */}
            <div className="flex flex-col mb-4">
              <label className="text-[11px] font-bold text-[#677487] tracking-wider uppercase mb-2">
                Next server seed (hashed)
              </label>
              <div className="h-12 bg-[#1a202c] border border-[#232b3b] rounded-xl px-3.5 flex items-center justify-between gap-2 focus-within:border-[#38465d] transition-colors">
                <span className="font-mono text-[13px] text-[#c4ccd7] truncate select-all">
                  {nextServerSeed.slice(0, 48)}...
                </span>
                <button
                  onClick={() => handleCopy(nextServerSeed, 'next')}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#232c3d] hover:bg-[#2d384d] active:scale-95 text-white text-[12px] font-medium rounded-lg transition-all border border-[#2b364a]"
                >
                  {copiedField === 'next' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Client Seed & Nonce (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3 mb-4">
              {/* Client Seed */}
              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-[#677487] tracking-wider uppercase mb-2">
                  Client seed
                </label>
                <div className="h-12 bg-[#1a202c] border border-[#232b3b] rounded-xl px-3.5 flex items-center justify-between gap-2 focus-within:border-[#38465d] transition-colors">
                  <input
                    type="text"
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    className="w-full bg-transparent font-mono text-[13px] text-white focus:outline-none truncate"
                  />
                  <button
                    onClick={handleShuffleClientSeed}
                    title="Generate new client seed"
                    className="shrink-0 p-1.5 text-[#7c8ba0] hover:text-white hover:bg-[#232c3d] rounded-lg transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nonce */}
              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-[#677487] tracking-wider uppercase mb-2">
                  Nonce
                </label>
                <div className="h-12 bg-[#1a202c] border border-[#232b3b] rounded-xl px-3.5 flex items-center">
                  <span className="font-mono text-[14px] font-medium text-white">
                    {currentNonce}
                  </span>
                </div>
              </div>
            </div>

            {/* Rotate Server Seed Card */}
            <div className="bg-[#141822] border border-[#222938] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
              <div className="flex flex-col">
                <h4 className="text-[14px] font-bold text-white tracking-tight">
                  Rotate server seed
                </h4>
                <p className="text-[12px] text-[#78889d] mt-1 leading-relaxed max-w-[270px]">
                  Reveals the current server seed and starts a fresh one (nonce resets to 0).
                </p>
              </div>
              <button
                onClick={handleRotateSeed}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#202838] hover:bg-[#283449] active:scale-95 text-white text-[13px] font-medium rounded-xl border border-[#2d374b] transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[#94a3b8]" />
                <span>Rotate seed</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Stats Modal - Styled with same design system */}
        {activeModal === 'stats' && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2">
              <Activity className="w-5 h-5 text-[#38bdf8]" />
              <h2 className="text-[22px] font-bold text-white tracking-tight">
                Live statistics
              </h2>
            </div>
            <p className="text-[14px] text-[#8e9aa9] mb-5">
              Real-time gameplay summary and wager analytics for this session.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-[#677487] tracking-wider uppercase">
                  Total bets
                </span>
                <p className="text-[20px] font-bold text-white mt-1 font-mono">
                  {totalBets}
                </p>
              </div>
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-[#677487] tracking-wider uppercase">
                  Win rate
                </span>
                <p className="text-[20px] font-bold text-emerald-400 mt-1 font-mono">
                  {winRate}%
                </p>
              </div>
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-[#677487] tracking-wider uppercase">
                  Total wagered
                </span>
                <p className="text-[14px] font-bold text-white mt-1 font-mono">
                  {totalWagered} <span className="text-[#8e9aa9] text-xs font-normal">{currency}</span>
                </p>
              </div>
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-[#677487] tracking-wider uppercase">
                  Net profit
                </span>
                <p
                  className={`text-[14px] font-bold mt-1 font-mono ${
                    isNetPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isNetPositive ? `+${totalProfit}` : totalProfit} <span className="text-[#8e9aa9] text-xs font-normal">{currency}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#202838] hover:bg-[#283449] active:scale-95 text-white font-medium text-sm rounded-xl border border-[#2d374b] transition-all"
            >
              Close
            </button>
          </div>
        )}

        {/* Hotkeys Modal - Styled with same design system */}
        {activeModal === 'hotkeys' && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2">
              <Keyboard className="w-5 h-5 text-amber-400" />
              <h2 className="text-[22px] font-bold text-white tracking-tight">
                Keyboard shortcuts
              </h2>
            </div>
            <p className="text-[14px] text-[#8e9aa9] mb-5">
              Quick keyboard controls to speed up your betting workflow.
            </p>

            <div className="flex flex-col gap-2 mb-5">
              {[
                { label: 'Place Bet', key: 'Space' },
                { label: 'Halve Bet Amount (½)', key: 'A' },
                { label: 'Double Bet Amount (2×)', key: 'S' },
                { label: 'Switch Low / High', key: 'Q' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center px-3.5 py-2.5 bg-[#1a202c] border border-[#232b3b] rounded-xl"
                >
                  <span className="text-[13px] text-[#c4ccd7]">{item.label}</span>
                  <kbd className="bg-[#242c3d] border border-[#2d374b] px-2.5 py-1 rounded-lg text-white font-mono text-[12px] font-semibold">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#202838] hover:bg-[#283449] active:scale-95 text-white font-medium text-sm rounded-xl border border-[#2d374b] transition-all"
            >
              Got it
            </button>
          </div>
        )}

        {/* Rules & Game Guide Modal - Styled with same design system */}
        {activeModal === 'rules' && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2">
              <Info className="w-5 h-5 text-[#38bdf8]" />
              <h2 className="text-[22px] font-bold text-white tracking-tight">
                Hash Dice rules
              </h2>
            </div>
            <p className="text-[14px] text-[#8e9aa9] mb-5">
              Hash Dice is a provably fair cryptographic game played on a 0000–9999 range.
            </p>

            <div className="flex flex-col gap-2.5 text-[13px] text-[#8e9aa9] leading-relaxed mb-5">
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-white font-semibold block mb-0.5">1. Set Bet Amount & Direction</span>
                Choose your wager in USDT and select whether the final hash roll will be <strong className="text-emerald-400">Low</strong> (under target) or <strong className="text-emerald-400">High</strong> (over target).
              </div>
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-white font-semibold block mb-0.5">2. Target Payout & Win Chance</span>
                Adjust your payout multiplier or target threshold. Your chance to win adjusts dynamically in real time.
              </div>
              <div className="bg-[#1a202c] border border-[#232b3b] rounded-xl p-3.5">
                <span className="text-white font-semibold block mb-0.5">3. Roll & Win</span>
                Hit the green Bet button. If the mechanical 4-digit roller stops within your winning bracket, your payout is credited instantly!
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#202838] hover:bg-[#283449] active:scale-95 text-white font-medium text-sm rounded-xl border border-[#2d374b] transition-all"
            >
              Start playing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
