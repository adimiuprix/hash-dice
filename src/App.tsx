import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ArcadeCabinet } from './components/ArcadeCabinet';
import { BottomStats } from './components/BottomStats';
import { Modals } from './components/Modals';
import { GameState, RollHistoryItem } from './types';
import { playClickSound, playLoseSound, playReelTick, playWinSound } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    balance: 1000000.00000000,
    currency: 'USDT',
    amount: 0.000005,
    betDirection: 'low',
    payout: 1.9000,
    rollTarget: 50.00,
    winChance: 50.00,
    winAmount: 0.0000095,
    reels: [0, 0, 0, 0],
    isRolling: false,
    lastRollResult: null,
    history: [],
    soundEnabled: true,
    fastMode: false,
    themeMode: 'meme',
    activeTab: 'manual',
    autoBetting: false,
    autoNumberOfBets: '',
    autoOnWinPercent: '',
    autoOnLossPercent: '',
    autoStopOnProfit: '',
    autoStopOnLoss: '',
    autoBaseAmount: 0.000005,
    autoBetsCompleted: 0,
    autoSessionProfit: 0,
    autoStopReason: null,
  });

  const [activeModal, setActiveModal] = useState<'fairness' | 'stats' | 'hotkeys' | 'rules' | null>(null);
  const autoBetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef<GameState>(gameState);

  // Keep ref synchronized with current state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => {
      const next = { ...prev, ...updates };
      gameStateRef.current = next;
      return next;
    });
  }, []);

  // Execute a single bet roll (used for both manual and auto)
  const executeRoll = useCallback(() => {
    const current = gameStateRef.current;
    if (current.isRolling) return;

    if (current.balance < current.amount) {
      if (current.autoBetting) {
        updateState({
          autoBetting: false,
          autoStopReason: 'Auto-bet stopped: Insufficient balance',
        });
      } else {
        updateState({
          balance: 0.005,
          autoStopReason: 'Test balance refilled to 0.00500000 USDT',
        });
      }
      return;
    }

    if (current.soundEnabled) {
      playClickSound();
    }

    // Deduct bet amount immediately
    const currentBalance = Number((current.balance - current.amount).toFixed(8));
    updateState({ balance: currentBalance, isRolling: true });

    // Generate outcome: 00.00 to 99.99
    const rawNumber = Math.floor(Math.random() * 10000); // 0 to 9999
    const rollScore = Number((rawNumber / 100).toFixed(2));
    const padStr = rawNumber.toString().padStart(4, '0');
    const finalDigits: [number, number, number, number] = [
      parseInt(padStr[0], 10),
      parseInt(padStr[1], 10),
      parseInt(padStr[2], 10),
      parseInt(padStr[3], 10),
    ];

    // Determine win/loss
    const won =
      current.betDirection === 'low'
        ? rollScore < current.rollTarget
        : rollScore > current.rollTarget;

    const returnAmount = won ? Number((current.amount * current.payout).toFixed(8)) : 0;
    const profit = won ? Number((returnAmount - current.amount).toFixed(8)) : -current.amount;

    const historyItem: RollHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      rollNumber: rollScore,
      rollDigits: finalDigits,
      won,
      amount: current.amount,
      payout: current.payout,
      profit,
      direction: current.betDirection,
      target: current.rollTarget,
      timestamp: Date.now(),
    };

    const finalizeRoll = () => {
      const stateNow = gameStateRef.current;
      const finalBalance = Number((currentBalance + returnAmount).toFixed(8));

      if (stateNow.soundEnabled) {
        if (won) playWinSound();
        else playLoseSound();
      }

      // If in Auto-betting mode, process automated conditions & progression
      if (stateNow.autoBetting) {
        const nextCompleted = stateNow.autoBetsCompleted + 1;
        const nextSessionProfit = Number((stateNow.autoSessionProfit + profit).toFixed(8));

        let stopReason: string | null = null;

        // Condition 1: Check Number of Bets reached
        const maxBets = parseInt(stateNow.autoNumberOfBets || '0', 10);
        if (maxBets > 0 && nextCompleted >= maxBets) {
          stopReason = `Target reached: completed ${maxBets} bet${maxBets > 1 ? 's' : ''}`;
        }

        // Condition 2: Stop on Profit
        const stopProfit = parseFloat(stateNow.autoStopOnProfit || '0');
        if (!stopReason && stopProfit > 0 && nextSessionProfit >= stopProfit) {
          stopReason = `Stop on profit reached (+${nextSessionProfit.toFixed(6)} ${stateNow.currency})`;
        }

        // Condition 3: Stop on Loss
        const stopLoss = parseFloat(stateNow.autoStopOnLoss || '0');
        if (!stopReason && stopLoss > 0 && nextSessionProfit <= -stopLoss) {
          stopReason = `Stop on loss reached (${nextSessionProfit.toFixed(6)} ${stateNow.currency})`;
        }

        // Next Bet Amount calculation
        let nextBet = stateNow.autoBaseAmount;
        if (won) {
          const winPct = parseFloat(stateNow.autoOnWinPercent || '0');
          if (winPct > 0) {
            nextBet = Number((stateNow.amount * (1 + winPct / 100)).toFixed(6));
          } else {
            nextBet = stateNow.autoBaseAmount;
          }
        } else {
          const lossPct = parseFloat(stateNow.autoOnLossPercent || '0');
          if (lossPct > 0) {
            nextBet = Number((stateNow.amount * (1 + lossPct / 100)).toFixed(6));
          } else {
            nextBet = stateNow.autoBaseAmount;
          }
        }

        if (nextBet <= 0) nextBet = 0.000001;

        // Condition 4: Check if final balance is insufficient for next bet
        if (!stopReason && finalBalance < nextBet) {
          stopReason = 'Insufficient balance for next bet';
        }

        if (stopReason) {
          // Stop auto betting
          updateState({
            balance: finalBalance,
            reels: finalDigits,
            isRolling: false,
            lastRollResult: historyItem,
            history: [historyItem, ...stateNow.history.slice(0, 19)],
            autoBetting: false,
            autoBetsCompleted: nextCompleted,
            autoSessionProfit: nextSessionProfit,
            autoStopReason: stopReason,
            amount: stateNow.autoBaseAmount,
            winAmount: Number((stateNow.autoBaseAmount * stateNow.payout).toFixed(8)),
          });
        } else {
          // Continue auto betting: update state and schedule next roll
          const newWinAmount = Number((nextBet * stateNow.payout).toFixed(8));
          updateState({
            balance: finalBalance,
            reels: finalDigits,
            isRolling: false,
            lastRollResult: historyItem,
            history: [historyItem, ...stateNow.history.slice(0, 19)],
            autoBetsCompleted: nextCompleted,
            autoSessionProfit: nextSessionProfit,
            amount: nextBet,
            winAmount: newWinAmount,
          });

          const delay = stateNow.fastMode ? 140 : 550;
          autoBetTimerRef.current = setTimeout(() => {
            executeRoll();
          }, delay);
        }
      } else {
        // Manual mode roll completed
        updateState({
          balance: finalBalance,
          reels: finalDigits,
          isRolling: false,
          lastRollResult: historyItem,
          history: [historyItem, ...stateNow.history.slice(0, 19)],
        });
      }
    };

    if (current.fastMode) {
      // Instant roll in fast mode
      finalizeRoll();
    } else {
      // Reel spinning animation
      let ticks = 0;
      const totalTicks = 8;
      const interval = setInterval(() => {
        ticks++;
        if (gameStateRef.current.soundEnabled) {
          playReelTick();
        }
        updateState({
          reels: [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
          ],
        });

        if (ticks >= totalTicks) {
          clearInterval(interval);
          finalizeRoll();
        }
      }, 90);
    }
  }, [updateState]);

  // Toggle Auto-bet on or off
  const handleToggleAutoBet = useCallback(() => {
    const current = gameStateRef.current;
    if (current.autoBetting) {
      // Stop auto bet
      if (autoBetTimerRef.current) {
        clearTimeout(autoBetTimerRef.current);
        autoBetTimerRef.current = null;
      }
      updateState({
        autoBetting: false,
        autoStopReason: 'Auto-bet stopped by user',
        amount: current.autoBaseAmount,
        winAmount: Number((current.autoBaseAmount * current.payout).toFixed(8)),
      });
    } else {
      // Start auto bet
      if (current.balance < current.amount) {
        updateState({
          balance: 0.005,
          autoStopReason: 'Balance refilled to 0.00500000 USDT for testing',
        });
        return;
      }
      const baseAmt = current.amount;
      updateState({
        autoBetting: true,
        autoBaseAmount: baseAmt,
        autoBetsCompleted: 0,
        autoSessionProfit: 0,
        autoStopReason: null,
      });

      // Launch the first roll
      setTimeout(() => {
        executeRoll();
      }, 100);
    }
  }, [executeRoll, updateState]);

  // Cleanup auto bet timer on unmount
  useEffect(() => {
    return () => {
      if (autoBetTimerRef.current) {
        clearTimeout(autoBetTimerRef.current);
      }
    };
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const current = gameStateRef.current;
      if (e.code === 'Space') {
        e.preventDefault();
        if (current.activeTab === 'auto') {
          handleToggleAutoBet();
        } else {
          executeRoll();
        }
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        const newAmt = Math.max(0.000001, Number((current.amount / 2).toFixed(6)));
        updateState({ amount: newAmt, winAmount: Number((newAmt * current.payout).toFixed(8)) });
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const newAmt = Math.min(current.balance, Number((current.amount * 2).toFixed(6)));
        updateState({ amount: newAmt, winAmount: Number((newAmt * current.payout).toFixed(8)) });
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        const nextDir = current.betDirection === 'low' ? 'high' : 'low';
        const nextTarget = nextDir === 'low' ? 50.0 : 49.99;
        updateState({ betDirection: nextDir, rollTarget: nextTarget });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeRoll, handleToggleAutoBet, updateState]);

  return (
    <div
      id="hash-dice-app-root"
      className="min-h-screen w-full bg-[#0d1017] flex flex-col-reverse lg:flex-row text-slate-100 font-sans"
    >
      {/* Left Control Sidebar (Under Arcade on mobile/tablet, on left on lg screens) */}
      <Sidebar
        gameState={gameState}
        onUpdateState={updateState}
        onBet={executeRoll}
        onToggleAutoBet={handleToggleAutoBet}
        onOpenFairness={() => setActiveModal('fairness')}
        onOpenStats={() => setActiveModal('stats')}
        onOpenHotkeys={() => setActiveModal('hotkeys')}
        onOpenRules={() => setActiveModal('rules')}
      />

      {/* Main Game Stage and Stats Area (On top on mobile/tablet, on right on lg screens) */}
      <main
        id="main-stage-wrapper"
        className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 min-h-[520px] lg:min-h-[600px] overflow-y-auto"
      >
        {/* Top Header: Roll history banner - directly above Arcade on small/medium screens */}
        <div
          id="roll-history-header"
          className="w-full flex items-center justify-center min-h-[36px] py-1 mb-2 lg:mb-0"
        >
          {gameState.history.length === 0 ? (
            <span className="text-[14px] font-medium text-[#4f5b6e] tracking-wide">
              Roll history will appear here
            </span>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
              {gameState.history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider shrink-0 transition-all ${item.won
                    ? 'bg-[#10d876]/15 text-[#10d876] border border-[#10d876]/30'
                    : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                    }`}
                >
                  {item.rollNumber.toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Arcade Machine & Characters */}
        <div className="w-full flex items-center justify-center my-auto py-2">
          <ArcadeCabinet
            reels={gameState.reels}
            isRolling={gameState.isRolling}
            themeMode={gameState.themeMode}
            lastWon={gameState.lastRollResult?.won}
          />
        </div>

        {/* Bottom: Payout, Roll Under/Over, Win Chance */}
        <div className="w-full flex justify-center pb-2">
          <BottomStats gameState={gameState} onUpdateState={updateState} />
        </div>
      </main>

      {/* Modals & Dialogs */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        history={gameState.history}
        currency={gameState.currency}
      />
    </div>
  );
}
