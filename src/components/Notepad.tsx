"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pomodoro-dashboard-notepad";

/** Normalize so each line is one bullet (•). Strips prior •, -, * prefixes to avoid duplicates. */
function ensureBulletFormat(raw: string): string {
  if (!raw.trim()) return "• ";
  return raw
    .split("\n")
    .map((line) => {
      const content = line.replace(/^\s*[•\u2022\-*]\s*/, "").trimEnd();
      return content.length > 0 ? `• ${content}` : "• ";
    })
    .join("\n");
}

export function Notepad() {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setText(ensureBulletFormat(saved));
      } else {
        setText("• ");
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch {
      // quota / private mode
    }
  }, [text, hydrated]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="text-xs uppercase tracking-[0.24em] text-[#d8dee9]/70">Notes</p>
      <h2 className="mt-2 text-xl font-semibold text-[#eceff4]">Notepad</h2>
      <div className="mt-5 flex min-h-0 flex-1 flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(ensureBulletFormat(e.target.value))}
          className="min-h-0 w-full flex-1 resize-none rounded-xl border border-[#4c566a] bg-transparent p-4 text-sm leading-6 text-[#eceff4] outline-none transition placeholder:text-[#d8dee9]/35 focus:border-[#81a1c1]"
          placeholder="• One idea per line (Enter for a new bullet)"
          spellCheck
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-xl border border-[#4c566a] bg-[#434c5e]/80 px-4 py-2.5 text-sm font-medium text-[#eceff4] transition hover:bg-[#4c566a]"
        >
          {copyState === "copied" ? "Copied" : "Copy to Clipboard"}
        </button>
      </div>
    </div>
  );
}
