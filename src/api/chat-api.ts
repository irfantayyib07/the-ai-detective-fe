import {
 UploadDocumentPayload,
 UploadDocumentResponse,
 AnalyzeDocumentPayload,
 AnalyzeDocumentResponse,
 SendMessagePayload,
 SendMessageResponse,
} from "@/types/chat-types";
import { ENDPOINTS } from "./constants";
import { apiClientWithAuth } from "./api-client";
import { AxiosError } from "axios";

export const uploadDocument = async (
 payload: UploadDocumentPayload,
 token: string,
): Promise<UploadDocumentResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const formData = new FormData();
  if (payload.file) {
   formData.append("document", payload.file);
  }
  const response = await client.post<UploadDocumentResponse>(`${ENDPOINTS.CHAT}/uploadDocument`, formData, {
   headers: {
    "Content-Type": "multipart/form-data",
   },
  });
  return response.data;
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError.response?.data || error;
 }
};

export const analyzeDocument = async (
 payload: AnalyzeDocumentPayload,
 token: string,
): Promise<AnalyzeDocumentResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const response = await client.post<AnalyzeDocumentResponse>(`${ENDPOINTS.CHAT}/analyzeDocument`, payload);
  return response.data;
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError.response?.data || error;
 }
};

export const sendMessage = async (
 payload: SendMessagePayload,
 token: string,
): Promise<SendMessageResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const response = await client.post<SendMessageResponse>(`${ENDPOINTS.CHAT}/followUpQuestion`, payload);
  return response.data;
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError.response?.data || error;
 }
};
