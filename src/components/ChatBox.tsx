import { useAppSelector } from "@/redux/store";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { TextInput } from "./TextInput";
import { useEffect, useRef } from "react";

export const ChatBox = () => {
  const { chats, activeChatId, aiLoading } = useAppSelector(
    (state) => state.chat
  );

  // Ensure we are fetching the correct chat for the user
  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || chats[0] || null;
  const messages = activeChat ? activeChat.messages : [];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]); // Depend on `messages` and `activeChatId`

  return (
    <div className="h-full flex flex-col">
      <div className="border-b flex items-center">
        <ChatHeader />
      </div>

      {messages.length > 0 ? (
        <div className="py-2 h-full overflow-auto w-full mb-4 flex justify-center scrollbar-hidden">
          <div className="w-2xl">
            <ChatMessage />
            {/* <div ref={messagesEndRef}></div> */}
            {aiLoading && (
              <div className="flex justify-center mt-2">
                <p className="text-sm text-gray-500 animate-pulse">
                  AI is thinking...
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-[10rem] mb-4">
          <h2 className="text-4xl text-center">What can I help you with?</h2>
        </div>
      )}

      <div className="pb-4 flex justify-center">
        <div className="w-2xl">
          <TextInput />
        </div>
      </div>
    </div>
  );
};
