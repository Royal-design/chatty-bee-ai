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
      <DialogTrigger className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
        <BiSearch className="size-6" />
      </DialogTrigger>
      <DialogContent className="h-[80%]">
        <DialogHeader>
          <DialogTitle>Search Chats</DialogTitle>
          <DialogDescription>Find a chat by keyword</DialogDescription>
        </DialogHeader>

        {/* 🔹 Search Input */}
        <Input
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="mt-4 space-y-2 h-[80%] overflow-auto scrollbar-hidden">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <SearchSkeleton key={i} />
              ))}
            </div>
          ) : Object.keys(filteredChats).length === 0 ? (
            <p className="text-gray-500">No matching chats found.</p>
          ) : (
            Object.entries(filteredChats).map(([dateLabel, chats]) => (
              <div key={dateLabel}>
                <p className="font-semibold text-gray-500">{dateLabel}</p>
                <ul className="space-y-2">
                  {chats.map((chat) => (
                    <li
                      onClick={() => {
                        dispatch(setActiveChat(chat.id));
                        navigate(`/chats/${chat.id}`);
                      }}
                      key={chat.id}
                      className="p-2 flex gap-4 items-center border rounded-md"
                    >
                      <PiChatsCircle className="size-6" />
                      <div className="">
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
