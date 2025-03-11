import { ChatBox } from "@/components/ChatBox";
import { ChatInterface } from "@/components/ChatInterface";
import { useAppSelector } from "@/redux/store";

export const UniqueChatPage = () => {
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);
  return (
    <ChatInterface>
      {activeChatId ? <ChatBox /> : <p>No chats</p>}
    </ChatInterface>
  );
};
