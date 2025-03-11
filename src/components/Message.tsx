import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "lucide-react";
import chattyAi from "@/assets/chatty.png";

interface MessageType {
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

  // Detect code block & extract language
  const codeBlockMatch = message.text.match(/```(\w+)?\n([\s\S]*?)```/);
  const isCode = !!codeBlockMatch;
  const codeLanguage = codeBlockMatch?.[1] || "plaintext";
  const codeContent = codeBlockMatch?.[2] || message.text;

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {message.type === "user" && (
        <div className="flex justify-end">
          <Card className="shadow-sm py-0 rounded-2xl max-w-md">
            <CardContent className="px-5 py-2">
              <p>{message.text}</p>
            </CardContent>
          </Card>
        </div>
      )}
      {message.type === "ai" && (
        <div className="flex gap-1 justify-start">
          <img
            src={chattyAi}
            alt="ai"
            className="size-8 rounded-full border p-1"
          />
          <Card className="shadow-none py-0 rounded-none border-none w-2xl">
            <CardContent className="px-2 ">
              {isCode ? (
                <div className="relative">
                  {/* Code Language Header */}
                  <div className="flex justify-between items-center bg-gray-800 text-white px-4  rounded-t">
                    <span className="text-sm font-semibold">
                      {codeLanguage.toUpperCase()}
                    </span>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      className="text-white hover:bg-gray-700"
                    >
                      <Clipboard className="size-4" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  {/* Syntax Highlighter */}
                  <SyntaxHighlighter
                    language={codeLanguage}
                    style={dracula}
                    wrapLongLines
                  >
                    {codeContent.trim()}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="prose">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
