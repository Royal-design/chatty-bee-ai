import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { ChatMessage } from "./ChatMessage";
import { TextInput } from "./TextInput";
import { SuggestionBox } from "./SuggestionBox";

export const ChatBox = () => {
  const { chats, activeChatId, aiLoading, reloadMessages } = useAppSelector(
    (state) => state.chat
  );

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || chats[0] || null;
  const messages = activeChat ? activeChat.messages : [];
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const [prevMessageCount, setPrevMessageCount] = useState(messages.length);
  const [showScrollButton, setShowScrollButton] = useState(false);
  // Scroll to bottom function
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const isAtBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop <=
        chatContainer.clientHeight + 10;

      setShowScrollButton(!isAtBottom);
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const newMessageArrived = messages.length > prevMessageCount;
    setPrevMessageCount(messages.length);

    if (newMessageArrived && !isUserScrolling.current) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [reloadMessages]);

  return (
    <div className="h-full w-full flex md:justify-center justify-between flex-col">
      {messages.length > 0 ? (
        <div
          ref={chatContainerRef}
          className="py-2 h-full px-4 overflow-auto w-full mb-4 flex justify-center scrollbar-hidden"
        >
          <div className="lg:w-2xl w-full">
            <ChatMessage
              messages={messages}
              scrollToBottom={scrollToBottom}
              showScrollButton={showScrollButton}
            />

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
        <div className="mb-4 mt-[10rem] md:mt-0">
          <h2 className="text-2xl  text-center">What can I help you with?</h2>
        </div>
      )}

      <div className="pb-[5rem]  px-4 flex flex-col items-center justify-center">
        <div className="lg:w-2xl w-full">
          <TextInput scrollToBottom={scrollToBottom} />
          <SuggestionBox />
        </div>
      </div>
    </div>
  );
};
