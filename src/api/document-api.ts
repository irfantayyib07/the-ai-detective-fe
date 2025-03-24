import { DeleteAllDocumentsResponse, RecordDocumentPayload } from "@/types/document-types";
import { ENDPOINTS } from "./constants";
import { apiClientWithAuth } from "./api-client";
import { AxiosError } from "axios";

export const recordDocument = async (
 payload: RecordDocumentPayload,
 token: string,
): Promise<DeleteAllDocumentsResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const response = await client.post<DeleteAllDocumentsResponse>(
   `${ENDPOINTS.DOCUMENT}/recordDocument`,
   payload,
  );
  return response.data;
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError.response?.data || error;
 }
};

export const deleteAllDocuments = async (token: string): Promise<DeleteAllDocumentsResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const response = await client.delete<DeleteAllDocumentsResponse>(
   `${ENDPOINTS.DOCUMENT}/deleteAllDocuments`,
  );
  return response.data;
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError.response?.data || error;
 }
};
