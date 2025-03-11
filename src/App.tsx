import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootLayout } from "./Layouts/RootLayout";
import { ChatPage } from "./Pages/ChatPage";
import { UniqueChatPage } from "./Pages/UniqueChatPage";
import { PublicLayout } from "./Layouts/PublicLayout";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { useAppDispatch } from "./redux/store";
import { useEffect } from "react";
import { checkAuthState, getUsers } from "./redux/slice/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/:chatId" element={<UniqueChatPage />} />
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
