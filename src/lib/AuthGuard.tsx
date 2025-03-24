import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { useDeleteAllConversations } from "@/services/conversation-services";
import { useEffect } from "react";
import { useDeleteAllDocuments } from "@/services/document-services";
import { Loader2 } from "lucide-react";

const AuthGuard = () => {
 const { token } = useSelector((state: RootState) => state.auth);

 if (!token) {
  return <Navigate to="/login" replace />;
 }

 const { mutate: deleteAllConversations, isPending: isConversationPending } = useDeleteAllConversations();
 const { mutate: deleteAllDocuments, isPending: isDocumentPending } = useDeleteAllDocuments();

 useEffect(() => {
  deleteAllConversations({});
  deleteAllDocuments({});
 }, []);

 const isDeleting = isConversationPending || isDocumentPending;

 return isDeleting ? <Loader2 className="animate-spin" /> : <Outlet />;
};

export default AuthGuard;
