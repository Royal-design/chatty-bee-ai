"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { RegisterFormData, registerSchema } from "@/schema/registerSchema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAppDispatch } from "@/redux/store";
import { Link, useNavigate } from "react-router-dom";
import chattLogo from "../assets/chatty.png";

import { toast } from "sonner";
import { registerUser } from "@/redux/slice/authSlice";
import { AuthLoader } from "@/components/ui/AuthLoader";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: ""
    }
  });

  const handleSubmit = async (userData: RegisterFormData) => {
    const response = await dispatch(
      registerUser(userData.email, userData.password, userData.name)
    );

    if (response.success) {
      form.reset();
      navigate("/chats");
      toast.success("User registered successfully");
    } else {
      toast.error(response.message || "Registration failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 h-screen flex flex-col p-8  justify-center  items-center w-full"
      >
        <Card className="max-w-sm  w-full mx-auto p-2 md:p-4 md:border  border-0 rounded-md ">
          <CardHeader className="text-center flex flex-col items-center text-xl md:text2xl mb-4 fontbold">
            <img src={chattLogo} alt="chatty-bee" className="size-12" />
            <CardTitle className=""> Create an Account</CardTitle>
            <p className="text-sm   mt-2">
              Sign Up & Start Connecting with Chatty Bee AI
            </p>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className=" border h-12 border-border-color"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      className="h-12 border border-border-color"
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
                      placeholder="Enter your password"
                      className="h-12 border border-border-color"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="p-0 flex flex-col gap-1">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full h-12 border "
            >
              {form.formState.isSubmitting ? <AuthLoader /> : "Register"}
            </Button>
            <p className=" text-sm mt-2">
              {" "}
              You have an account?{" "}
              <Link to="/login" className=" text-sm transition">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
