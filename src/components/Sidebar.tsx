import React, { useState } from 'react';
import {
  Info,
  ChevronDown,
  Volume2,
  VolumeX,
  ShieldCheck,
  Activity,
  FileText,
  Keyboard,
  Zap,
  ChevronUp,
  Play,
  Square,
} from 'lucide-react';
import { BetDirection, GameState, TabType, ThemeMode } from '../types';

interface SidebarProps {
  gameState: GameState;
  onUpdateState: (updates: Partial<GameState>) => void;
  onBet: () => void;
  onToggleAutoBet: () => void;
  onOpenFairness: () => void;
  onOpenStats: () => void;
  onOpenHotkeys: () => void;
  onOpenRules: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  gameState,
  onUpdateState,
  onBet,
  onToggleAutoBet,
  onOpenFairness,
  onOpenStats,
  onOpenHotkeys,
  onOpenRules,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [amountInputStr, setAmountInputStr] = useState(gameState.amount.toFixed(6));

  // Keep input string synced if amount changes externally
  React.useEffect(() => {
    setAmountInputStr(gameState.amount.toFixed(6));
  }, [gameState.amount]);

  const handleAmountChange = (valStr: string) => {
    setAmountInputStr(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num >= 0) {
      const newWinAmount = Number((num * gameState.payout).toFixed(8));
      onUpdateState({ amount: num, winAmount: newWinAmount });
    }
  };

  const handleHalf = () => {
    const newAmount = Math.max(0.000001, Number((gameState.amount / 2).toFixed(6)));
    const newWinAmount = Number((newAmount * gameState.payout).toFixed(8));
    onUpdateState({ amount: newAmount, winAmount: newWinAmount });
  };

  const handleDouble = () => {
    const newAmount = Math.min(gameState.balance, Number((gameState.amount * 2).toFixed(6)));
    const newWinAmount = Number((newAmount * gameState.payout).toFixed(8));
    onUpdateState({ amount: newAmount, winAmount: newWinAmount });
  };

  const handleStepUp = () => {
    const newAmount = Number((gameState.amount + 0.000005).toFixed(6));
    const newWinAmount = Number((newAmount * gameState.payout).toFixed(8));
    onUpdateState({ amount: newAmount, winAmount: newWinAmount });
  };

  const handleStepDown = () => {
    const newAmount = Math.max(0.000001, Number((gameState.amount - 0.000005).toFixed(6)));
    const newWinAmount = Number((newAmount * gameState.payout).toFixed(8));
    onUpdateState({ amount: newAmount, winAmount: newWinAmount });
  };

  const handlePercent = (fraction: number) => {
    const newAmount = Number((gameState.balance * fraction).toFixed(6));
    const newWinAmount = Number((newAmount * gameState.payout).toFixed(8));
    onUpdateState({ amount: newAmount, winAmount: newWinAmount });
  };

  const handleBetDirection = (dir: BetDirection) => {
    let newTarget = gameState.rollTarget;
    if (dir === 'low') {
      newTarget = 50.0;
    } else {
      newTarget = 49.99;
    }
    onUpdateState({ betDirection: dir, rollTarget: newTarget });
  };

