import { deleteAllDocuments, recordDocument } from "@/api/document-api";
import {
 DeleteAllDocumentsResponse,
 RecordDocumentPayload,
 RecordDocumentResponse,
} from "@/types/document-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

export type ApiError = { message: string };

const QUERY_KEY = "DOCUMENTS";
type ErrorFnE = (error: ApiError) => void;
type SuccessRecordDocumentFn = (data: RecordDocumentResponse) => void;
type SuccessDeleteDocumentFn = (data: DeleteAllDocumentsResponse) => void;

export const useRecordDocument = (onSuccessFn?: SuccessRecordDocumentFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<RecordDocumentResponse, ApiError, RecordDocumentPayload>({
  mutationFn: payload => recordDocument(payload, token),
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

export const useDeleteAllDocuments = (onSuccessFn?: SuccessDeleteDocumentFn, onErrorFn?: ErrorFnE) => {
 const queryClient = useQueryClient();
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<DeleteAllDocumentsResponse, ApiError, {}>({
  mutationFn: () => deleteAllDocuments(token),
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
   onSuccessFn?.(data);
  },
  onError: error => {
   onErrorFn?.(error);
  },
 });
};
