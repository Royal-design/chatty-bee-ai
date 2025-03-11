import { useAppSelector } from "@/redux/store";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { TextInput } from "./TextInput";
import { useEffect, useRef } from "react";

export const ChatBox = () => {
  const { chats, activeChatId, aiLoading } = useAppSelector(
    (state) => state.chat
  );

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  const messages = activeChat ? activeChat.messages : [];
  return (
    <div className="h-full flex flex-col">
      <div className="border-b h-12 flex items-center">
        <ChatHeader />
      </div>
      {messages.length > 0 ? (
        <div className="h-full py-2 px-16 overflow-auto scrollbar-hidden">
          <ChatMessage />
          <div ref={messagesEndRef}></div>
          {aiLoading && <p>Loading...</p>}
        </div>
      ) : (
        <div className="mt-[10rem] mb-4">
          <h2 className="text-4xl text-center">What can I help you with?</h2>
        </div>
      )}

      <div className="pb-4 px-16">
        <TextInput />
      </div>
    </div>
  );
};
