import { ChatBox } from "@/components/ChatBox";
import { ChatInterface } from "@/components/ChatInterface";
import { useAppSelector } from "@/redux/store";

export const UniqueChatPage = () => {
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);
  return (
    <ChatInterface>
      <div className="h-full w-full ">
        {activeChatId ? <ChatBox /> : <p className="text-center">No chats</p>}
      </div>
    </ChatInterface>
  );
};
