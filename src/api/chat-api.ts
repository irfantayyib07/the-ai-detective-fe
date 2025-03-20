import axios from "axios";
import {
 // ChatResponse,
 UploadDocumentPayload,
 UploadDocumentResponse,
 AnalyzeDocumentPayload,
 AnalyzeDocumentResponse,
 SendMessagePayload,
 SendMessageResponse,
 // UpdateChatPayload,
 // UpdateChatResponse,
 // DeleteChatResponse,
} from "@/types/chat-types";
import { ENDPOINTS } from "./api";

const apiClient = axios.create({
 baseURL: "http://localhost:3500",
});

// export const getAllChats = async (): Promise<ChatResponse> => {
//  const endpoint = `/${ENDPOINTS.CHAT}`;

//  try {
//   const response = await apiClient.get<ChatResponse>(endpoint);
//   return response.data;
//  } catch (error: any) {
//   if (axios.isAxiosError(error) && error.response?.status === 404) {
//    return [];
//   }
//   throw error;
//  }
// };

export const uploadDocument = async (payload: UploadDocumentPayload): Promise<UploadDocumentResponse> => {
 const formData = new FormData();

 if (payload.file) {
  formData.append("document", payload.file);
 }

 const response = await apiClient.post<UploadDocumentResponse>(`${ENDPOINTS.CHAT}/uploadDocument`, formData, {
  headers: {
   "Content-Type": "multipart/form-data",
  },
 });

 return response.data;
};

export const analyzeDocument = async (payload: AnalyzeDocumentPayload): Promise<AnalyzeDocumentResponse> => {
 const response = await apiClient.post<AnalyzeDocumentResponse>(`${ENDPOINTS.CHAT}/analyzeDocument`, payload);
 return response.data;
};

export const sendMessage = async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
 const response = await apiClient.post<SendMessageResponse>(`${ENDPOINTS.CHAT}/followUpQuestion`, payload);
 return response.data;
};

// export const updateChat = async (chatId: string, payload: UpdateChatPayload): Promise<UpdateChatResponse> => {
//  const response = await apiClient.put<UpdateChatResponse>(`${ENDPOINTS.CHAT}/${chatId}`, payload);
//  return response.data;
// };

// export const deleteChat = async (chatId: string): Promise<DeleteChatResponse> => {
//  const response = await apiClient.delete<DeleteChatResponse>(`${ENDPOINTS.CHAT}/${chatId}`);
//  return response.data;
// };
