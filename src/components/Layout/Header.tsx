import { Link } from "react-router-dom";

function Header() {
 return (
  <header className="h-[55px] bg-white w-full px-5 py-[15px]">
   <Link to="/chat">
    <img src="/logo.png" alt="The AI Detective" className="h-[25px]" />
   </Link>
  </header>
 );
}

export default Header;
