import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootLayout } from "./Layouts/RootLayout";
import { ChatPage } from "./Pages/ChatPage";
import { PublicLayout } from "./Layouts/PublicLayout";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect } from "react";
import { checkAuthState, getUsers } from "./redux/slice/authSlice";
import { AboutPage } from "./Pages/AboutPage";
import { setUserId } from "./redux/slice/chatSlice";
import { applyTheme, getSystemTheme } from "./redux/slice/themeSlice";
import { HomePage } from "./Pages/HomePage";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { theme } = useAppSelector((state) => state.theme);

  // Set user ID in chat slice only when user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(setUserId(user.id));
    }
  }, [dispatch, user?.id]);

  // Fetch authentication state and user list on mount
  useEffect(() => {
    dispatch(checkAuthState());
    dispatch(getUsers());
  }, [dispatch]);

  // Handle theme application logic
  useEffect(() => {
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const handleSystemThemeChange = () => {
      const newTheme = getSystemTheme();
      applyTheme(newTheme);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={user ? <ChatPage /> : <HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/:chatId" element={<ChatPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
