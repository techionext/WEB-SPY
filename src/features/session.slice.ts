import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { IUser } from "@/types/user.type";
// import { userSessionServices } from "@/services/user.service";
import { appConfig } from "@/config/app-config";
import { RootState } from "@/libs/store";
import { userSessionServices } from "@/services/user.service";

type SessionState = {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
};

const initialState = {
  user: null,
  token: null,
  isLoading: false,
} as SessionState;

const useSessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, { payload }: PayloadAction<{ user: IUser; token: string }>) => {
      if (payload.token) {
        Cookies.set(appConfig.token, payload.token, {
          expires: 365,
        });
      }

      return {
        ...state,
        user: payload.user,
        token: payload.token,
      };
    },
    resetUser: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userSessionServices.endpoints.authSession.matchPending, (state, {}) => {
      return {
        ...state,
        isLoading: !state?.user?.id ? true : false,
      };
    });

    builder.addMatcher(
      userSessionServices.endpoints.authSession.matchFulfilled,
      (state, { payload }) => {
        if (payload.token) {
          Cookies.set(appConfig.token, payload.token, {
            expires: 365,
          });
        }

        return {
          isLoading: false,
          token: payload.token,
          user: {
            ...payload.user,
          },
        };
      },
    );

    // builder.addMatcher(userSessionServices.endpoints.authLoginEmail.matchPending, (state, {}) => {
    //   return {
    //     ...state,
    //     isLoading: !state?.user?.id ? true : false,
    //   };
    // });

    // builder.addMatcher(
    //   userSessionServices.endpoints.authLoginEmail.matchFulfilled,
    //   (state, { payload }) => {
    //     if (payload.token) {
    //       Cookies.set(appConfig.token, payload.token, {
    //         expires: 365,
    //       });
    //     }

    //     return {
    //       isLoading: false,
    //       token: payload.token,
    //       user: {
    //         ...payload.user,
    //       },
    //     };
    //   },
    // );

    builder.addMatcher(userSessionServices.endpoints.authLogin.matchPending, (state) => {
      return {
        ...state,
        isLoading: !state?.user?.id ? true : false,
      };
    });

    builder.addMatcher(
      userSessionServices.endpoints.authLogin.matchFulfilled,
      (state, { payload }) => {
        if (payload.token) {
          Cookies.set(appConfig.token, payload.token, {
            expires: 365,
          });
        }

        return {
          isLoading: false,
          token: payload.token,
          user: {
            ...payload.user,
          },
        };
      },
    );
  },
});

export const { setSession } = useSessionSlice.actions;

export default useSessionSlice.reducer;

export const selectSession = (state: RootState) => state.session;
