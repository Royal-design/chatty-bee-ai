import { useAppSelector } from "@/redux/store";
import { Message } from "./Message";
import { useEffect, useRef } from "react";

export const ChatMessage = () => {
  const { chats, activeChatId } = useAppSelector((state) => state.chat);
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-8">
      {messages.map((message) => (
        <div key={message.id}>
          <Message message={message} />
        </div>
      ))}
    </div>
  );
};
