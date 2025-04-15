import { ChatInterface } from "@/components/ChatInterface";
import {
  FaRocket,
  FaComments,
  FaLanguage,
  FaBookOpen,
  FaBolt
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

export const AboutPage = () => {
  return (
    <ChatInterface>
      <div className="max-w-3xl mx-auto bg-background h-screen p-6 overflow-auto scrollbar-hidden">
        <h1 className="text-xl font-bold text-primary mb-4">
          About ChattyBee AI 🐝
        </h1>
        <p className="text-base text-text-light mb-6">
          Welcome to <span className="font-semibold">ChattyBee AI</span>, your
          intelligent and interactive AI-powered assistant! 🚀 Whether you need
          real-time AI conversations, translations, or text summarization,
          ChattyBee AI is here to help.
        </p>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex items-center space-x-4">
            <FaComments className="text-primary text-xl" />
            <p className="text-base">
              <strong>AI Conversations:</strong> Get intelligent responses
              instantly.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <FaLanguage className="text-primary text-xl" />
            <p className="text-base">
              <strong>Text Translation:</strong> Communicate in multiple
              languages.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <FaBookOpen className="text-primary text-xl" />
            <p className="text-base">
              <strong>Text Summarization:</strong> Quickly condense long texts.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <FaBolt className="text-primary text-xl" />
            <p className="text-base">
              <strong>Seamless Experience:</strong> Instant, smooth chat
              responses.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-primary mb-4">
            How It Works? 🔧
          </h2>
          <ul className="text-base text-text-light space-y-3">
            <li>
              <strong>Type Your Message:</strong> Start chatting naturally.
            </li>
            <li>
              <strong>Choose a Language:</strong> Translate text effortlessly.
            </li>
            <li>
              <strong>Summarize Text:</strong> Get concise insights.
            </li>
            <li>
              <strong>AI-Powered Replies:</strong> Fast and intelligent
              responses.
            </li>
          </ul>
        </div>

        {/* Why ChattyBee? */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Why ChattyBee AI? 🚀
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-center space-x-4">
              <FaRocket className="text-primary text-xl" />
              <p className="text-base">
                <strong>Fast & Reliable</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <MdSupportAgent className="text-primary text-xl" />
              <p className="text-base">
                <strong>User-Friendly Interface</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaLanguage className="text-primary text-xl" />
              <p className="text-base">
                <strong>Supports Multiple Languages</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaBolt className="text-primary text-xl" />
              <p className="text-base">
                <strong>AI-Powered & Always Learning</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-primary">🌟 Let's Chat!</h2>
          <p className="text-base text-text-light mt-2">
            ChattyBee AI is here to make your conversations **smarter, easier,
            and more engaging**. Start chatting now and experience the power of
            AI! 🚀
          </p>
        </div>
      </div>
    </ChatInterface>
  );
};
