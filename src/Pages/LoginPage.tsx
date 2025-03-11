import { FormEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import googleImage from "../assets/google.webp";
import chattLogo from "../assets/chatty.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { LoginFormData, loginSchema } from "@/schema/loginSchema";
import { useAppDispatch } from "@/redux/store";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "@/redux/slice/authSlice";
import { toast } from "sonner";
import { AuthSpinner } from "@/components/ui/authSpinner";

export const LoginPage = () => {
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleGoogleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingGoogle(true);
    const response = await dispatch(loginWithGoogle());

    setLoadingGoogle(false);

    if (response.success) {
      toast.success("User logged in successfully");
      navigate("/");
    } else {
      toast.error(response.message || "Google login failed");
    }
  };

  const handleSubmit = async (data: LoginFormData) => {
    setLoadingLogin(true);

    const response = await dispatch(loginUser(data.email, data.password));

    setLoadingLogin(false);

    if (response.success) {
      toast.success("User logged in successfully");
      navigate("/chats");
      form.reset();
    } else {
      toast.error(response.message || "Login failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 h-screen flex flex-col p-8  justify-center  items-center w-full"
      >
        <Card className="max-w-sm  w-full mx-auto p-2 md:p-4 md:border  border-0 bg-background rounded-md ">
          <CardHeader className="text-center flex mb-0 flex-col items-center w-full text-xl md:text-2xl my-4 font-bold">
            <img src={chattLogo} alt="chatty-bee" className="size-12" />
            <CardTitle className="text-base">
              {" "}
              Welcome Back to ChattyBee AI!
            </CardTitle>
            <p className="text-sm  ">Enter your details and start chatting!</p>
          </CardHeader>
          <CardContent className="px-0 gap-4 flex flex-col">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="p-0 flex-col gap-2">
            <Button
              disabled={loadingLogin || loadingGoogle}
              type="submit"
              className="w-full  duration-200 cursor-pointer"
            >
              {loadingLogin ? <AuthSpinner /> : "Login"}
            </Button>
            <Button
              disabled={loadingLogin || loadingGoogle}
              onClick={handleGoogleLogin}
              variant="ghost"
              className="w-full cursor-pointer hove duration-200 border"
            >
              {loadingGoogle ? (
                <AuthSpinner />
              ) : (
                <div className="items-center flex ">
                  <img src={googleImage} className="w-[2rem]" />
                  <p>Google</p>
                </div>
              )}
            </Button>
            <p className="text-center  text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="transition">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
