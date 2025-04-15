import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { ChatMessage } from "./ChatMessage";
import { TextInput } from "./TextInput";
import { SuggestionBox } from "./SuggestionBox";
import { cn } from "@/lib/utils";

export const ChatBox = () => {
  const { chats, activeChatId, isSidebarOpen, reloadMessages } = useAppSelector(
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
    <div className="h-full w-full flex flex-col ">
      {messages.length > 0 ? (
        <div
          ref={chatContainerRef}
          className="pt-2 h-full px-4 overflow-auto w-full mb-4 flex justify-center scrollbar-hidden"
        >
          <div
            className={cn(
              "md:w-full lg:w-2xl w-full",
              isSidebarOpen ? "md:w-full" : "md:w-xl"
            )}
          >
            <ChatMessage
              messages={messages}
              scrollToBottom={scrollToBottom}
              showScrollButton={showScrollButton}
            />
          </div>
        </div>
      ) : (
        <div className="mb-4 mt-[10rem]">
          <h2 className="text-2xl  text-center">What can I help you with?</h2>
        </div>
      )}

      <div
        className={cn(
          "pb-[2rem] bg-background  fixed bottom-0 w-full transition-[left] duration-200 px-4 flex flex-col items-center justify-center",
          isSidebarOpen ? "md:left-32 lg:left-35" : "md:left-0"
        )}
      >
        <div
          className={cn(
            isSidebarOpen ? "md:w-lg" : "md:w-xl",
            "lg:w-2xl w-full"
          )}
        >
          <TextInput scrollToBottom={scrollToBottom} />
          <SuggestionBox />
          <div className="flex justify-center mt-4">
            <small className="text-center text-text-light w-full">
              ChattyBee can make mistake. Check important info
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
