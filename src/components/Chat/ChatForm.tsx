import { useRef, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import {
 useAnalyzeDocument,
 useReindexDocument,
 useSendMessage,
 useUploadDocument,
} from "@/services/chat-services";
import { Message, UploadDocumentPayload } from "@/types/chat-types";
import toast from "react-hot-toast";
import { Loader2, User, FileText, Printer, Upload, RefreshCw } from "lucide-react";
import { cn, markdownToHtml } from "@/lib/utils";
import { handlePrintResponse } from "@/lib/handlePrintAnalysis";
import { useDeleteAllDocuments, useRecordDocument } from "@/services/document-services";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteAllConversations } from "@/services/conversation-services";

const formSchema = z.object({
 question: z.string().min(1, "Please enter a question"),
});

type FormValues = z.infer<typeof formSchema>;

function ChatForm() {
 const fileInputRef = useRef<HTMLInputElement>(null);
 const chatContainerRef = useRef<HTMLDivElement>(null);
 const [fileName, setFileName] = useState<string>("No file chosen");
 const [uploaded, setUploaded] = useState<boolean>(false);
 const [isProcessing, setIsProcessing] = useState<boolean>(false);
 const [sourceId, setSourceId] = useState<string>("");
 const [sessionId, setSessionId] = useState<string>("");
 const [messages, setMessages] = useState<Message[]>([]);
 const [downloadingMessageId, setDownloadingMessageId] = useState<string | null>(null);
 const [fileUploadError, setFileUploadError] = useState<string | null>(null);
 const [showTooltip, setShowTooltip] = useState<boolean>(false);
 const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);

 const promptSuggestions = [
  "Can you analyze this text for AI-generated content?",
  "What are the chances this was written by AI?",
  "Is this student submission likely AI-generated?",
  "Provide a detailed analysis of this text for AI content.",
 ];

 const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   question: "",
  },
 });

 const { mutate: reindexDocument, isPending: isReindexingDocument } = useReindexDocument(async () => {
  setIsProcessing(true);
  await new Promise(res => {
   setTimeout(res, 2500);
  });
  setIsProcessing(false);
 });

 const { mutate: recordDocument, isPending: isRecordingDocument } = useRecordDocument();

 const { mutate: uploadDocument, isPending: isUploadingDocument } = useUploadDocument(
  data => {
   setFileUploadError(null);
   toast.success(data.message || "Document uploaded successfully");
   reindexDocument({ pageId: String(data.sourceId) });
   recordDocument({ sourceId: String(data.sourceId) });
   setSourceId(String(data.sourceId));
   setFileName(data.fileName);
   setUploaded(true);

   const systemMessage: Message = {
    id: `system-${Date.now()}`,
    aiResponse: `Document "${data.fileName}" uploaded successfully.`,
    aiResponseHtml: `Document "${data.fileName}" uploaded successfully.`,
    isUser: false,
   };

   setMessages(prev => [...prev, systemMessage]);
  },
  error => {
   // Improved error handling
   console.error("File upload error:", error);
   setUploaded(false);
   setFileName("No file chosen (upload failed)");
   setFileUploadError(error?.message || "Failed to upload document. Please try again.");
   toast.error("Failed to upload document. Please try again.");
  },
 );

 const { mutate: analyzeDocument, isPending: isAnalyzingDocument } = useAnalyzeDocument(
  data => {
   reset();
   setSessionId(data.conversationId);

   const aiResponseHtml = markdownToHtml(data.aiResponse);

   setMessages(prev =>
    prev.map(msg => {
     if (msg.pending) {
      const aiMessage: Message = {
       id: `ai-${Date.now()}`,
       aiResponse: data.aiResponse,
       aiResponseHtml,
       isUser: false,
      };
      return aiMessage;
     }
     return msg;
    }),
   );

   // Set analysis completed flag and show tooltip
   setAnalysisCompleted(true);
   setShowTooltip(true);

   // Auto-hide tooltip after 2 seconds
   setTimeout(() => {
    setShowTooltip(false);
   }, 2000);
  },
  error => {
   console.error("Analysis error:", error);
   setMessages(prev => prev.filter(msg => !msg.pending));
   toast.error("Failed to analyze document. Please try again.");
  },
 );

 const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage(
  data => {
   reset();
   const aiResponseHtml = markdownToHtml(data.aiResponse);

   setMessages(prev =>
    prev.map(msg => {
     if (msg.pending) {
      const aiMessage: Message = {
       id: `ai-${Date.now()}`,
       aiResponse: data.aiResponse,
       aiResponseHtml,
       isUser: false,
      };
      return aiMessage;
     }
     return msg;
    }),
   );
  },
  error => {
   console.error("Message error:", error);
   setMessages(prev => prev.filter(msg => !msg.pending));
   toast.error("Failed to send message. Please try again.");
  },
 );

 const scrollToBottom = () => {
  if (chatContainerRef.current) {
   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
 };

 const handleFileUpload = (file: File) => {
  if (!file) {
   toast.error("No file selected");
   return;
  }

  setFileUploadError(null);
  const payload: UploadDocumentPayload = { file };

  try {
   uploadDocument(payload);
  } catch (err) {
   console.error("Error during file upload:", err);
   toast.error("Failed to process file upload. Please try again.");
   setFileUploadError("Failed to process file upload. Please try again.");
  }
 };

 const onDrop = useCallback((acceptedFiles: File[]) => {
  if (acceptedFiles.length > 0) {
   const file = acceptedFiles[0];
   setFileName(file.name);
   setUploaded(false);
   setFileUploadError(null);
   handleFileUpload(file);
  } else {
   setFileUploadError("No valid files dropped");
  }
 }, []);

 const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  noClick: false,
  multiple: false,
  disabled:
   isUploadingDocument ||
   isReindexingDocument ||
   isProcessing ||
   isAnalyzingDocument ||
   isSendingMessage ||
   isRecordingDocument,
 });

 const onSubmit = (data: FormValues) => {
  if (!uploaded) {
   toast.error("Please upload a document first");
   return;
  }

  const userMessage: Message = {
   id: `user-${Date.now()}`,
   aiResponse: data.question,
   aiResponseHtml: data.question,
   isUser: true,
  };

  const pendingMessage: Message = {
   id: `pending-${Date.now()}`,
   aiResponse: "",
   aiResponseHtml: "",
   isUser: false,
   pending: true,
  };

  setMessages(prev => [...prev, userMessage, pendingMessage]);

  setTimeout(() => {
   scrollToBottom();
  }, 50);

  if (sessionId) {
   sendMessage({
    question: data.question,
    conversationId: sessionId,
    sourceId,
    fileName,
   });
  } else {
   analyzeDocument({
    question: data.question,
    sourceId,
    fileName,
   });
  }
 };

 const handlePromptSelect = (prompt: string) => {
  setValue("question", prompt);
  handleSubmit(onSubmit)();
 };

 // For manual file upload button
 const triggerFileInput = () => {
  if (fileInputRef.current) {
   fileInputRef.current.click();
  }
 };

 const { mutate: deleteAllConversations } = useDeleteAllConversations();
 const { mutate: deleteAllDocuments } = useDeleteAllDocuments();

 // Handle reset for next document
 const handleResetForNextDocument = () => {
  setSessionId("");
  setSourceId("");
  setMessages([]);
  setAnalysisCompleted(false);
  setUploaded(false);
  setFileName("No file chosen");
  reset();
  setShowTooltip(false);
  deleteAllConversations({});
  deleteAllDocuments({});
 };

 return (
  <section className="w-full max-w-[750px] mx-auto space-y-[25px]">
   <Card className="px-[20px] pt-[20px] pb-10">
    <Label className="block text-primary font-semibold tracking-[-2%] mb-5">Upload Document</Label>
    <CardContent className="p-0">
     <div
      {...getRootProps()}
      className={cn(
       "border-2 border-dashed rounded-lg p-6 transition-colors",
       isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
       isUploadingDocument || isReindexingDocument || isProcessing
        ? "opacity-70 cursor-not-allowed"
        : "cursor-pointer",
       fileUploadError ? "border-red-500 bg-red-50" : "",
      )}
     >
      <input {...getInputProps()} ref={fileInputRef} />
      <div className="flex flex-col items-center justify-center text-center">
       <Upload className="h-10 w-10 text-muted-foreground mb-2" />
       <p className="text-sm font-medium">
        {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
       </p>
       <p className="text-xs text-muted-foreground mt-1 mb-3">or</p>
       <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        disabled={
         isUploadingDocument ||
         isReindexingDocument ||
         isProcessing ||
         isAnalyzingDocument ||
         isSendingMessage ||
         isRecordingDocument
        }
       >
        Browse files
       </Button>
       <p className="text-xs text-muted-foreground mt-3">
        Current file: {fileName}
        {isUploadingDocument && (
         <div className="mt-2 ml-2 text-primary">
          <Loader2 size={12} className="inline animate-spin mr-1" />
          Uploading...
         </div>
        )}
        {(isReindexingDocument || isProcessing) && (
         <div className="mt-2 ml-2 text-primary">
          <Loader2 size={12} className="inline animate-spin mr-1" />
          Processing...
         </div>
        )}
       </p>
       {fileUploadError && <p className="text-xs text-red-500 mt-2">{fileUploadError}</p>}
      </div>
     </div>
    </CardContent>
   </Card>

   <Card className="px-[20px] pt-[20px] pb-6">
    <div className="flex justify-between items-center mb-5">
     <Label className="block text-primary font-semibold tracking-[-2%]">Conversation</Label>

     {analysisCompleted && (
      <TooltipProvider>
       <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
         <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-secondary-light"
          onClick={handleResetForNextDocument}
         >
          <RefreshCw size={16} />
         </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
         <p>Click here to analyze the next document</p>
        </TooltipContent>
       </Tooltip>
      </TooltipProvider>
     )}
    </div>

    <CardContent
     ref={chatContainerRef}
     className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto mb-4 p-2 pr-8 scroll-smooth"
    >
     {messages.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
       <FileText size={24} className="mb-2" />
       <p className="text-center">Upload a document and ask questions</p>
      </div>
     ) : (
      messages.map(message => (
       <div key={message.id} className={cn("flex", message.isUser ? "justify-end" : "justify-start")}>
        <div
         className={cn(
          "flex items-start gap-2 sm:max-w-[80%] rounded-lg p-3 relative",
          message.isUser
           ? "bg-primary text-white rounded-br-none"
           : "bg-secondary text-primary rounded-bl-none",
         )}
        >
         {!message.isUser && (
          <div className="shrink-0 mt-0.5">
           <FileText size={16} className="text-primary" />
          </div>
         )}
         {message.isUser && (
          <div className="shrink-0 mt-0.5">
           <User size={16} className="text-white" />
          </div>
         )}
         <div className="text-sm">
          {message.pending ? (
           <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>Thinking...</span>
           </div>
          ) : (
           <div
            dangerouslySetInnerHTML={{
             __html: message.aiResponseHtml || message.aiResponse,
            }}
            className="gpt-response-container"
            id={`gpt-response-container-${message.id}`}
           />
          )}
         </div>
         {!message.isUser && !message.pending && (
          <Button
           variant="ghost"
           size="icon"
           className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[125%] h-6 w-6 p-1 text-muted-foreground hover:text-primary hover:bg-secondary-light"
           onClick={() => handlePrintResponse(message, setDownloadingMessageId, fileName)}
           title="Print response"
           disabled={downloadingMessageId === message.id}
          >
           {downloadingMessageId === message.id ? (
            <Loader2 size={14} className="animate-spin" />
           ) : (
            <Printer size={14} />
           )}
          </Button>
         )}
        </div>
       </div>
      ))
     )}
    </CardContent>

    {uploaded && !isReindexingDocument && !isProcessing && messages.length <= 1 && (
     <div className="px-2 mb-4">
      <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
       {promptSuggestions.map((prompt, index) => (
        <button
         key={index}
         onClick={() => handlePromptSelect(prompt)}
         className="text-left p-3 text-sm bg-secondary/50 hover:bg-secondary text-primary rounded-lg border border-muted transition-colors duration-200"
        >
         {prompt}
        </button>
       ))}
      </div>
     </div>
    )}
   </Card>

   <Card className="px-[20px] pt-[20px] pb-10">
    <CardContent className="p-0">
     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
       control={control}
       name="question"
       render={({ field: { value, onChange } }) => (
        <div>
         <Input
          value={value}
          onChange={onChange}
          placeholder="Ask a question about the document..."
          className="bg-white border-none text-primary text-sm sm:text-base md:text-base focus-visible:ring-0 focus-visible:ring-transparent"
          disabled={
           isReindexingDocument ||
           isProcessing ||
           isAnalyzingDocument ||
           isSendingMessage ||
           isRecordingDocument
          }
         />
        </div>
       )}
      />
      <div className="flex justify-end">
       <Button
        type="submit"
        className="bg-primary text-white"
        disabled={
         isReindexingDocument ||
         isProcessing ||
         isAnalyzingDocument ||
         isSendingMessage ||
         isRecordingDocument ||
         !uploaded
        }
       >
        Send
       </Button>
      </div>
     </form>
    </CardContent>
   </Card>
  </section>
 );
}

export default ChatForm;
