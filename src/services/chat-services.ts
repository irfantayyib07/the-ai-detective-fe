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
 return useMutation<UploadDocumentResponse, ApiError, UploadDocumentPayload>({
  mutationFn: payload => uploadDocument(payload),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   onErrorFn?.(error);
  },
 });
};

export const useAnalyzeDocument = (onSuccessFn?: SuccessAnalyzeDocumentFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 return useMutation<AnalyzeDocumentResponse, ApiError, AnalyzeDocumentPayload>({
  mutationFn: payload => analyzeDocument(payload),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   onErrorFn?.(error);
  },
 });
};

export const useSendMessage = (onSuccessFn?: SuccessSendMessageFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 return useMutation<SendMessageResponse, ApiError, SendMessagePayload>({
  mutationFn: payload => sendMessage(payload),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   onErrorFn?.(error);
  },
 });
};

// export const useUpdateChat = (chatId: string, onSuccessFn?: SuccessEditChatFn, onErrorFn?: ErrorFnE) => {
//  const queryClient = useQueryClient();
//  return useMutation<UpdateChatResponse, ApiError, UpdateChatPayload>({
//   mutationFn: payload => updateChat(chatId, payload),
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
//  return useMutation<DeleteChatResponse, ApiError, string>({
//   mutationFn: chatId => deleteChat(chatId),
//   onSuccess: data => {
//    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
//    onSuccessFn?.(data);
//   },
//   onError: error => {
//    onErrorFn?.(error);
//   },
//  });
// };
