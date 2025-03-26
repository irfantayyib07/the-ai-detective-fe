import {
 UploadDocumentPayload,
 UploadDocumentResponse,
 AnalyzeDocumentPayload,
 AnalyzeDocumentResponse,
 SendMessagePayload,
 SendMessageResponse,
 UploadDocumentTransformedResponse,
 ReindexDocumentResponse,
 ReindexDocumentPayload,
} from "@/types/chat-types";
import { ENDPOINTS } from "./constants";
import { apiClientWithAuth } from "./api-client";
import { AxiosError } from "axios";

const API_BASE_URL = "https://app.customgpt.ai/api/v1";
const PROJECT_ID = import.meta.env.VITE_CUSTOMGPT_PROJECT_ID || "66518";

export const uploadDocument = async (
 payload: UploadDocumentPayload,
 token: string,
): Promise<UploadDocumentTransformedResponse> => {
 try {
  const client = apiClientWithAuth(token, API_BASE_URL, false);
  const formData = new FormData();
  if (payload.file) {
   formData.append("file", payload.file);
   formData.append("is_ocr_enabled", "true");
  }
  const response = await client.post<UploadDocumentResponse>(`/projects/${PROJECT_ID}/sources`, formData, {
   headers: {
    "Content-Type": "multipart/form-data",
   },
  });
  return {
   success: true,
   message: "Document uploaded successfully",
   sourceId: response.data.data.pages[0].id,
   fileName: payload.file.name,
  };
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw new Error(`Failed to upload document as source: ${axiosError.response?.data || axiosError.message}`);
 }
};

export const reindexDocument = async (
 payload: ReindexDocumentPayload,
 token: string,
): Promise<ReindexDocumentResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const response = await client.post<ReindexDocumentResponse>(`${ENDPOINTS.CHAT}/reindexDocument`, payload);
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
