import chattyAi from "@/assets/chatty.png";
import { MenuBox } from "./MenuBox";
export const Navbar = () => {
  return (
    <div className="py-2 px-8 w-full items-center flex justify-between">
      <figure>
        <img
          src={chattyAi}
          alt="chatty"
          className="size-12 rounded-full border p-2"
        />
      </figure>
      <div className="">
        <MenuBox />
      </div>
    </div>
  );
};
