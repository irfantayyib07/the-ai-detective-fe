import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./Layout";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
 return (
  <Routes>
   <Route path="/" element={<MainLayout />}>
    <Route path="" element={<Navigate to="/chat" />} />
    <Route path="/create-account" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/chat" element={<Chat />} />
   </Route>
  </Routes>
 );
}

export default App;
