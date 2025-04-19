"use client";
import { useEffect, useRef, useState } from "react";
import { getAssetPath } from "@/utils";

const SONGS = ["/what_is_love.mp3", "/pop.mp3", "/killin_me_good.mp3"];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSongEnd = () => {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % SONGS.length);
    };

    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [SONGS.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Save current position before changing source
    const wasPlaying = !audio.paused;

    audio.src = getAssetPath(SONGS[currentSongIndex]);

    if (wasPlaying) {
      audio.play().catch((err) => console.error("Error playing audio:", err));
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Error playing audio:", err));
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <button
        onClick={togglePlay}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button
        onClick={toggleMute}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      <audio ref={audioRef} />
    </div>
  );
}
