import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/services/auth-services";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function Header() {
 const navigate = useNavigate();

 const { mutate: logoutMutation, isPending } = useLogout(
  () => {
   toast.success("Logged out successfully");
   navigate("/login");
  },

  () => {
   toast.error("Logout failed");
  },
 );

 const handleLogout = () => {
  logoutMutation();
 };

 return (
  <header className="h-[55px] bg-white w-full px-5 py-[15px] flex justify-between items-center">
   <Link to="/chat">
    <img src="/logo.png" alt="The AI Detective" className="h-[25px]" />
   </Link>

   <Button
    onClick={handleLogout}
    variant="ghost"
    className="text-primary hover:text-primary/80"
    disabled={isPending}
   >
    {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
    {isPending ? "Logging out..." : "Logout"}
   </Button>
  </header>
 );
}

export default Header;
