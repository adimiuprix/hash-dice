import React, { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { BetDirection, GameState } from '../types';

interface BottomStatsProps {
  gameState: GameState;
  onUpdateState: (updates: Partial<GameState>) => void;
}

export const BottomStats: React.FC<BottomStatsProps> = ({ gameState, onUpdateState }) => {
  const [payoutInput, setPayoutInput] = useState(gameState.payout.toFixed(4));
  const [rollTargetInput, setRollTargetInput] = useState(gameState.rollTarget.toFixed(2));
  const [winChanceInput, setWinChanceInput] = useState(gameState.winChance.toFixed(2));

  // Sync inputs if state changes externally
  useEffect(() => {
    setPayoutInput(gameState.payout.toFixed(4));
    setRollTargetInput(gameState.rollTarget.toFixed(2));
    setWinChanceInput(gameState.winChance.toFixed(2));
  }, [gameState.payout, gameState.rollTarget, gameState.winChance]);

  // House edge 5% (RTP 95%) -> 95 / 50 = 1.9000x
  const RTP = 95;

  const handlePayoutChange = (valStr: string) => {
    setPayoutInput(valStr);
    const val = parseFloat(valStr);
    if (!isNaN(val) && val >= 1.01 && val <= 9500) {
      const newWinChance = Number((RTP / val).toFixed(2));
      const newRollTarget = gameState.betDirection === 'low' ? newWinChance : Number((100 - newWinChance - 0.01).toFixed(2));
      const newWinAmount = Number((gameState.amount * val).toFixed(8));
      onUpdateState({
        payout: val,
        winChance: newWinChance,
        rollTarget: newRollTarget,
        winAmount: newWinAmount,
      });
    }
  };

  const handleRollTargetChange = (valStr: string) => {
    setRollTargetInput(valStr);
    const val = parseFloat(valStr);
    if (!isNaN(val) && val >= 0.01 && val <= 99.99) {
      let winChance = val;
      if (gameState.betDirection === 'high') {
        winChance = Number((100 - val - 0.01).toFixed(2));
      }
      const newPayout = Number((RTP / winChance).toFixed(4));
      const newWinAmount = Number((gameState.amount * newPayout).toFixed(8));
      onUpdateState({
        rollTarget: val,
        winChance,
        payout: newPayout,
        winAmount: newWinAmount,
      });
    }
  };

  const handleWinChanceChange = (valStr: string) => {
    setWinChanceInput(valStr);
    const val = parseFloat(valStr);
    if (!isNaN(val) && val >= 0.01 && val <= 95) {
      const newPayout = Number((RTP / val).toFixed(4));
      const newRollTarget = gameState.betDirection === 'low' ? val : Number((100 - val - 0.01).toFixed(2));
      const newWinAmount = Number((gameState.amount * newPayout).toFixed(8));
      onUpdateState({
        winChance: val,
        payout: newPayout,
        rollTarget: newRollTarget,
        winAmount: newWinAmount,
      });
    }
  };

  const handleSwapDirection = () => {
    const nextDir: BetDirection = gameState.betDirection === 'low' ? 'high' : 'low';
    const nextTarget = nextDir === 'low' ? 50.0 : 49.99;
    onUpdateState({
      betDirection: nextDir,
      rollTarget: nextTarget,
    });
  };

  return (
    <div
      id="bottom-stats-bar"
      className="w-full max-w-[620px] grid grid-cols-3 gap-3 sm:gap-4 mt-6 select-none"
    >
      {/* PAYOUT */}
      <div id="stat-payout-box" className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
          PAYOUT
        </label>
        <div className="flex items-center justify-between bg-[#19202b] border border-[#232d3e] rounded-lg px-3 py-2.5 focus-within:border-[#38bdf8] transition-colors">
          <input
            type="text"
            value={payoutInput}
            onChange={(e) => handlePayoutChange(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-[15px] outline-none tracking-wide"
          />
          <span className="text-[#758195] text-[15px] font-medium shrink-0 ml-1">×</span>
        </div>
      </div>

      {/* ROLL UNDER / ROLL OVER */}
      <div id="stat-roll-target-box" className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
          {gameState.betDirection === 'low' ? 'ROLL UNDER' : 'ROLL OVER'}
        </label>
        <div className="flex items-center justify-between bg-[#19202b] border border-[#232d3e] rounded-lg px-3 py-2.5 focus-within:border-[#38bdf8] transition-colors">
          <input
            type="text"
            value={rollTargetInput}
            onChange={(e) => handleRollTargetChange(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-[15px] outline-none tracking-wide"
          />
          <button
            id="btn-swap-direction"
            onClick={handleSwapDirection}
            title="Swap Roll Direction"
            className="text-[#60a5fa] hover:text-[#93c5fd] transition-colors shrink-0 ml-1 p-0.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WIN CHANCE */}
      <div id="stat-win-chance-box" className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
          WIN CHANCE
        </label>
        <div className="flex items-center justify-between bg-[#19202b] border border-[#232d3e] rounded-lg px-3 py-2.5 focus-within:border-[#38bdf8] transition-colors">
          <input
            type="text"
            value={winChanceInput}
            onChange={(e) => handleWinChanceChange(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-[15px] outline-none tracking-wide"
          />
          <span className="text-[#758195] text-[15px] font-medium shrink-0 ml-1">%</span>
        </div>
      </div>
    </div>
  );
};
