"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

import { useLazyAuthSessionQuery } from "@/services/user.service";
import { IUser } from "@/types/user.type";
import {
  publicRoutes,
  REDIRECT_SIGN_OUT_ROUTE,
  REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
} from "@/config/public-routes";
import { appConfig } from "@/config/app-config";
import { resetStateAction } from "@/libs/store";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hook";
import { api } from "@/libs/api";

interface SessionProviderProps {
  children: React.ReactNode;
}

type SessionContextType = {
  onSignOut: () => void;
  isLoading: boolean;
  user: IUser | null;
  academy: {
    news: number;
  };
};

export const SessionContext = createContext<SessionContextType>({
  onSignOut: () => {},
  isLoading: false,
  user: null,
  academy: {
    news: 0,
  },
});

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.session);
  const token = Cookies.get(appConfig.token);

  const hasPublicRoutes = publicRoutes.find((item) => pathname.startsWith(item.path));

  const [getSession, { isError, isLoading: getSessionLoading }] = useLazyAuthSessionQuery();

  const initiateSession = async () => {
    if (token) {
      if (hasPublicRoutes) {
        if (hasPublicRoutes.whenAuthenticated === "redirect") {
          window.location.href = "/spy";

          return;
        }
        await getSession(token);

        return;
      }
      await getSession(token);

      return;
    }
    if (hasPublicRoutes) {
      return;
    }

    if (process.env.NEXT_PUBLIC_ONLY_ACCESS_APP === "TRUE") {
      window.location.href = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_SSO_URL}${REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE}?appId=${process.env.NEXT_PUBLIC_SSO_APP_ID}`;
    }
  };

  useEffect(() => {
    initiateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSignOut = async () => {
    Cookies.remove(appConfig.token);
    dispatch(resetStateAction());
    dispatch(api.util.resetApiState());
    // Crisp.setTokenId();
    // Crisp.session.reset();

    if (process.env.NEXT_PUBLIC_ONLY_ACCESS_APP === "TRUE") {
      window.location.href = REDIRECT_SIGN_OUT_ROUTE;
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_SSO_URL}${REDIRECT_SIGN_OUT_ROUTE}?appId=${process.env.NEXT_PUBLIC_SSO_APP_ID}`;
    }
  };

  useEffect(() => {
    if (isError && !hasPublicRoutes) {
      onSignOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <SessionContext.Provider
      value={{
        onSignOut,
        isLoading: isLoading || getSessionLoading,
        user,
        academy: {
          news: 0,
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within the Session provider");
  }

  return context;
};

export default SessionProvider;
