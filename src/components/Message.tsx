import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "lucide-react";

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
  const codeLanguage = codeBlockMatch?.[1] || "plaintext"; // Default to plaintext
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
          <Card className="shadow-sm rounded-sm w-sm">
            <CardContent>
              <p>{message.text}</p>
            </CardContent>
          </Card>
        </div>
      )}
      {message.type === "ai" && (
        <div className="flex justify-start">
          <Card className="shadow-sm rounded-sm w-sm p-3">
            <CardContent>
              {isCode ? (
                <div className="relative">
                  {/* Code Language Header */}
                  <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 rounded-t">
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
                <p>{message.text}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
