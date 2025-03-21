import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "@/services/auth-services";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setSessionUser } from "@/redux/slices/authSlice";

const signupSchema = z
 .object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
 })
 .refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
 });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const form = useForm<SignupFormData>({
  resolver: zodResolver(signupSchema),
  defaultValues: {
   username: "",
   email: "",
   password: "",
   confirmPassword: "",
  },
 });

 const { mutate: signupMutation, isPending } = useSignup(response => {
  toast.success("Account created successfully!");
  dispatch(setToken(response.data.token));
  dispatch(setSessionUser(response.data.sessionUser));
  navigate("/chat");
 });

 const onSubmit = (data: SignupFormData) => {
  const { confirmPassword, ...signupData } = data;
  signupMutation(signupData);
 };

 return (
  <Card className="w-full max-w-[500px] px-[20px] pt-[20px] pb-10">
   <CardContent className="p-0">
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
       control={form.control}
       name="username"
       render={({ field }) => (
        <FormItem>
         <FormLabel className="text-primary font-semibold tracking-[-2%]">Username</FormLabel>
         <FormControl>
          <Input placeholder="John Smith" {...field} />
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
         <FormLabel className="text-primary font-semibold tracking-[-2%]">Email</FormLabel>
         <FormControl>
          <Input type="email" placeholder="john.smith@example.com" {...field} />
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
         <FormLabel className="text-primary font-semibold tracking-[-2%]">Password</FormLabel>
         <FormControl>
          <Input type="password" {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <FormField
       control={form.control}
       name="confirmPassword"
       render={({ field }) => (
        <FormItem>
         <FormLabel className="text-primary font-semibold tracking-[-2%]">Confirm Password</FormLabel>
         <FormControl>
          <Input type="password" {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <Button type="submit" className="w-full bg-primary" disabled={isPending}>
       {isPending ? "Signing up..." : "Sign Up"}
      </Button>
     </form>
    </Form>
   </CardContent>
   <CardFooter className="p-0 mt-6">
    <p className="text-[11px] text-primary">
     Already have an Account?{" "}
     <Link to="/login" className="underline">
      Login
     </Link>
    </p>
   </CardFooter>
  </Card>
 );
};

export default SignupForm;
