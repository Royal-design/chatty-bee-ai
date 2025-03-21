import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { RiAddLine, RiArrowUpLine, RiCloseCircleFill } from "react-icons/ri";
import { inputSchema, InputSchema } from "@/schema/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAIResponse } from "@/Api/model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addMessage, setAiLoading } from "@/redux/slice/chatSlice";
import { PiWaveformBold } from "react-icons/pi";
import { BsFillStopFill } from "react-icons/bs";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY;

interface TextInputProps {
  scrollToBottom?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({ scrollToBottom }) => {
  const dispatch = useAppDispatch();
  const { model, isTyping, aiLoading } = useAppSelector((state) => state.chat);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });

  const textValue = form.watch("text");

  const onSubmit = async (data: InputSchema) => {
    if (!data.text.trim() && !imageUrl) return;

    dispatch(
      addMessage({
        text: data.text,
        image: imageUrl,
        type: "user"
      })
    );
    dispatch(setAiLoading(true));

    try {
      form.reset();
      setImageUrl(undefined);
      scrollToBottom?.();

      // ✅ Pass text or image as input
      const aiResponse = await generateAIResponse(
        imageUrl ? { url: imageUrl, type: "image" } : data.text,
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
    } finally {
      dispatch(setAiLoading(false));
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
      console.log("Uploaded Image URL:", uploadedImageUrl);
      setImageUrl(uploadedImageUrl);
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
                        onClick={() => setImageUrl(undefined)}
                        className=" rounded-full size-3 absolute top-[-5px] right-1 hover:bg-transparent border dark:border-gray-100 bg-transparent"
                      >
                        <RiCloseCircleFill className="size-6 dark:text-white text-black" />
                      </button>
                    </div>
                  )}

                  <Textarea
                    placeholder="Type or speak your message..."
                    {...field}
                    className={`w-full p-4 pl-10 max-h-[15rem] rounded-4xl resize-none overflow-y-auto scrollbar-hidden ${
                      imageUrl
                        ? "md:pt-20 min-h-[12rem]"
                        : "md:pt-6 pt-10 min-h-[8rem]"
                    }`}
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
            disabled={form.formState.isSubmitting}
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
