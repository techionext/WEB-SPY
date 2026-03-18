import { configureStore, createAction } from "@reduxjs/toolkit";
import { api } from "./api";
import { logger } from "./logger";
import useSessionSlice from "@/features/session.slice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      session: useSessionSlice,
      [api.reducerPath]: api.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat([api.middleware]).concat(logger),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const resetStateAction = createAction("resetState");
