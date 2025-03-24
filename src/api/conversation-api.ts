import { DeleteAllConversationsResponse } from "@/types/conversation-types";
import { ENDPOINTS } from "./constants";
import { apiClientWithAuth } from "./api-client";
import { AxiosError } from "axios";

export const deleteAllConversations = async (token: string): Promise<DeleteAllConversationsResponse> => {
 try {
  const client = apiClientWithAuth(token);
  const response = await client.delete<DeleteAllConversationsResponse>(
   `${ENDPOINTS.CONVERSATION}/deleteAllConversations`,
  );
  return response.data;
 } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError.response?.data || error;
 }
};
