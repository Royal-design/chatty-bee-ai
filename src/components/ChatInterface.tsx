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
  setActiveChat,
  toggleSidebar
} from "@/redux/slice/chatSlice";
import { Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "@/utilities/formatTime";
import { Navbar } from "./Navbar";
import { SearchDialog } from "./SearchDialog";
import { Input } from "./ui/input";
import { SearchSkeleton } from "./SearchSkeleton";
import { MenuBox } from "./MenuBox";

export const ChatInterface = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { chats, activeChatId, isSidebarOpen } = useAppSelector(
    (state) => state.chat
  );
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
    <SidebarProvider
      open={isSidebarOpen}
      onOpenChange={() => dispatch(toggleSidebar())}
    >
      <Sidebar collapsible="offcanvas" className="max-w-md">
        <SidebarHeader className="md:hidden">
          <h2 className="text-lg font-semibold text-center">Chat Menu</h2>
          <div className="">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarHeader className="md:block hidden">
          <div className="flex justify-end">
            <div className="">
              <SearchDialog groupedChats={filteredChats} />
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

        <SidebarContent className="bg-background text-primary max-h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hidden space-y-2">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <SearchSkeleton key={i} />
                    ))}
                  </div>
                ) : Object.keys(filteredChats).length === 0 ? (
                  <p className="text-text-light p-4">
                    No matching chats found.
                  </p>
                ) : (
                  Object.entries(filteredChats).map(([dateLabel, chats]) => (
                    <div key={dateLabel}>
                      <p className="font-semibold mb-2 text-text-light">
                        {dateLabel}
                      </p>
                      <div className="flex flex-col gap-2">
                        {chats.map((chat) => (
                          <SidebarMenuItem
                            key={chat.id}
                            className={`flex flex-col  rounded transition-colors ${
                              activeChatId === chat.id
                                ? "bg-button-active-color  hover:bg-button-active-color"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <SidebarMenuButton
                                onClick={() => {
                                  dispatch(setActiveChat(chat.id));
                                  navigate(`/chats/${chat.id}`);
                                }}
                                className="flex-grow cursor-pointer hover:bg-transparent active:bg-transparent flex items-center gap-2 p-2"
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

        <SidebarFooter className="w-full text-primary border-t px-0 dark:border-slate-800 text-sm">
          <div className="md:hidden flex items-center p-1 gap-6 border-b pb-2 ">
            {user && <MenuBox />}
            <p className="text-base">{user?.name}</p>
          </div>

          <p className="text-center text-sm">
            &copy; Emmanuel {new Date().getFullYear()} - ChattyBee-AI
          </p>
        </SidebarFooter>
      </Sidebar>
      <main className="w-full h-screen max-h-screen overflow-clip ">
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