  return (
    <aside
      id="sidebar-panel"
      className="w-full lg:w-[335px] shrink-0 bg-[#12161e] border-r border-[#1e2430] flex flex-col justify-between p-4 sm:p-5 text-[#e2e8f0] select-none"
    >
      <div className="flex flex-col gap-4">
        {/* Navigation Tabs: Manual, Auto */}
        <div id="mode-tabs" className="flex items-center border-b border-[#212735] pb-2">
          {(['manual', 'auto'] as TabType[]).map((tab) => {
            const isActive = gameState.activeTab === tab;
            return (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => onUpdateState({ activeTab: tab })}
                className={`relative px-4 py-1.5 text-[15px] font-semibold capitalize transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-[#758195] hover:text-[#cbd5e1]'
                }`}
              >
                {tab}
                {isActive && (
                  <div className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#10d876] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Common Wager Inputs (Balance, Amount, Win Amount, Bet Direction) */}
            {/* BALANCE Field */}
            <div id="balance-section" className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
                BALANCE
              </label>
              <div className="relative flex items-center justify-between bg-[#19202b] border border-[#232d3e] rounded-lg px-3 py-2.5">
                <span className="font-semibold text-[15px] text-white tracking-wide">
                  {gameState.balance.toFixed(8)}
                </span>

                {/* USDT Badge with Dropdown */}
                <div className="relative">
                  <button
                    id="currency-selector-button"
                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                    className="flex items-center gap-1.5 bg-[#202937] hover:bg-[#273243] border border-[#2a374b] rounded-md px-2 py-1 transition-colors"
                  >
                    {/* Tether USDT Icon */}
                    <div className="w-4 h-4 rounded-full bg-[#26a17b] flex items-center justify-center text-white text-[10px] font-bold">
                      ₮
                    </div>
                    <span className="text-[12px] font-bold text-white tracking-wider">
                      {gameState.currency}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#758195]" />
                  </button>

                  {/* Currency Dropdown menu */}
                  {currencyDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-32 bg-[#1b222e] border border-[#2d384c] rounded-lg shadow-xl py-1 z-50">
                      {['USDT', 'BTC', 'ETH', 'DOGE', 'SOL'].map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            onUpdateState({ currency: curr });
                            setCurrencyDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-[#242e3f] text-slate-200"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#10d876]" />
                          {curr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AMOUNT Field */}
            <div id="amount-section" className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
                  AMOUNT
                </label>
                <button
                  onClick={onOpenRules}
                  title="Game rules and payout information"
                  className="text-[#758195] hover:text-slate-300"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Amount Input with 1/2, 2x, steppers */}
              <div className="flex items-center bg-[#19202b] border border-[#232d3e] rounded-lg px-2.5 py-1.5 focus-within:border-[#38bdf8] transition-colors">
                {/* Tether USDT Icon */}
                <div className="w-4 h-4 rounded-full bg-[#26a17b] flex items-center justify-center text-white text-[10px] font-bold mr-2 shrink-0">
                  ₮
                </div>

                {/* Input box */}
                <input
                  id="bet-amount-input"
                  type="text"
                  value={amountInputStr}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full bg-transparent text-white font-semibold text-[15px] outline-none tracking-wide"
                />

                {/* 1/2, 2x, stepper buttons */}
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <button
                    id="btn-half-amount"
                    onClick={handleHalf}
                    className="w-6 h-7 rounded hover:bg-[#253042] text-[#8c98a9] hover:text-white font-semibold text-[13px] flex items-center justify-center transition-colors"
                  >
                    ½
                  </button>
                  <button
                    id="btn-double-amount"
                    onClick={handleDouble}
                    className="w-6 h-7 rounded hover:bg-[#253042] text-[#8c98a9] hover:text-white font-semibold text-[13px] flex items-center justify-center transition-colors"
                  >
                    2×
                  </button>
                  <div className="flex flex-col items-center justify-center pl-0.5">
                    <button
                      id="btn-step-up"
                      onClick={handleStepUp}
                      className="hover:text-white text-[#758195] p-0.5"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      id="btn-step-down"
                      onClick={handleStepDown}
                      className="hover:text-white text-[#758195] p-0.5"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset buttons: 25%, 50%, 75%, 100% */}
              <div className="grid grid-cols-4 gap-2 mt-1">
                {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                  const label = `${frac * 100}%`;
                  return (
                    <button
                      key={label}
                      id={`btn-percent-${label}`}
                      onClick={() => handlePercent(frac)}
                      className="bg-[#19202b] hover:bg-[#232d3e] border border-[#242f40] rounded-md py-1.5 text-center text-xs font-semibold text-[#8e9aa9] hover:text-white transition-all active:scale-95"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WIN AMOUNT Field */}
            <div id="win-amount-section" className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
                WIN AMOUNT
              </label>
              <div className="flex items-center justify-between bg-[#19202b] border border-[#232d3e] rounded-lg px-3 py-2.5">
                <span className="font-semibold text-[15px] text-white tracking-wide">
                  {gameState.winAmount.toFixed(7)}
                </span>
                <span className="text-[14px] text-[#758195] font-medium">
                  {gameState.payout.toFixed(4)}×
                </span>
              </div>
            </div>

            {/* BET DIRECTION */}
            <div id="bet-direction-section" className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#758195] uppercase tracking-wider">
                BET DIRECTION
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Low button */}
                <button
                  id="btn-bet-direction-low"
                  onClick={() => handleBetDirection('low')}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-150 ${
                    gameState.betDirection === 'low'
                      ? 'bg-[#10d876] text-black shadow-[0_0_12px_rgba(16,216,118,0.3)]'
                      : 'bg-[#19202b] border border-[#232d3e] text-[#8e9aa9] hover:text-white hover:bg-[#202937]'
                  }`}
                >
                  <span
                    className={`text-[14px] font-bold ${
                      gameState.betDirection === 'low' ? 'text-[#062915]' : 'text-slate-200'
                    }`}
                  >
                    Low
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      gameState.betDirection === 'low' ? 'text-[#084d28]' : 'text-[#64748b]'
                    }`}
                  >
                    Roll Under {gameState.betDirection === 'low' ? gameState.rollTarget.toFixed(2) : (100 - gameState.rollTarget).toFixed(2)}
                  </span>
                </button>

                {/* High button */}
                <button
                  id="btn-bet-direction-high"
                  onClick={() => handleBetDirection('high')}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-150 ${
                    gameState.betDirection === 'high'
                      ? 'bg-[#10d876] text-black shadow-[0_0_12px_rgba(16,216,118,0.3)]'
                      : 'bg-[#19202b] border border-[#232d3e] text-[#8e9aa9] hover:text-white hover:bg-[#202937]'
                  }`}
                >
                  <span
                    className={`text-[14px] font-bold ${
                      gameState.betDirection === 'high' ? 'text-[#062915]' : 'text-slate-200'
                    }`}
                  >
                    High
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      gameState.betDirection === 'high' ? 'text-[#084d28]' : 'text-[#64748b]'
                    }`}
                  >
                    Roll Over {gameState.betDirection === 'high' ? gameState.rollTarget.toFixed(2) : (100 - gameState.rollTarget - 0.01).toFixed(2)}
                  </span>
                </button>
              </div>
            </div>

        {/* Tab-Specific Action Area: Manual Mode -> Bet Button */}
        {gameState.activeTab === 'manual' && (
          <button
            id="main-bet-button"
            onClick={onBet}
            disabled={gameState.isRolling || gameState.amount <= 0 || gameState.amount > gameState.balance}
            className={`w-full h-12 mt-1 rounded-lg font-bold text-[17px] text-[#062814] flex items-center justify-center tracking-wide transition-all shadow-[0_4px_14px_rgba(16,216,118,0.3)] active:scale-[0.98] ${
              gameState.isRolling
                ? 'bg-[#10d876]/70 cursor-not-allowed opacity-80'
                : 'bg-[#10d876] hover:bg-[#25e286]'
            }`}
          >
            {gameState.isRolling ? 'Rolling...' : 'Bet'}
          </button>
        )}

        {/* Tab-Specific Action Area: Auto Mode -> Inputs matching auto.PNG */}
        {gameState.activeTab === 'auto' && (
          <div className="flex flex-col gap-3">
            {/* Auto Settings Card matching auto.PNG 1:1 */}
            <div
              id="auto-bet-settings-card"
              className="bg-[#141822] border border-[#202736] rounded-xl p-3 sm:p-3.5 flex flex-col gap-3"
            >
              {/* NUMBER OF BETS (0 = ∞) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#687689] uppercase tracking-wider">
                  NUMBER OF BETS (0 = ∞)
                </label>
                <input
                  id="auto-input-number-of-bets"
                  type="number"
                  min="0"
                  step="1"
                  placeholder=""
                  value={gameState.autoNumberOfBets}
                  onChange={(e) => onUpdateState({ autoNumberOfBets: e.target.value })}
                  disabled={gameState.autoBetting}
                  className="w-full h-10 bg-[#1c2331] border border-[#252f40] rounded-lg px-3 text-white font-mono text-[13px] placeholder:text-[#4d5a6d] focus:border-[#3b4b66] focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>

              {/* ON WIN & ON LOSS (2 Columns) */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* ON WIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#687689] uppercase tracking-wider">
                    ON WIN
                  </label>
                  <div className="relative flex items-center bg-[#1c2331] border border-[#252f40] rounded-lg h-10 px-3 focus-within:border-[#3b4b66] transition-colors">
                    <input
                      id="auto-input-on-win"
                      type="number"
                      min="0"
                      step="any"
                      placeholder=""
                      value={gameState.autoOnWinPercent}
                      onChange={(e) => onUpdateState({ autoOnWinPercent: e.target.value })}
                      disabled={gameState.autoBetting}
                      className="w-full bg-transparent text-white font-mono text-[13px] placeholder:text-[#4d5a6d] focus:outline-none pr-4 disabled:opacity-60"
                    />
                    <span className="absolute right-3 text-[#687689] font-bold text-[13px] select-none pointer-events-none">
                      %
                    </span>
                  </div>
                </div>

                {/* ON LOSS */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#687689] uppercase tracking-wider">
                    ON LOSS
                  </label>
                  <div className="relative flex items-center bg-[#1c2331] border border-[#252f40] rounded-lg h-10 px-3 focus-within:border-[#3b4b66] transition-colors">
                    <input
                      id="auto-input-on-loss"
                      type="number"
                      min="0"
                      step="any"
                      placeholder=""
                      value={gameState.autoOnLossPercent}
                      onChange={(e) => onUpdateState({ autoOnLossPercent: e.target.value })}
                      disabled={gameState.autoBetting}
                      className="w-full bg-transparent text-white font-mono text-[13px] placeholder:text-[#4d5a6d] focus:outline-none pr-4 disabled:opacity-60"
                    />
                    <span className="absolute right-3 text-[#687689] font-bold text-[13px] select-none pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* STOP ON PROFIT & STOP ON LOSS (2 Columns) */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* STOP ON PROFIT */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#687689] uppercase tracking-wider">
                    STOP ON PROFIT
                  </label>
                  <input
                    id="auto-input-stop-profit"
                    type="number"
                    min="0"
                    step="any"
                    placeholder=""
                    value={gameState.autoStopOnProfit}
                    onChange={(e) => onUpdateState({ autoStopOnProfit: e.target.value })}
                    disabled={gameState.autoBetting}
                    className="w-full h-10 bg-[#1c2331] border border-[#252f40] rounded-lg px-3 text-white font-mono text-[13px] placeholder:text-[#4d5a6d] focus:border-[#3b4b66] focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>

                {/* STOP ON LOSS */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#687689] uppercase tracking-wider">
                    STOP ON LOSS
                  </label>
                  <input
                    id="auto-input-stop-loss"
                    type="number"
                    min="0"
                    step="any"
                    placeholder=""
                    value={gameState.autoStopOnLoss}
                    onChange={(e) => onUpdateState({ autoStopOnLoss: e.target.value })}
                    disabled={gameState.autoBetting}
                    className="w-full h-10 bg-[#1c2331] border border-[#252f40] rounded-lg px-3 text-white font-mono text-[13px] placeholder:text-[#4d5a6d] focus:border-[#3b4b66] focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Running Status Notification if active */}
            {gameState.autoBetting && (
              <div className="flex items-center justify-between px-3 py-2 bg-[#12231b] border border-[#1b4332] rounded-lg text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-bet running</span>
                </div>
                <span className="font-mono text-white text-[11px]">
                  Roll #{gameState.autoBetsCompleted}{gameState.autoNumberOfBets && parseInt(gameState.autoNumberOfBets) > 0 ? ` / ${gameState.autoNumberOfBets}` : ''}
                </span>
              </div>
            )}

            {gameState.autoStopReason && !gameState.autoBetting && (
              <div className="px-3 py-1.5 bg-[#1a202c] border border-[#2a3447] rounded-lg text-[11px] text-[#94a3b8] flex items-center justify-between">
                <span>{gameState.autoStopReason}</span>
                <button
                  onClick={() => onUpdateState({ autoStopReason: null })}
                  className="text-slate-400 hover:text-white ml-2 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Start / Stop auto-bet Button */}
            <button
              id="auto-bet-start-button"
              onClick={onToggleAutoBet}
              disabled={!gameState.autoBetting && (gameState.amount <= 0 || gameState.amount > gameState.balance)}
              className={`w-full h-12 rounded-xl font-bold text-[16px] sm:text-[17px] flex items-center justify-center gap-2 tracking-wide transition-all shadow-[0_4px_14px_rgba(16,216,118,0.3)] active:scale-[0.98] ${
                gameState.autoBetting
                  ? 'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)]'
                  : 'bg-[#10d876] hover:bg-[#25e286] text-[#062814] disabled:opacity-60 disabled:cursor-not-allowed'
              }`}
            >
              {gameState.autoBetting ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop auto-bet</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start auto-bet</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar of Left Panel */}
      <div id="sidebar-footer" className="mt-8 flex flex-col gap-4 border-t border-[#1e2430] pt-4">
        {/* Row 1: Classic / MEME pill + Sound toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="btn-skin-classic"
              onClick={() => onUpdateState({ themeMode: 'classic' })}
              className={`text-[13px] font-semibold transition-colors ${
                gameState.themeMode === 'classic'
                  ? 'text-white underline underline-offset-4'
                  : 'text-[#758195] hover:text-white'
              }`}
            >
              Classic
            </button>

            {/* MEME glowing pill badge */}
            <button
              id="btn-skin-meme"
              onClick={() => onUpdateState({ themeMode: 'meme' })}
              className={`px-3 py-0.5 rounded-full text-[12px] font-extrabold tracking-wider transition-all duration-200 ${
                gameState.themeMode === 'meme'
                  ? 'bg-[#231a0e] text-[#facc15] border border-[#eab308] shadow-[0_0_12px_rgba(234,179,8,0.5)]'
                  : 'bg-[#181f2a] text-[#758195] border border-[#242f40]'
              }`}
            >
              MEME
            </button>
          </div>

          {/* Sound Button */}
          <button
            id="btn-toggle-sound"
            onClick={() => onUpdateState({ soundEnabled: !gameState.soundEnabled })}
            className="flex items-center gap-1.5 bg-[#19202b] hover:bg-[#202938] border border-[#232d3e] rounded-md px-2.5 py-1 text-[13px] text-[#93c5fd] font-medium transition-colors"
          >
            {gameState.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#60a5fa]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#64748b]" />
            )}
            <span className={gameState.soundEnabled ? 'text-[#93c5fd]' : 'text-[#64748b]'}>
              Sound
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-[#64748b]" />
          </button>
        </div>

        {/* Row 2: Tool icons (Shield, Stats, Ledger, Hotkeys, Fast) */}
        <div className="flex items-center justify-between text-[#64748b]">
          <div className="flex items-center gap-3">
            <button
              id="tool-fairness"
              onClick={onOpenFairness}
              title="Provably Fair Verification"
              className="p-1 hover:text-white hover:bg-[#19202b] rounded transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              id="tool-stats"
              onClick={onOpenStats}
              title="Live Betting Stats"
              className="p-1 hover:text-white hover:bg-[#19202b] rounded transition-colors"
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              id="tool-history"
              onClick={onOpenRules}
              title="Game Rules & Ledger"
              className="p-1 hover:text-white hover:bg-[#19202b] rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              id="tool-hotkeys"
              onClick={onOpenHotkeys}
              title="Keyboard Shortcuts"
              className="p-1 hover:text-white hover:bg-[#19202b] rounded transition-colors"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>

          {/* Fast Toggle */}
          <button
            id="tool-fast-mode"
            onClick={() => onUpdateState({ fastMode: !gameState.fastMode })}
            className={`flex items-center gap-1 text-[12px] font-semibold transition-colors px-1.5 py-0.5 rounded ${
              gameState.fastMode ? 'text-[#38bdf8] bg-[#1e293b]' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${gameState.fastMode ? 'fill-[#38bdf8]' : ''}`} />
            <span>Fast</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
