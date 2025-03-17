import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { IoIosSend } from "react-icons/io";
import { inputSchema, InputSchema } from "@/schema/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAIResponse } from "@/Api/model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addMessage, setAiLoading } from "@/redux/slice/chatSlice";

// Define props for the component
interface TextInputProps {
  scrollToBottom?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({ scrollToBottom }) => {
  const dispatch = useAppDispatch();
  const { model } = useAppSelector((state) => state.chat);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });

  const onSubmit = async (data: InputSchema) => {
    dispatch(addMessage({ text: data.text, type: "user" }));
    dispatch(setAiLoading(true));

    try {
      form.reset();
      if (scrollToBottom) {
        scrollToBottom();
      }

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
                    className="w-full p-4 pl-10 md:pt-7 pt-6 min-h-[5rem] max-h-[8rem] rounded-4xl resize-none overflow-y-auto scrollbar-hidden"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Send Button */}
        <Button
          variant="ghost"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary bg-transparent hover:bg-transparent"
          type="submit"
          disabled={form.formState.isSubmitting}
          aria-label="Send Message"
        >
          {form.formState.isSubmitting ? (
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <div className="bg-card border rounded-full p-2 hover:border-2 transition duration-100 dark:border-yellow-500">
              <IoIosSend className="size-6" />
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};
