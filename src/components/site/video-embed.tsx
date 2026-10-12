"use client";
import { Play } from "lucide-react";
import { useState } from "react";

export function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (!youtubeId) return null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-[22px] bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 size-full" aria-label={`Putar video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt=""
            className="size-full object-cover opacity-80 transition-opacity group-hover:opacity-95"
          />
          <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f0d488] text-[#0b2b23] shadow-xl transition-transform group-hover:scale-105">
            <Play className="ml-1 size-8 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
