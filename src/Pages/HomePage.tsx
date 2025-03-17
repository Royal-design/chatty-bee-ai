import { AlertLoginDialog } from "@/components/AlertLoginDialog";
import { Navbar } from "@/components/Navbar";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const HomePage = () => {
  const [isAlertLoginOpen, setisAlertLoginOpen] = useState(true);

  return (
    <>
      <div className="w-full flex flex-col h-full">
        <div className="h-[200px]">
          <Navbar />
        </div>
        <div className="w-full flex justify-center  ">
          <div className="w-2xl">
            <TextInput />
            <div className="grid mt-4 grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 w-full">
              <Button className="text-xs rounded-3xl p-3 h-4 ">
                Make a plan
              </Button>
              <Button className="text-xs rounded-3xl p-3 h-4 ">
                Summarize
              </Button>
              <Button className="text-xs rounded-3xl p-3 h-4 ">
                Translate
              </Button>
              <Button className="text-xs rounded-3xl p-3 h-4 ">
                Write code
              </Button>
              <Button className="text-xs rounded-3xl p-3 h-4 ">More</Button>
            </div>
          </div>
        </div>
      </div>
      <AlertLoginDialog
        isAlertLoginOpen={isAlertLoginOpen}
        setisAlertLoginOpen={setisAlertLoginOpen}
      />
    </>
  );
};
