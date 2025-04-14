import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { RiAddLine, RiArrowUpLine } from "react-icons/ri";
import { inputSchema, InputSchema } from "@/schema/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAIResponse, generateAISuggestions } from "@/Api/model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  addMessage,
  resetClearInput,
  setAiLoading,
  setSuggestions
} from "@/redux/slice/chatSlice";
import { PiWaveformBold } from "react-icons/pi";
import { BsFillStopFill } from "react-icons/bs";
import { toast } from "sonner";
import { IoIosClose } from "react-icons/io";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY;

interface TextInputProps {
  scrollToBottom?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({ scrollToBottom }) => {
  const dispatch = useAppDispatch();
  const { model, isTyping, clearInput, aiLoading, activeChatId } =
    useAppSelector((state) => state.chat);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(
    undefined
  );
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });
  useEffect(() => {
    if (clearInput) {
      form.reset();
      dispatch(resetClearInput());
    }
  }, [clearInput]);
  useEffect(() => {
    textInputRef.current?.focus();
  }, [activeChatId]);

  const textValue = form.watch("text") || "";

  const handleInputChange = (input: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const newTimer = setTimeout(async () => {
      if (input.trim()) {
        const aiSuggestions = await generateAISuggestions(input);
        dispatch(setSuggestions(aiSuggestions));
      } else {
        dispatch(setSuggestions([]));
      }
    }, 500);

    setDebounceTimer(newTimer);
  };

  const onSubmit = async (data: InputSchema) => {
    if (!(data.text?.trim() || "") && !imageBase64) return;

    dispatch(
      addMessage({
        text: data.text || "",
        image: imageUrl,
        type: "user"
      })
    );
    dispatch(setAiLoading(true));

    try {
      form.reset();
      setImageUrl(undefined);
      setImageBase64(undefined);
      setImageMimeType(undefined);
      scrollToBottom?.();

      const aiResponse = await generateAIResponse(
        imageBase64
          ? { base64: imageBase64, mimeType: imageMimeType || "image/png" }
          : data.text || "",
        model || "gemini-2.0-flash"
      );

      dispatch(
        addMessage({
          text: aiResponse,
          type: "ai"
        })
      );
    } catch (err) {
      console.error("Error generating AI response:", err);
      toast.success("Error generating AI response");
    } finally {
      dispatch(setAiLoading(false));
      dispatch(setSuggestions([]));
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setImageUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!response.data.success) throw new Error("Image upload failed");

      const uploadedImageUrl = response.data.data.url;
      setImageUrl(uploadedImageUrl);

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const mimeType = file.type;
        setImageBase64(base64Data.split(",")[1]);
        setImageMimeType(mimeType);
      };
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col w-full overflow-hidden px-4 rounded-4xl pt-2 border"
      >
        {imageUrl && (
          <div className="items-center pb-2 gap-2 relative px-2 rounded-md">
            <img
              src={imageUrl}
              alt="Preview"
              className="size-12 rounded-md object-cover"
            />
            <button
              onClick={() => {
                setImageUrl(undefined);
                setImageBase64(undefined);
                setImageMimeType(undefined);
              }}
              className="rounded-full dark:bg-gray-400 bg-black  absolute top-[-5px] left-[44px]"
            >
              <IoIosClose className="dark:text-black text-white" />
            </button>
          </div>
        )}

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full h-full">
              <FormControl>
                <div className="w-full">
                  <Textarea
                    placeholder="Ask anything"
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      textInputRef.current = el;
                    }}
                    className="resize-none overflow-y-auto scrollbar-hidden w-full  border-none rounded-md"
                    onChange={(e) => {
                      const el = e.target;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
                      field.onChange(e);
                      handleInputChange(e.target.value);
                    }}
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

        <div className="bg-background pb-2 justify-between flex  w-full">
          {/* Hidden file input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          {/* Add Image Button */}
          <Button
            className="rounded-full border bg-background hover:bg-transparent shrink-0 size-9"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "⏳" : <RiAddLine className="size-5 text-primary" />}
          </Button>

          {/* Send Message Button */}
          <Button
            className="border-none rounded-full border shrink-0 size-9"
            type="submit"
            disabled={
              form.formState.isSubmitting || (!textValue.trim() && !imageBase64)
            }
            aria-label="Send Message"
          >
            {isTyping || aiLoading ? (
              <BsFillStopFill className="size-5" />
            ) : textValue.trim().length > 0 || imageUrl ? (
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
