import { useMemo, useState } from "react";
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

export const ChatInterface = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const { chats, activeChatId } = useAppSelector((state) => state.chat);

  // Function to group chats by timestamp (Today, Yesterday, etc.)
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

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <Sidebar collapsible="offcanvas" className="max-w-md">
        <SidebarHeader className="border-b dark:border-slate-800  md:hidden">
          <h2 className="text-lg font-semibold text-center">Chat Menu</h2>
        </SidebarHeader>
        <SidebarHeader className="border-b   dark:border-slate-800 ">
          <div className=" flex justify-end">
            <SearchDialog groupedChats={groupedChats} />
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
              <SidebarMenu className="">
                {Object.entries(groupedChats).map(([dateLabel, chats]) => (
                  <div key={dateLabel}>
                    <p className="font-semibold text-gray-500">{dateLabel}</p>
                    <div className="flex flex-col gap-2">
                      {chats.map((chat) => (
                        <SidebarMenuItem
                          key={chat.id}
                          className={`flex flex-col hover:bg-gray-200  dark:hover:bg-gray-700 rounded transition ${
                            activeChatId === chat.id
                              ? "bg-gray-200  dark:bg-gray-700"
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
                                Chat - {chat.messages[0]?.text || "New Chat"}
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
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="w-full text-primary border-t dark:border-slate-800 text-sm">
          <div className="flex justify-between items-center"></div>
        </SidebarFooter>
      </Sidebar>
      <main className="w-full max-h-screen overflow-clip ">
        <div className="flex items-center md:hidden">
          <Navbar>
            <SidebarTrigger className="" />
          </Navbar>
        </div>
        {isSidebarOpen ? (
          <div className=" items-center hidden md:block">
            <SidebarTrigger className="fixed left-2 z-10 top-4" />
            <Navbar />
          </div>
        ) : (
          <div className="hidden md:flex items-center ">
            <Navbar>
              <SidebarTrigger className="" />
            </Navbar>
          </div>
        )}
        {children}
      </main>
    </SidebarProvider>
  );
};
