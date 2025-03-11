import { useAppSelector } from "@/redux/store";
import { Message } from "./Message";

export const ChatMessage = () => {
  const { chats, activeChatId } = useAppSelector((state) => state.chat);
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  return (
    <div className="">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
