import { usePostSpyCreativeTranscriptionMutation } from "@/services/spy/spy-creative.service";
import { ISpyCreative } from "@/types/spy/spy-creative.type";
import { Button, Card, CardBody, CardProps, Image, Skeleton, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import ReactPlayer from "react-player";
import { getExtension } from "./helper/get-extension";

export const CreativeCard = ({ data, ...props }: { data: ISpyCreative } & CardProps) => {
  const [transcribe, { isLoading }] = usePostSpyCreativeTranscriptionMutation();

  const handleTranscription = async () => {
    try {
      const response = await transcribe({ id: data.id }).unwrap();

      if (!response?.url) {
        throw new Error("URL de download não encontrada.");
      }

      const fileResponse = await fetch(response.url);
      const blob = await fileResponse.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `transcription-${response.id}.${getExtension(response.mimeType)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {}
  };

  return (
    <Card className="transition-colors card" radius="lg" {...props}>
      <CardBody className="flex flex-col p-0 h-full aspect-[9/16]">
        <Tooltip content={`Total de creativos: ${data.totalCreatives}`} placement="top">
          <Button
            title="transcription"
            isIconOnly
            radius="full"
            size="sm"
            className="absolute top-2 left-2 z-50 cursor-auto text-tiny"
          >
            {data.totalCreatives}
          </Button>
        </Tooltip>
        <Tooltip content="Download da transcrição do vídeo" placement="top">
          <Button
            title="transcription"
            isIconOnly
            radius="full"
            size="sm"
            className="absolute top-2 right-2 z-50"
            onPress={() => {
              handleTranscription();
            }}
            isLoading={isLoading}
          >
            <Icon icon="solar:microphone-large-bold-duotone" />
          </Button>
        </Tooltip>
        <div className="w-full h-full bg-content1 overflow-hidden">
          {data?.image?.mimeType === "video/mp4" ? (
            <ReactPlayer
              autoPlay={false}
              muted
              controls
              loop
              poster={data?.thumbnail?.url || ""}
              // className="w-full h-full object-cover rounded-b-none bg-black"
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "16/9",
                minHeight: "100%",
                objectFit: "cover",
              }}
              src={data.image.url}
            />
          ) : (
            <Image
              removeWrapper
              src={data?.image?.url}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium">{data.title}</p>
            <Tooltip content={data.category.title}>
              <p className="text-xs text-gray-500 truncate max-w-[100px]">{data.category.title}</p>
            </Tooltip>
          </div>
          <Icon icon={`logos:${data.trafficNetwork.toLowerCase()}`} />
        </div>
      </CardBody>
    </Card>
  );
};

export const CreativeCardLoading = () => {
  return (
    <Card className="card" radius="lg">
      <CardBody className="flex flex-col p-0 h-full aspect-[9/16]">
        <Skeleton className="size-6 rounded-full absolute top-2 left-2 z-50" />
        <Skeleton className="size-6 rounded-full absolute top-2 right-2 z-50" />
        <div className="w-full h-full bg-content1">
          <Skeleton className="w-full h-full !bg-content1" />
        </div>
        <div className="flex items-center justify-between p-4 h-[68px]">
          <div className="flex flex-col w-full gap-1">
            <Skeleton className="w-[70%] rounded-md !bg-content1 h-4">
              <p className="text-sm font-medium" />
            </Skeleton>
            <Skeleton className="w-[50%] rounded-md !bg-content1 h-3">
              <p className="text-xs text-gray-500" />
            </Skeleton>
          </div>
          <Skeleton className="size-6 rounded-full !bg-content1 min-w-6" />
        </div>
      </CardBody>
    </Card>
  );
};
