import { Outlet } from "react-router-dom";
import Header from "./components/Layout/Header";

function MainLayout() {
 return (
  <>
   <Header />
   <main
    className="bg-green-radial from-light-green to-mint-green relative z-[1] pt-24 sm:pt-32 flex flex-col items-center px-3 sm:px-6 pb-6 sm:pb-9 md:pb-11 overflow-y-auto"
    style={{
     height: "calc(100dvh - 55px)",
    }}
   >
    <Outlet />
    <img
     draggable={false}
     src="/logo-icon.png"
     alt="AI Detective"
     className="w-1/2 max-w-[526px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-[1] select-none"
    />
   </main>
  </>
 );
}

export default MainLayout;
