import { Input, InputProps } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

export const InputPassword = ({ ...props }: InputProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      endContent={
        <button type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <Icon
              className="text-default-400 pointer-events-none text-2xl"
              icon="solar:eye-closed-linear"
            />
          ) : (
            <Icon className="text-default-400 pointer-events-none text-2xl" icon="solar:eye-bold" />
          )}
        </button>
      }
      label="Senha"
      name="password"
      placeholder="Digite sua senha"
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
};
