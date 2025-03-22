import { ChatBox } from "@/components/ChatBox";
import { ChatInterface } from "@/components/ChatInterface";
import { useAppSelector } from "@/redux/store";

export const ChatPage = () => {
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);
  return (
    <div className="h-full w-full">
      <ChatInterface>
        {activeChatId ? <ChatBox /> : <p> No chat</p>}
      </ChatInterface>
    </div>
  );
};
