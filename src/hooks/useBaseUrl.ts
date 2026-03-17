import React from "react";

export const useBaseUrl = () => {
  const [baseUrl, setBaseUrl] = React.useState("https://analitycs.tred3.com");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  return baseUrl;
};
