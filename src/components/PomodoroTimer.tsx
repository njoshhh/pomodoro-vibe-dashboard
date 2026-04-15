"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useSubtleChimes() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  /** Work session ended — short, clear but soft tone */
  const playWorkEnd = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    const t0 = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.055, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    osc.start(t0);
    osc.stop(t0 + 0.32);
  }, [getCtx]);

  /** Break ended — slightly lower, quieter */
  const playBreakEnd = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 523.25;
    const t0 = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.035, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
    osc.start(t0);
    osc.stop(t0 + 0.28);
  }, [getCtx]);

  return { playWorkEnd, playBreakEnd };
}

export function PomodoroTimer() {
  const [secondsRemaining, setSecondsRemaining] = useState(WORK_SECONDS);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [isRunning, setIsRunning] = useState(false);
  const { playWorkEnd, playBreakEnd } = useSubtleChimes();
  const zeroHandledRef = useRef(false);

  useEffect(() => {
    if (secondsRemaining > 0) {
      zeroHandledRef.current = false;
    }
  }, [secondsRemaining]);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsRemaining <= 0) return;

    const id = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, secondsRemaining]);

  useEffect(() => {
    if (!isRunning || secondsRemaining !== 0) return;
    if (zeroHandledRef.current) return;
    zeroHandledRef.current = true;

    if (mode === "work") {
      playWorkEnd();
      setMode("break");
      setSecondsRemaining(BREAK_SECONDS);
    } else {
      playBreakEnd();
      setMode("work");
      setSecondsRemaining(WORK_SECONDS);
      setIsRunning(false);
    }
  }, [secondsRemaining, isRunning, mode, playWorkEnd, playBreakEnd]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsRemaining(WORK_SECONDS);
  };

  const applyPreset = (seconds: number, nextMode: "work" | "break") => {
    setIsRunning(false);
    setMode(nextMode);
    setSecondsRemaining(seconds);
  };

  const borderAccent =
    mode === "work" ? "border-[#81a1c1]" : "border-[#a3be8c]";
  const label = mode === "work" ? "Focus" : "Break";

  return (
    <>
      <p className="text-center text-xs uppercase tracking-[0.24em] text-[#d8dee9]/70">
        Focus Session
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold text-[#eceff4] md:text-4xl">
        Pomodoro Timer
      </h1>
      <p className="mt-2 text-center text-sm font-medium text-[#88c0d0]">{label}</p>
      <div className="mt-8 flex justify-center">
        <div
          className={`flex h-56 w-56 items-center justify-center rounded-full border-8 ${borderAccent} bg-[#2e3440] shadow-lg shadow-[#2e3440]/70 transition-colors duration-300 md:h-64 md:w-64`}
        >
          <span className="text-5xl font-semibold tracking-wider text-[#eceff4] md:text-6xl tabular-nums">
            {formatTime(secondsRemaining)}
          </span>
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => applyPreset(WORK_SECONDS, "work")}
          className="rounded-xl border border-[#4c566a] bg-[#2e3440] px-4 py-3 text-left transition hover:border-[#81a1c1] hover:bg-[#434c5e]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8dee9]/65">Pomodoro</p>
          <p className="mt-1 text-lg font-medium text-[#eceff4]">25:00</p>
        </button>
        <button
          type="button"
          onClick={() => applyPreset(BREAK_SECONDS, "break")}
          className="rounded-xl border border-[#4c566a] bg-[#2e3440] px-4 py-3 text-left transition hover:border-[#81a1c1] hover:bg-[#434c5e]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8dee9]/65">Short Break</p>
          <p className="mt-1 text-lg font-medium text-[#eceff4]">05:00</p>
        </button>
        <button
          type="button"
          onClick={() => applyPreset(LONG_BREAK_SECONDS, "break")}
          className="rounded-xl border border-[#4c566a] bg-[#2e3440] px-4 py-3 text-left transition hover:border-[#81a1c1] hover:bg-[#434c5e]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8dee9]/65">Long Break</p>
          <p className="mt-1 text-lg font-medium text-[#eceff4]">15:00</p>
        </button>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={isRunning}
          className="rounded-xl bg-[#88c0d0] px-6 py-3 font-semibold text-[#2e3440] transition hover:bg-[#8fbcbb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={handlePause}
          disabled={!isRunning}
          className="rounded-xl border border-[#4c566a] bg-[#434c5e] px-6 py-3 font-semibold text-[#eceff4] transition hover:bg-[#4c566a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-[#4c566a] bg-[#2e3440] px-6 py-3 font-semibold text-[#d8dee9] transition hover:bg-[#434c5e]"
        >
          Reset
        </button>
      </div>
    </>
  );
}
