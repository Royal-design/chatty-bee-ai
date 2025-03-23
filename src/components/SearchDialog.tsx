import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { BiSearch } from "react-icons/bi";
import { Input } from "./ui/input";
import { PiChatsCircle } from "react-icons/pi";
import { SearchSkeleton } from "./SearchSkeleton";
import { setActiveChat } from "@/redux/slice/chatSlice";
import { useAppDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  timestamp: string;
  messages: Message[];
}

interface SearchDialogProps {
  groupedChats: Record<string, Chat[]>;
}

export const SearchDialog = ({ groupedChats }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔹 Filtered chats based on search query
  const filteredChats = Object.entries(groupedChats).reduce(
    (acc, [dateLabel, chats]) => {
      const filtered = chats.filter((chat) =>
        chat.messages.some((msg) =>
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      if (filtered.length > 0) {
        acc[dateLabel] = filtered;
      }

      return acc;
    },
    {} as Record<string, Chat[]>
  );

  return (
    <Dialog>
      <DialogTrigger className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition duration-200">
        <BiSearch className="size-6" />
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[90vw] md:w-[50vw] lg:w-[40vw] overflow-hidden rounded-lg shadow-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold">
            Search Chats
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Find a chat by keyword
          </DialogDescription>
        </DialogHeader>

        {/* 🔹 Search Input */}
        <Input
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* 🔹 Chat List */}
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-auto scrollbar-hidden pb-8 ">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <SearchSkeleton key={i} />
              ))}
            </div>
          ) : Object.keys(filteredChats).length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No matching chats found.
            </p>
          ) : (
            Object.entries(filteredChats).map(([dateLabel, chats]) => (
              <div key={dateLabel} className="space-y-2">
                <p className="font-semibold text-gray-500">{dateLabel}</p>
                <ul className="space-y-2">
                  {chats.map((chat) => (
                    <li
                      onClick={() => {
                        dispatch(setActiveChat(chat.id));
                        navigate(`/chats/${chat.id}`);
                      }}
                      key={chat.id}
                      className="p-3 flex gap-4 items-center border rounded-md cursor-pointer transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <PiChatsCircle className="size-6 text-primary" />
                      <div>
                        <span className="block font-medium">
                          {chat.messages[0]?.text || "New Chat"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(chat.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
