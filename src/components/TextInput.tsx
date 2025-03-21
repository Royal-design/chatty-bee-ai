import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { RiAddLine, RiArrowUpLine } from "react-icons/ri";
import { inputSchema, InputSchema } from "@/schema/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAIResponse } from "@/Api/model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addMessage, setAiLoading } from "@/redux/slice/chatSlice";
import { PiWaveformBold } from "react-icons/pi";
import { BsFillStopFill } from "react-icons/bs";

interface TextInputProps {
  scrollToBottom?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({ scrollToBottom }) => {
  const dispatch = useAppDispatch();
  const { model, isTyping, aiLoading } = useAppSelector((state) => state.chat);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });

  const textValue = form.watch("text");
  console.log(textValue);

  const onSubmit = async (data: InputSchema) => {
    if (!data.text.trim()) return;

    dispatch(addMessage({ text: data.text, type: "user" }));
    dispatch(setAiLoading(true));

    try {
      form.reset();
      scrollToBottom?.();

      const aiResponse = await generateAIResponse(
        data.text,
        model || "gemini-2.0-flash"
      );
      dispatch(addMessage({ text: aiResponse, type: "ai" }));
    } catch (err) {
      console.error("Error generating AI response:", err);
    } finally {
      dispatch(setAiLoading(false));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full rounded flex items-center"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Type or speak your message..."
                    {...field}
                    className="w-full p-4 pl-10 md:pt-7 pt-6 min-h-[7rem] max-h-[10rem] rounded-4xl resize-none overflow-y-auto scrollbar-hidden"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between absolute px-4 bottom-3 w-full">
          <Button className="rounded-full border shrink-0 size-9">
            <RiAddLine className="size-5" />
          </Button>
          <Button
            className="border-none rounded-full border shrink-0 size-9"
            type="submit"
            disabled={form.formState.isSubmitting}
            aria-label="Send Message"
          >
            {isTyping || aiLoading ? (
              <BsFillStopFill className="size-5" />
            ) : textValue.trim().length > 0 ? (
              <RiArrowUpLine className="size-5 font-bold" />
            ) : (
              <PiWaveformBold className="size-5 font-bold" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
