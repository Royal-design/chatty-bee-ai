import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
}

export const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const savedTheme = (localStorage.getItem("theme") as ThemeMode) || "system";

const initialState: ThemeState = {
  theme: savedTheme
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      applyTheme(action.payload);
    }
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

// Function to apply the theme to Tailwind
export const applyTheme = (theme: ThemeMode) => {
  if (theme === "system") {
    theme = getSystemTheme();
  }

  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};
