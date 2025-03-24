import { deleteAllConversations } from "@/api/conversation-api";
import { DeleteAllConversationsResponse } from "@/types/conversation-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export type ApiError = { message: string };

const QUERY_KEY = "CONVERSATIONS";
type ErrorFnE = (error: ApiError) => void;
type SuccessDeleteConversationFn = (data: DeleteAllConversationsResponse) => void;

export const useDeleteAllConversations = (
 onSuccessFn?: SuccessDeleteConversationFn,
 onErrorFn?: ErrorFnE,
) => {
 const queryClient = useQueryClient();
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<DeleteAllConversationsResponse, ApiError, {}>({
  mutationFn: () => deleteAllConversations(token),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   onErrorFn?.(error);
  },
 });
};
