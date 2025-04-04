import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./Layout";
import Chat from "./pages/Chat";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { Toaster } from "react-hot-toast";
import AuthGuard from "./lib/AuthGuard";

function App() {
 return (
  <>
   <Routes>
    <Route path="/" element={<MainLayout />}>
     <Route path="" element={<Navigate to="/chat" />} />
     <Route path="/create-account" element={<Signup />} />
     <Route path="/login" element={<Login />} />
     <Route path="" element={<AuthGuard />}>
      <Route path="/chat" element={<Chat />} />
     </Route>
    </Route>
   </Routes>
   <Toaster />
  </>
 );
}

export default App;
