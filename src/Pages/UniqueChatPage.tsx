import { ChatBox } from "@/components/ChatBox";
import { ChatInterface } from "@/components/ChatInterface";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/store";

export const UniqueChatPage = () => {
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);
  return (
    <ChatInterface>
      <div className="h-full w-full p-2">
        {activeChatId ? (
          <ChatBox />
        ) : (
          <div className="flex items-center  justify-center  h-full w-full">
            <div className="w-2xl">
              <div className="">
                <TextInput />
                <div className="grid mt-4 grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-2 w-full">
                  <Button className="text-xs rounded-3xl p-3 h-4 ">
                    Make a plan
                  </Button>
                  <Button className="text-xs rounded-3xl p-3 h-4 ">
                    Summarize
                  </Button>
                  <Button className="text-xs rounded-3xl p-3 h-4 ">
                    Translate
                  </Button>
                  <Button className="text-xs rounded-3xl p-3 h-4 ">
                    Write code
                  </Button>
                  <Button className="text-xs rounded-3xl p-3 h-4 ">More</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatInterface>
  );
};
