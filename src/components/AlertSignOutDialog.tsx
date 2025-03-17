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
import { logoutUser } from "@/redux/slice/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AlertSignOutProps {
  isAlertSignOutOpen: boolean;
  setisAlertSignOutOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AlertSignOutDialog = ({
  isAlertSignOutOpen,
  setisAlertSignOutOpen
}: AlertSignOutProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const signOut = async () => {
    const response = await dispatch(logoutUser());
    if (response.success) {
      toast.success("User logged out successfully");
      navigate("/");
    } else {
      toast.error(response.message || "Logout failed");
    }
  };

  return (
    <AlertDialog open={isAlertSignOutOpen} onOpenChange={setisAlertSignOutOpen}>
      <AlertDialogContent className="rounded-3xl flex flex-col items-center gap-2 w-md p-12">
        <AlertDialogHeader className="flex flex-col items-center">
          <AlertDialogTitle className="text-xl text-center">
            Are you sure you want to log out?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl text-center">
            Log out of ChattyBee as <br />
            <span>{user?.email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full mt-8">
          <div className=" flex gap-4 flex-col w-full">
            <AlertDialogCancel
              className="w-full rounded-3xl py-6"
              onClick={signOut}
            >
              Log out
            </AlertDialogCancel>
            <AlertDialogAction className="w-full rounded-3xl py-6">
              Cancel
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
