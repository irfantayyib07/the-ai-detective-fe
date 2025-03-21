import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
 const { token } = useSelector((state: RootState) => state.auth);

 if (!token) {
  return <Navigate to="/login" replace />;
 }

 return <Outlet />;
};

export default AuthGuard;
