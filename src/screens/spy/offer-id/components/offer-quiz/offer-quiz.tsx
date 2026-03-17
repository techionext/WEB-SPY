"use client";

import { useParams } from "next/navigation";
import { useGetSpyQuizQuery } from "@/services/spy/spy-offers.service";
import { Spinner } from "@heroui/react";
import { QuizVideo } from "./quiz-video";
import StepByStepSlider from "./step-by-step-slider";
import { NewEmpty } from "@/components/empty/new-empty";

export const OfferQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching } = useGetSpyQuizQuery({ id: id ?? "" }, { skip: !id });

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[280px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <NewEmpty
        title="Dados do quiz não disponíveis"
        description="Não há dados de quiz disponíveis"
        icon="solar:question-circle-bold"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 max-w-full">
      {data.video?.url && (
        <div className="flex flex-col gap-2 w-full min-w-0">
          <h3 className="text-sm font-medium text-foreground">Vídeo</h3>
          <QuizVideo videoUrl={data.video.url} />
        </div>
      )}
      {data.steps?.length > 0 && (
        <div className="w-full min-w-0">
          <StepByStepSlider steps={data.steps} />
        </div>
      )}
      {!data.video?.url && !data.steps?.length && (
        <div className="rounded-lg flex items-center justify-center min-h-[200px] text-default-500">
          Nenhum vídeo ou passo a passo disponível para esta oferta
        </div>
      )}
    </div>
  );
};
