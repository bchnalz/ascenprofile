"use client";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = { youtubeId: string; mp4Url: string; poster: string; title: string };

type YTPlayer = {
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer; PlayerState: { PLAYING: number; PAUSED: number; ENDED: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

/**
 * Video profil sebagai latar hero: langsung diputar saat website dibuka (tanpa suara,
 * karena peramban melarang video bersuara diputar otomatis), berulang, dengan tombol
 * suara dan jeda. File MP4 diutamakan bila tersedia.
 */
export function HeroVideo({ youtubeId, mp4Url, poster, title }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  // YouTube lewat IFrame API resmi: lebih andal untuk autoplay dan tombol suara.
  useEffect(() => {
    const el = host.current;
    if (mp4Url || !youtubeId || !el) return;
    let cancelled = false;
    const mount = document.createElement("div");
    el.appendChild(mount);

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      player.current = new window.YT.Player(mount, {
        videoId: youtubeId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: youtubeId,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) {
              setReady(true);
              setPaused(false);
            } else if (e.data === S.PAUSED) setPaused(true);
            else if (e.data === S.ENDED) e.target.playVideo();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      player.current?.destroy();
      player.current = null;
      el.replaceChildren();
    };
  }, [youtubeId, mp4Url]);

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (mp4Url && video.current) {
      video.current.muted = next;
      if (!next) {
        video.current.volume = 1;
        void video.current.play();
      }
    } else if (player.current) {
      if (next) player.current.mute();
      else {
        player.current.unMute();
        player.current.setVolume(100);
        player.current.playVideo();
      }
    }
    if (!next) setPaused(false);
  }

  function togglePlay() {
    const next = !paused;
    setPaused(next);
    if (mp4Url && video.current) {
      if (next) video.current.pause();
      else void video.current.play();
    } else if (next) player.current?.pauseVideo();
    else player.current?.playVideo();
  }

  const hasVideo = Boolean(mp4Url || youtubeId);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden bg-[#0b2b23] [container-type:size]">
        {mp4Url ? (
          <video
            ref={video}
            src={mp4Url}
            poster={poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setReady(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : youtubeId ? (
          <div
            ref={host}
            title={title}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 scale-[1.2] [&>iframe]:size-full"
          />
        ) : null}

        {/* Poster menutup video sampai benar-benar berputar, lalu memudar. */}
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className={`pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
          />
        )}

        {/* Lapisan gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06201a] via-[#06201a]/50 to-[#06201a]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06201a]/70 via-transparent to-transparent" />
      </div>

      {hasVideo && (
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
