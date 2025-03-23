import { useEffect, useMemo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "./ui/sidebar";
import { TbMessageCirclePlus } from "react-icons/tb";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  createNewChat,
  deleteChat,
  setActiveChat
} from "@/redux/slice/chatSlice";
import { Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "@/utilities/formatTime";
import { Navbar } from "./Navbar";
import { SearchDialog } from "./SearchDialog";
import { Input } from "./ui/input";
import { SearchSkeleton } from "./SearchSkeleton";

export const ChatInterface = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { chats, activeChatId } = useAppSelector((state) => state.chat);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Group chats by date
  const groupedChats = useMemo(() => {
    const groups: Record<string, typeof chats> = {};

    chats
      .slice()
      .sort((a, b) => {
        const lastMessageA =
          a.messages.length > 0
            ? new Date(a.messages[a.messages.length - 1].timestamp).getTime()
            : 0;
        const lastMessageB =
          b.messages.length > 0
            ? new Date(b.messages[b.messages.length - 1].timestamp).getTime()
            : 0;
        return lastMessageB - lastMessageA;
      })
      .forEach((chat) => {
        const dateLabel = formatTime(chat.timestamp);
        if (!groups[dateLabel]) {
          groups[dateLabel] = [];
        }
        groups[dateLabel].push(chat);
      });

    return groups;
  }, [chats]);

  // 🔹 Fixed: Compute filtered chats only when searchQuery changes
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return groupedChats;

    return Object.entries(groupedChats).reduce((acc, [dateLabel, chats]) => {
      const filtered = chats.filter((chat) =>
        chat.messages.some((msg) =>
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      if (filtered.length > 0) {
        acc[dateLabel] = filtered;
      }

      return acc;
    }, {} as Record<string, typeof chats>);
  }, [groupedChats, searchQuery]);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <Sidebar collapsible="offcanvas" className="max-w-md">
        <SidebarHeader className="border-b dark:border-slate-800 md:hidden">
          <h2 className="text-lg font-semibold text-center">Chat Menu</h2>
        </SidebarHeader>
        <SidebarHeader className="border-b dark:border-slate-800">
          <div className="flex justify-end">
            <div className="md:block hidden">
              <SearchDialog groupedChats={filteredChats} />
            </div>
            <div className="md:hidden">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => dispatch(createNewChat())}
              variant="ghost"
              className="cursor-pointer shrink-0"
            >
              <TbMessageCirclePlus className="size-6" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-background text-primary">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <SearchSkeleton key={i} />
                    ))}
                  </div>
                ) : Object.keys(filteredChats).length === 0 ? (
                  <p className="text-gray-500 p-4">No matching chats found.</p>
                ) : (
                  Object.entries(filteredChats).map(([dateLabel, chats]) => (
                    <div key={dateLabel}>
                      <p className="font-semibold text-gray-500">{dateLabel}</p>
                      <div className="flex flex-col gap-2">
                        {chats.map((chat) => (
                          <SidebarMenuItem
                            key={chat.id}
                            className={`flex flex-col hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition ${
                              activeChatId === chat.id
                                ? "bg-gray-200 dark:bg-gray-700"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <SidebarMenuButton
                                onClick={() => {
                                  dispatch(setActiveChat(chat.id));
                                  navigate(`/chats/${chat.id}`);
                                }}
                                className="flex-grow hover:bg-transparent active:bg-transparent flex items-center gap-2 p-2"
                              >
                                <span>
                                  {chat.messages[0]?.text || "New Chat"}
                                </span>
                              </SidebarMenuButton>

                              <button
                                onClick={() => dispatch(deleteChat(chat.id))}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="w-full text-primary border-t dark:border-slate-800 text-sm">
          <div className="flex justify-between items-center">
            <p>&copy; Emmanuel {new Date().getFullYear()}</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <main className="w-full max-h-screen h-screen overflow-clip">
        <div className="flex items-center md:hidden">
          <Navbar>
            <SidebarTrigger />
          </Navbar>
        </div>
        {isSidebarOpen ? (
          <div className="hidden md:block">
            <SidebarTrigger className="fixed left-2 z-10 top-4" />
            <Navbar />
          </div>
        ) : (
          <div className="hidden md:flex items-center">
            <Navbar>
              <SidebarTrigger />
            </Navbar>
          </div>
        )}
        {children}
      </main>
    </SidebarProvider>
  );
};
