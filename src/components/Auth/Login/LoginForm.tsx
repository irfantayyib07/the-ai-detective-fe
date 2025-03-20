import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/services/auth-services";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSessionUser, setToken } from "@/redux/slices/authSlice";

const loginSchema = z.object({
 username: z.string().min(1, "Username is required"),
 password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
   username: "",
   password: "",
  },
 });

 const { mutate: loginMutation, isPending } = useLogin(
  response => {
   toast.success("Login successful!");
   console.log(response);
   dispatch(setToken(response.data.token));
   dispatch(setSessionUser(response.data.sessionUser));
   navigate("/chat");
  },

  () => {
   toast.error("Login failed");
  },
 );

 const onSubmit = (data: LoginFormData) => {
  loginMutation(data);
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
      <Button type="submit" className="w-full bg-primary" disabled={isPending}>
       {isPending ? "Logging in..." : "Login"}
      </Button>
     </form>
    </Form>
   </CardContent>
   <CardFooter className="p-0 mt-6">
    <p className="text-[11px] text-primary">
     Don't have an Account?{" "}
     <Link to="/create-account" className="underline">
      Sign Up
     </Link>
    </p>
   </CardFooter>
  </Card>
 );
};

export default LoginForm;
