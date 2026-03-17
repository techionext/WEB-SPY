export const convertToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

    const value = data[key];

    if (value === undefined || value === null || value === "") continue;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            formData.append(key, String(item));
          }
        });
      }
      continue;
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, String(value));
  }

  return formData;
};
