"use client";

import { useEffect, useRef } from "react";

import Hls from "hls.js";

import "react-video-seek-slider/styles.css";
import { Image } from "@heroui/react";

export function VideoPlayer({
  url,
  type = "video",
  poster,
  autoPlay = false,
  className = "",
  videoClassName = "",
  controls = true,
  muted = false,
  playing = false,
}: {
  url: string;
  type?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  videoClassName?: string;
  controls?: boolean;
  muted?: boolean;
  playing?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (url.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }
    } else {
      video.src = url;
    }
  }, [url]);

  if (!url) {
    return <div className="text-center text-gray-500">Nenhuma mídia disponível</div>;
  }

  if (type?.startsWith("video")) {
    return (
      <div className={`aspect-video overflow-hidden rounded-lg bg-[#111111] ${className}`}>
        <video
          poster={poster}
          ref={videoRef}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          className={`size-full ${videoClassName}`}
          crossOrigin="anonymous"
          playsInline
        />
      </div>
    );
  }

  if (type?.startsWith("image")) {
    return (
      <div className={`flex aspect-video h-full items-center justify-center ${className}`}>
        <Image
          removeWrapper
          src={url}
          alt="Imagem"
          className={`aspect-video max-h-full max-w-full rounded-lg ${videoClassName}`}
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-[#111111] text-center text-foreground-500">
      <p>Formato do arquivo invalido</p>
    </div>
  );
}
