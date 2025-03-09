import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { chatSlice } from "./slice/chatSlice";
import { themeSlice } from "./slice/themeSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
    theme: themeSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
