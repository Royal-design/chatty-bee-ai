import { MessageProps } from "@/redux/slice/chatSlice";
import { Message } from "./Message";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";

interface ChatMessageProps {
  messages: MessageProps[];
  showScrollButton: boolean;
  scrollToBottom: () => void;
}

export const ChatMessage = ({
  messages,
  scrollToBottom,
  showScrollButton
}: ChatMessageProps) => {
  const { isSidebarOpen, aiLoading } = useAppSelector((state) => state.chat);

  return (
    <div className="flex flex-col w-full pb-[12rem] pt-[4rem]  gap-8">
      {messages.map((message) => (
        <div key={message.id}>
          <Message message={message} />
        </div>
      ))}
      {aiLoading && (
        <div className="flex justify-center mt-2">
          <p className="text-sm text-text-light animate-pulse">
            AI is thinking...
          </p>
        </div>
      )}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className={cn(
            "fixed bottom-[15rem] z-10 left-1/2 size-6 p-2 dark:bg-black bg-white border dark:border-white border-black dark:hover:bg-black  hover:bg-white rounded-full shadow-lg flex items-center justify-center duration-150 transition-[left] duration-300",
            isSidebarOpen ? "md:left-[58%]" : "md:left-1/2"
          )}
        >
          <ArrowDown className="size-3 dark:text-white text-black" />
        </Button>
      )}
    </div>
  );
};
