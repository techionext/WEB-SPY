"use client";

import { VideoPlayer } from "@/components/videoplayer/video-player";

interface QuizVideoProps {
  videoUrl: string;
}

export const QuizVideo = ({ videoUrl }: QuizVideoProps) => {
  if (!videoUrl) {
    return (
      <div className="rounded-lg bg-default-100 flex items-center justify-center aspect-video text-default-500">
        Vídeo não disponível
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-lg bg-[#111111]">
      <VideoPlayer url={videoUrl} type="video" />
    </div>
  );
};
