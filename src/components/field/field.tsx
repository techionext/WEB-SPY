import { Input, InputProps } from "@heroui/react";

export const Field = (props: InputProps) => {
  return (
    <Input
      {...props}
      errorMessage={props?.errorMessage}
      isInvalid={!!props?.errorMessage}
      labelPlacement="outside"
    />
  );
};
