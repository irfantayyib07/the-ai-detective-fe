import {
 analyzeDocument,
 sendMessage,
 uploadDocument,
 // deleteChat,
 // getAllChats,
 // updateChat,
} from "@/api/chat-api";
import {
 AnalyzeDocumentPayload,
 AnalyzeDocumentResponse,
 SendMessagePayload,
 SendMessageResponse,
 UploadDocumentPayload,
 UploadDocumentResponse,
 // DeleteChatResponse,
 // Chat,
 // ChatResponse,
 // UpdateChatPayload,
 // UpdateChatResponse,
} from "@/types/chat-types";
import {
 useMutation,
 useQueryClient,
 // UseQueryResult
} from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
// import { useQuery } from "@tanstack/react-query";

export type ApiError = { message: string };

const QUERY_KEY = "CHATS";
type ErrorFnE = (error: ApiError) => void;
type SuccessUploadDocumentFn = (data: UploadDocumentResponse) => void;
type SuccessAnalyzeDocumentFn = (data: AnalyzeDocumentResponse) => void;
type SuccessSendMessageFn = (data: SendMessageResponse) => void;
// type SuccessEditChatFn = (data: UpdateChatResponse) => void;
// type SuccessDeleteChatFn = (data: DeleteChatResponse) => void;

// export function useChats(): UseQueryResult<ChatResponse> {
//  return useQuery({
//   queryKey: [QUERY_KEY],
//   queryFn: () => getAllChats(),
//   select: res => res || ([] as Chat[]),
//  });
// }

export const useUploadDocument = (onSuccessFn?: SuccessUploadDocumentFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<UploadDocumentResponse, ApiError, UploadDocumentPayload>({
  mutationFn: payload => uploadDocument(payload, token),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "Document upload failed");
   onErrorFn?.(error);
  },
 });
};

export const useAnalyzeDocument = (onSuccessFn?: SuccessAnalyzeDocumentFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<AnalyzeDocumentResponse, ApiError, AnalyzeDocumentPayload>({
  mutationFn: payload => analyzeDocument(payload, token),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "File analysis failed");
   onErrorFn?.(error);
  },
 });
};

export const useSendMessage = (onSuccessFn?: SuccessSendMessageFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<SendMessageResponse, ApiError, SendMessagePayload>({
  mutationFn: payload => sendMessage(payload, token),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "Couldn't receive response");
   onErrorFn?.(error);
  },
 });
};

// export const useUpdateChat = (chatId: string, onSuccessFn?: SuccessEditChatFn, onErrorFn?: ErrorFnE) => {
//  const queryClient = useQueryClient();
//  const token = useSelector((state: RootState) => state.auth.token);
//  return useMutation<UpdateChatResponse, ApiError, UpdateChatPayload>({
//   mutationFn: payload => updateChat(chatId, payload, token),
//   onSuccess: data => {
//    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
//    onSuccessFn?.(data);
//   },
//   onError: error => {
//    onErrorFn?.(error);
//   },
//  });
// };

// export const useDeleteChat = (onSuccessFn?: SuccessDeleteChatFn, onErrorFn?: ErrorFnE) => {
//  const queryClient = useQueryClient();
//  const token = useSelector((state: RootState) => state.auth.token);
//  return useMutation<DeleteChatResponse, ApiError, string>({
//   mutationFn: chatId => deleteChat(chatId, token),
//   onSuccess: data => {
//    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
//    onSuccessFn?.(data);
//   },
//   onError: error => {
//    onErrorFn?.(error);
//   },
//  });
// };
