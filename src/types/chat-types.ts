export type Message = {
 id: string;
 aiResponse: string;
 aiResponseHtml?: string;
 isUser: boolean;
 pending?: boolean;
};

export type UploadDocumentPayload = { file: File };

export type UploadDocumentTransformedResponse = {
 success: boolean;
 message: string;
 sourceId: string;
 fileName: string;
};

export type UploadDocumentResponse = {
 data: {
  pages: [
   {
    id: string;
   },
  ];
 };
};

export type ReindexDocumentPayload = {
 pageId: string;
};

export type ReindexDocumentResponse = {
 success: boolean;
 data: boolean;
 message: string;
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
