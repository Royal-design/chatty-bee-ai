import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface AlertLoginProps {
  isAlertLoginOpen: boolean;
  setisAlertLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AlertLoginDialog = ({
  isAlertLoginOpen,
  setisAlertLoginOpen
}: AlertLoginProps) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={isAlertLoginOpen} onOpenChange={setisAlertLoginOpen}>
      <AlertDialogContent className="rounded-3xl flex flex-col items-center gap-2 w-md p-12">
        <AlertDialogHeader className="flex flex-col items-center">
          <AlertDialogTitle className="text-2xl">
            Welcome back to ChattyBee!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl text-center">
            One step away from a smarter experience. Sign in to continue!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full mt-8">
          <div className=" flex gap-4 flex-col w-full">
            <AlertDialogCancel
              onClick={() => {
                navigate("/login");
              }}
              className="w-full rounded-3xl py-6"
            >
              Log in
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                navigate("/register");
              }}
              className="w-full rounded-3xl py-6"
            >
              Sign up
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
