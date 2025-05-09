import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TfiReload } from "react-icons/tfi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setModel, regenerateAIMessage } from "@/redux/slice/chatSlice";
import { generateAIResponse } from "@/Api/model";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const ModelsMenu = () => {
  const dispatch = useAppDispatch();
  const currentModel = useAppSelector((state) => state.chat.model);
  const lastUserMessage = useAppSelector((state) => state.chat.lastUserMessage);

  const handleModelChange = async (newModel: string) => {
    if (newModel !== currentModel) {
      dispatch(setModel(newModel));

      setTimeout(async () => {
        if (lastUserMessage) {
          const aiResponse = await generateAIResponse(
            lastUserMessage,
            newModel
          );

          dispatch(regenerateAIMessage(aiResponse));
        }
      }, 100);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 text-xs">
        <Tooltip>
          <TooltipTrigger asChild>
            <TfiReload />
          </TooltipTrigger>
          <TooltipContent>Reload</TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleModelChange("gemini-2.0-flash")}>
          <span>gemini-2.0-flash</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleModelChange("gemini-2.0-flash-lite")}
        >
          <span>gemini-2.0-flash-lite</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleModelChange("gemini-1.5-flash-8b")}
        >
          <span>gemini-1.5-flash-8b</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleModelChange("gemini-1.5-flash")}>
          <span>gemini-1.5-flash</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>Current: {currentModel}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
