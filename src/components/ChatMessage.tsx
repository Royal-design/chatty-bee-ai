import { MessageProps } from "@/redux/slice/chatSlice";
import { Message } from "./Message";

interface ChatMessageProps {
  messages: MessageProps[];
}

export const ChatMessage = ({ messages }: ChatMessageProps) => {
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
