"use client";

import { useState } from "react";
import { Notepad } from "@/components/Notepad";
import { PomodoroTimer } from "@/components/PomodoroTimer";

const tracks = [
  "Lo-Fi Breeze",
  "Night Study Session",
  "Rain and Vinyl",
  "Deep Focus"
];

const trackVideoIds = [
  "jfKfPfyJRdk",
  "4xDzrJKXOOY",
  "5qap5aO4i9A",
  "DWcJFNfaw9c"
];

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const goToPrevTrack = () => {
    setCurrentVideoIndex((prev) =>
      (prev - 1 + trackVideoIds.length) % trackVideoIds.length
    );
  };

  const goToNextTrack = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % trackVideoIds.length);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-12">
        <section className="rounded-2xl border border-[#4c566a] bg-[#3b4252]/90 p-6 shadow-2xl shadow-black/30 md:col-span-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[#d8dee9]/70">Music</p>
          <h2 className="mt-2 text-xl font-semibold text-[#eceff4]">Player</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-[#4c566a] bg-[#2e3440]/70">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${trackVideoIds[currentVideoIndex]}?autoplay=${isPlaying ? 1 : 0}`}
                title={tracks[currentVideoIndex]}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-[#4c566a] bg-[#2e3440]/80 p-4">
            <p className="text-sm text-[#d8dee9]/80">Now playing</p>
            <p className="mt-1 font-medium text-[#88c0d0]">{tracks[currentVideoIndex]}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#434c5e]">
              <div className="h-full w-2/5 rounded-full bg-[#81a1c1]" />
            </div>
            <div className="mt-5 flex items-center justify-center gap-3 text-sm">
              <button
                onClick={goToPrevTrack}
                className="rounded-lg border border-[#4c566a] bg-[#434c5e] px-3 py-2 text-[#d8dee9] transition hover:bg-[#4c566a]"
              >
                Prev
              </button>
              <button
                onClick={togglePlayPause}
                className="rounded-lg border border-[#4c566a] bg-[#81a1c1] px-4 py-2 font-medium text-[#2e3440] transition hover:bg-[#88c0d0]"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={goToNextTrack}
                className="rounded-lg border border-[#4c566a] bg-[#434c5e] px-3 py-2 text-[#d8dee9] transition hover:bg-[#4c566a]"
              >
                Next
              </button>
            </div>
          </div>
          <ul className="mt-5 space-y-2">
            {tracks.map((track) => (
              <li
                key={track}
                className="rounded-lg border border-transparent px-3 py-2 text-sm text-[#d8dee9]/80 transition hover:border-[#4c566a] hover:bg-[#2e3440]/70"
              >
                {track}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#4c566a] bg-[#3b4252]/90 p-6 shadow-2xl shadow-black/30 md:col-span-6">
          <PomodoroTimer />
        </section>

        <section className="flex min-h-[min(560px,80vh)] flex-col rounded-2xl border border-[#4c566a] bg-[#3b4252]/90 p-6 shadow-2xl shadow-black/30 md:col-span-3">
          <Notepad />
        </section>
      </div>
    </main>
  );
}
