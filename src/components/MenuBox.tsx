import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { GoSignOut } from "react-icons/go";
import { CiLight } from "react-icons/ci";
import { CiCircleInfo } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineNightlight } from "react-icons/md";
import { MdOutlineNightlightRound } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logoutUser } from "@/redux/slice/authSlice";
import { toast } from "sonner";
import { setTheme } from "@/redux/slice/themeSlice";

export const MenuBox = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  const user = useAppSelector((state) => state.auth.user);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const signOut = async () => {
    const response = await dispatch(logoutUser());
    if (response.success) {
      toast.success("User logged out successfully");
      navigate("/login");
    } else {
      toast.error(response.message || "Logout failed");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" rounded-full size-9 shrink-0 p-1 border">
        <p>{(user?.name && getInitials(user.name)) || "U"}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate("/about")}>
          <CiCircleInfo />
          <span>About ChattyBee</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex gap-2">
            <CiLight /> <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => dispatch(setTheme("system"))}>
                <MdLightMode />
                <span>System</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setTheme("light"))}>
                <MdOutlineNightlight />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setTheme("dark"))}>
                <MdOutlineNightlightRound />
                <span>Dark</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <GoSignOut />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
