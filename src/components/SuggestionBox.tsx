import { generateAIResponse } from "@/Api/model";
import {
  addMessage,
  clearInput,
  setAiLoading,
  setSuggestions
} from "@/redux/slice/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

export const SuggestionBox = () => {
  const {
    chats,
    activeChatId,
    model,
    suggestions = []
  } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || chats[0] || null;
  const messages = activeChat ? activeChat.messages : [];

  const handleClick = async (text: string) => {
    if (!(text?.trim() || "")) return;

    dispatch(
      addMessage({
        text: text || "",
        type: "user"
      })
    );
    dispatch(setAiLoading(true));
    dispatch(clearInput());
    dispatch(setSuggestions([]));
    try {
      const aiResponse = await generateAIResponse(
        text || "",
        model || "gemini-2.0-flash"
      );
      dispatch(
        addMessage({
          text: aiResponse,
          type: "ai"
        })
      );
    } catch (error) {
      toast.error("An error occurred while processing your request");
    } finally {
      dispatch(setAiLoading(false));
    }
  };
  return (
    <div>
      <AnimatePresence>
        {suggestions.length > 0 && messages.length === 0 && (
          <div className="mt-2 text-sm lg:w-2xl w-full rounded-lg  shadow-md backdrop-blur-sm">
            {suggestions.map((suggestion, index) => (
              <motion.div
                onClick={() => handleClick(suggestion)}
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="py-2 px-3 text-gray-700 dark:text-gray-300 cursor-pointer 
                     hover:bg-gray-200/20 dark:hover:bg-gray-700/20 transition-all 
                     border-b border-gray-300/50 dark:border-gray-600/50 last:border-none"
              >
                {suggestion}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
