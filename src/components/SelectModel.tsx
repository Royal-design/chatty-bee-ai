import { setModel } from "@/redux/slice/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const models = [
  {
    id: 6,
    model: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
  },
  {
    id: 7,
    model: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
  },

  {
    id: 1,
    model: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
  },
  {
    id: 2,
    model: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
  },
];
export const SelectModel = () => {
  const dispatch = useAppDispatch();
  const model = useAppSelector((state) => state.chat.model);

  return (
    <Select
      value={model || undefined}
      onValueChange={(value) => dispatch(setModel(value))}
      defaultValue=""
    >
      <SelectTrigger className="md:w-40 border rounded-lg p-2">
        <SelectValue placeholder="Chatty Model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.model}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
