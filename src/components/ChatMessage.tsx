import { MessageProps } from "@/redux/slice/chatSlice";
import { Message } from "./Message";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

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
  return (
    <div className="flex flex-col w-full  gap-8">
      {messages.map((message) => (
        <div key={message.id}>
          <Message message={message} />
        </div>
      ))}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-[40%] z-10 left-1/2 size-6 p-2 dark:bg-black bg-white border dark:border-white border-black dark:hover:bg-black  hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        >
          <ArrowDown className="size-3 dark:text-white text-black" />
        </Button>
      )}
    </div>
  );
};
