"use client";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = { youtubeId: string; mp4Url: string; poster: string; title: string };

/**
 * Video profil sebagai latar hero: langsung diputar (tanpa suara, karena aturan autoplay
 * peramban), berulang, dengan tombol suara dan jeda. MP4 diutamakan bila tersedia.
 */
export function HeroVideo({ youtubeId, mp4Url, poster, title }: Props) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) setPaused(true);
  }, []);

  const yt = (func: string) => iframe.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (mp4Url && video.current) {
      video.current.muted = next;
      if (!next) video.current.volume = 1;
    } else {
      yt(next ? "mute" : "unMute");
    }
    if (!next && paused) togglePlay();
  }

  function togglePlay() {
    const next = !paused;
    setPaused(next);
    if (mp4Url && video.current) {
      if (next) video.current.pause();
      else void video.current.play();
    } else yt(next ? "pauseVideo" : "playVideo");
  }

  const hasVideo = Boolean(mp4Url || youtubeId);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden bg-[#0b2b23] [container-type:size]" aria-hidden={!hasVideo}>
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${ready && !reduceMotion ? "opacity-0" : "opacity-100"}`} />
        )}

        {mp4Url ? (
          <video
            ref={video}
            src={mp4Url}
            poster={poster || undefined}
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setReady(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        ) : youtubeId && origin && !reduceMotion ? (
          <iframe
            ref={iframe}
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            onLoad={() => {
              iframe.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "hero" }), "*");
              setTimeout(() => setReady(true), 1400);
            }}
            className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 scale-[1.18] transition-opacity duration-1000 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}

        {/* Lapisan gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06201a] via-[#06201a]/55 to-[#06201a]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06201a]/70 via-transparent to-transparent" />
      </div>

      {hasVideo && !reduceMotion && (
        <div className="absolute bottom-6 right-4 z-10 flex gap-2 sm:bottom-10 sm:right-6">
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            {muted ? "Nyalakan suara" : "Matikan suara"}
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={paused ? "Putar video" : "Jeda video"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-md transition-colors hover:bg-white/15"
          >
            {paused ? <Play className="size-4 fill-current" /> : <Pause className="size-4 fill-current" />}
          </button>
        </div>
      )}
    </>
  );
}
