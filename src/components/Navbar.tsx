import chattyAi from "@/assets/chatty.png";
import { MenuBox } from "./MenuBox";
import { useAppSelector } from "@/redux/store";
import { Button } from "./ui/button";
import { SelectModel } from "./SelectModel";
import { ReactElement } from "react";
import { cn } from "@/lib/utils";
type ChildrenProps = {
  children?: ReactElement;
};
export const Navbar = ({ children }: ChildrenProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const isSidebarOpen = useAppSelector((state) => state.chat.isSidebarOpen);
  return (
    <div
      className={cn(
        "z-50  py-1 p-2 md:px-8  w-full border-b items-center flex justify-between",
        "fixed top-0 bg-background transition-[left]",
        isSidebarOpen ? " md:pr-75" : "md:left-0 "
      )}
    >
      {children}
      <figure className="flex items-center gap-2">
        <img
          src={chattyAi}
          alt="chatty"
          className="size-12 rounded-full border p-2"
        />
        <SelectModel />
      </figure>
      <div className="">
        {user ? (
          <MenuBox />
        ) : (
          <div className=" flex items-center gap-2">
            <Button className="rounded-3xl text-sm md:text-base ">
              Log in
            </Button>
            <Button
              variant="ghost"
              className="rounded-3xl text-sm md:text-base  border"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
