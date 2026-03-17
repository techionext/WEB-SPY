const validationRules = [
  { rule: /[A-Z]/, message: "Pelo menos uma letra maiúscula" },
  { rule: /[a-z]/, message: "Pelo menos uma letra minúscula" },
  { rule: /[0-9]/, message: "Pelo menos um número" },
  { rule: /[#?!@$%^&*-]/, message: "Pelo menos um caractere especial" },
  { rule: /.{8,}/, message: "Pelo menos 8 caracteres" },
];

export const calculateProgress = (password?: string) => {
  if (!password) return 0;
  let passedRules = 0;
  validationRules.forEach(({ rule }) => {
    if (rule.test(password)) passedRules++;
  });

  return (passedRules / validationRules.length) * 100;
};

export const getProgressColor = (value: number) => {
  if (value < 25) return "from-red-500 to-red-400";
  if (value < 50) return "from-red-400 to-yellow-400";
  if (value < 75) return "from-yellow-400 to-green-400";
  return "from-green-400 to-green-500";
};

export const validatePassword = (password: string) => {
  if (!password) {
    return validationRules.map(({ message }) => ({
      message,
      isValid: false,
    }));
  }

  return validationRules.map(({ rule, message }) => ({
    message,
    isValid: rule.test(password),
  }));
};
