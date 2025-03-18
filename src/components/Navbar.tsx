import chattyAi from "@/assets/chatty.png";
import { MenuBox } from "./MenuBox";
import { useAppSelector } from "@/redux/store";
import { Button } from "./ui/button";
import { SelectModel } from "./SelectModel";
export const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="py-2 px-8 w-full items-center flex justify-between">
      <figure className="flex items-center gap-2">
        <img
          src={chattyAi}
          alt="chatty"
          className="size-12 rounded-full border p-2"
        />
        <SelectModel />
      </figure>
      {user ? (
        <MenuBox />
      ) : (
        <div className=" flex gap-2">
          <Button className="rounded-3xl">Log in</Button>
          <Button variant="ghost" className="rounded-3xl border">
            Sign up
          </Button>
        </div>
      )}
    </div>
  );
};
