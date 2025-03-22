import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Play, Pause } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import chattyAi from "@/assets/chatty.png";
import { GoCopy } from "react-icons/go";
import { ModelsMenu } from "./ModelsMenu";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsTyping } from "@/redux/slice/chatSlice";
import { HiSpeakerWave } from "react-icons/hi2";
import { IoStopCircle } from "react-icons/io5";

interface MessageType {
  image?: string;
  id: number;
  text: string;
  type: string;
  timestamp: string;
}

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
  const [copied, setCopied] = useState(false);
  const [showFormatted, setShowFormatted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const dispatch = useAppDispatch();
  const { isTyping, aiLoading } = useAppSelector((state) => state.chat);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const activeChat = useAppSelector((state) =>
    state.chat.chats.find((chat) => chat.id === state.chat.activeChatId)
  );

  const lastAiMessage = activeChat?.messages
    .slice()
    .reverse()
    .find((msg) => msg.type === "ai");

  const isLastAiMessage = lastAiMessage?.id === message.id;

  const codeBlockMatch = message.text.match(/```(\w+)?\n([\s\S]*?)```/);
  const isCode = !!codeBlockMatch;
  const codeLanguage = codeBlockMatch?.[1] || "plaintext";
  const codeContent = codeBlockMatch?.[2] || message.text;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!speechRef.current) {
      speechRef.current = new SpeechSynthesisUtterance(message.text);
      speechRef.current.onend = () => setIsSpeaking(false);
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.speak(speechRef.current);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    if (!isTyping && isLastAiMessage) {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isTyping, isLastAiMessage]);

  return (
    <div ref={messageRef}>
      {message.type === "ai" && (
        <div
          className="flex gap-2 justify-start items-start relative"
          onClick={() => setIsHovered(!isHovered)}
        >
          <img
            src={chattyAi}
            alt="AI"
            className="size-7 rounded-full border p-1"
          />
          <Card className="shadow-none py-0 rounded-2xl border-none max-w-2xl">
            <CardContent className="px-4 py-1">
              {isCode ? (
                <div className="relative flex flex-col">
                  <div className="flex justify-between items-center h-6 bg-gray-800 text-white px-2 rounded-t">
                    <span className="text-xs font-semibold">
                      {codeLanguage.toUpperCase()}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={copyToClipboard}
                          variant="ghost"
                          className="text-white h-full text-xs hover:bg-gray-700 flex items-center"
                        >
                          {copied ? (
                            <Check className="size-4 text-green-400" />
                          ) : (
                            <GoCopy />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                  </div>

                  <SyntaxHighlighter
                    language={codeLanguage}
                    style={atomDark}
                    wrapLongLines
                    className="rounded-b-md"
                  >
                    {codeContent.trim()}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="prose dark:prose-invert leading-[200%]">
                  {isLastAiMessage && !showFormatted ? (
                    <TypeAnimation
                      key={message.text}
                      sequence={[
                        () => {
                          dispatch(setIsTyping(true));
                        },
                        message.text,
                        () => {
                          dispatch(setIsTyping(false));
                          setShowFormatted(true);
                        }
                      ]}
                      speed={99}
                      cursor={false}
                      wrapper="span"
                    />
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}

                  {((isLastAiMessage && !isTyping && !aiLoading) ||
                    isHovered) && (
                    <div className="flex gap-2 items-center w-full mt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={copyToClipboard}
                            variant="ghost"
                            className="text-white h-full text-xs hover:bg-gray-700 flex items-center"
                          >
                            {copied ? (
                              <Check className="size-4 text-green-400" />
                            ) : (
                              <GoCopy />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>

                      {/* Voice Read Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={toggleSpeech}
                            variant="ghost"
                            className="text-white h-full text-xs hover:bg-gray-700 flex items-center"
                          >
                            {isSpeaking ? <IoStopCircle /> : <HiSpeakerWave />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Read aloud</TooltipContent>
                      </Tooltip>

                      <ModelsMenu />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
