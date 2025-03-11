import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootLayout } from "./Layouts/RootLayout";
import { ChatPage } from "./Pages/ChatPage";
import { UniqueChatPage } from "./Pages/UniqueChatPage";
import { PublicLayout } from "./Layouts/PublicLayout";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect } from "react";
import { checkAuthState, getUsers } from "./redux/slice/authSlice";
import { AboutPage } from "./Pages/AboutPage";
import { setUserId } from "./redux/slice/chatSlice";
import { applyTheme, getSystemTheme, setTheme } from "./redux/slice/themeSlice";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      dispatch(setUserId(user.id));
    }
    dispatch(checkAuthState());
    dispatch(getUsers());
  }, [dispatch, user]);

  const { theme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      dispatch(setTheme("system"));
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme, dispatch]);

  // Listen for system theme changes if the user selected "system"
  useEffect(() => {
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme(getSystemTheme());
      }
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
        <Route path="/" element={<RootLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/:chatId" element={<UniqueChatPage />} />
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
