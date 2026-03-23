import { Card, CardBody, Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Swiper, SwiperSlide } from "swiper/react";

export const OfferCommunity = () => {
  return (
    <div className="relative">
      <div className="flex flex-col max-w-[368px]  w-full gap-4 sticky top-[96px] ">
        <Card className="card min-w-[368px] h-[148px]" radius="lg">
          <CardBody className="flex flex-row items-center justify-center gap-4 p-0">
            <Image
              removeWrapper
              className="w-full h-full object-cover"
              src="/extesion.png"
              alt="Community"
            />
          </CardBody>
        </Card>
        <Card className="card w-full h-full min-w-[368px]" radius="lg">
          <CardBody className="flex flex-row items-center justify-center gap-4 p-6">
            <Button isIconOnly className="bg-black text-white" radius="full">
              <Icon icon={"ic:sharp-discord"} />
            </Button>
            <Button isIconOnly className="bg-black text-white" radius="full">
              <Icon icon={"ri:instagram-fill"} />
            </Button>
            <Button isIconOnly className="bg-black text-white" radius="full">
              <Icon icon={"mage:facebook"} />
            </Button>
          </CardBody>
        </Card>

        <div className="flex flex-col h-fit gap-4  ">
          <Swiper className="w-full grow">
            {Array.from({ length: 10 }).map((_, index) => (
              <SwiperSlide key={index} className="w-full grow">
                <Card fullWidth className="w-full card h-full" radius="lg">
                  <CardBody>
                    <Image
                      className="object-fill h-full"
                      removeWrapper
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_PR8zSi1-89ln6r73nLkjRs2vdEzwokUtsA&s"
                    />
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
