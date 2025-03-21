export type UploadDocumentPayload = { file: File };

export type UploadDocumentResponse = {
 success: boolean;
 message: string;
 sourceId: string;
 fileName: string;
};

export type AnalyzeDocumentPayload = {
 question: string;
 sourceId: string;
 fileName: string;
};

export type AnalyzeDocumentResponse = {
 success: boolean;
 aiResponse: string;
 conversationId: string;
 sourceId: string;
};

export type SendMessagePayload = {
 question: string;
 sourceId: string;
 conversationId: string;
 fileName: string;
};

export type SendMessageResponse = {
 success: boolean;
 aiResponse: string;
};
