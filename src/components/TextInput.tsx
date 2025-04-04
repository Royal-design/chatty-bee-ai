import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { RiAddLine, RiArrowUpLine, RiCloseCircleFill } from "react-icons/ri";
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
        className="relative w-full rounded flex items-center"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  {/* Image Preview with Close Button */}
                  {imageUrl && (
                    <div className="absolute top-2 left-4 flex items-center gap-2 p-1 px-2 rounded-md">
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
                        className="rounded-full size-3 absolute top-[-5px] right-1 hover:bg-transparent border dark:border-gray-100 bg-transparent"
                      >
                        <RiCloseCircleFill className="size-6 dark:text-white text-black" />
                      </button>
                    </div>
                  )}

                  <Textarea
                    placeholder="Ask anything"
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      textInputRef.current = el;
                    }}
                    className={`w-full p-4 pl-10 max-h-[10rem] rounded-4xl resize-none overflow-y-auto scrollbar-hidden ${
                      imageUrl
                        ? "md:pt-20 pt-17 min-h-[10rem]"
                        : "md:pt-4 pt-2 min-h-[7rem]"
                    }`}
                    onChange={(e) => {
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

        <div className="flex items-center justify-between absolute px-4 bottom-3 w-full">
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
            className="rounded-full border shrink-0 size-9"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "⏳" : <RiAddLine className="size-5" />}
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
