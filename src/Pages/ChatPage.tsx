import { generateAIResponse } from "@/Api/model";
import { ChatBox } from "@/components/ChatBox";
import { ChatInterface } from "@/components/ChatInterface";
import { SuggestionBox } from "@/components/SuggestionBox";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { addMessage, setAiLoading } from "@/redux/slice/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toast } from "sonner";

export const ChatPage = () => {
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);
  const { model, suggestions = [] } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const handleClick = async (text: string) => {
    if (!(text?.trim() || "")) return;

    dispatch(
      addMessage({
        text: text || "",
        type: "user"
      })
    );
    dispatch(setAiLoading(true));
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
    <ChatInterface>
      <div className="h-full w-full p-2">
        {activeChatId ? (
          <ChatBox />
        ) : (
          <div className="flex items-center  justify-center  h-full w-full">
            <div className="w-2xl max-md:w-full">
              <div className="w-full">
                <TextInput />
                {suggestions.length > 0 ? (
                  <SuggestionBox />
                ) : (
                  <div className=" mt-4 flex justify-center flex-wrap gap-2 w-full">
                    <Button
                      onClick={() => handleClick("make a life goal plan")}
                      className="text-xs rounded-3xl p-3 h-4"
                    >
                      Make a plan
                    </Button>
                    <Button
                      onClick={() =>
                        handleClick("Explain how summarizer works")
                      }
                      className="text-xs rounded-3xl p-3 h-4 "
                    >
                      Summarize
                    </Button>
                    <Button
                      onClick={() =>
                        handleClick("Explain how translation works")
                      }
                      className="text-xs rounded-3xl p-3 h-4 "
                    >
                      Translate
                    </Button>
                    <Button
                      onClick={() =>
                        handleClick("Explain programming language in general")
                      }
                      className="text-xs rounded-3xl p-3 h-4 "
                    >
                      Write code
                    </Button>
                    <Button
                      onClick={() =>
                        handleClick("Explain other things you can do")
                      }
                      className="text-xs rounded-3xl p-3 h-4 "
                    >
                      More
                    </Button>
                  </div>
                )}
                <div className="flex justify-center mt-4">
                  <small className="text-center w-full">
                    ChattyBee can make mistake. Check important info
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatInterface>
  );
};
