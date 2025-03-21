import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "../ui/label";
import { useAnalyzeDocument, useSendMessage, useUploadDocument } from "@/services/chat-services";
import { UploadDocumentPayload } from "@/types/chat-types";
import toast from "react-hot-toast";
import {
 Loader2,
 User,
 FileText,
 // Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
 return `<br/><h${depth}><strong>${text}</strong></h${depth}>`;
};

marked.setOptions({
 renderer: renderer,
 breaks: false,
 gfm: false,
});

const formSchema = z.object({
 question: z.string().min(1, "Please enter a question"),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
 id: string;
 aiResponse: string;
 aiResponseHtml?: string;
 isUser: boolean;
 pending?: boolean;
};

function ChatForm() {
 const fileInputRef = useRef<HTMLInputElement>(null);
 const chatContainerRef = useRef<HTMLDivElement>(null);
 const [fileName, setFileName] = useState<string>("No file chosen");
 const [uploaded, setUploaded] = useState<boolean>(false);
 const [sourceId, setSourceId] = useState<string>("");
 const [sessionId, setSessionId] = useState<string>("");
 const [messages, setMessages] = useState<Message[]>([]);
 // const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

 const markdownToHtml = (markdown: string): string => {
  try {
   return marked.parse(markdown, { async: false }) as string;
  } catch (error) {
   console.error("Error parsing markdown:", error);
   return markdown;
  }
 };

 const { mutate: uploadDocument, isPending: isUploadingDocument } = useUploadDocument(
  data => {
   toast.success(data.message);
   setSourceId(String(data.sourceId));
   setFileName(data.fileName);
   setUploaded(true);

   const systemMessage: Message = {
    id: `system-${Date.now()}`,
    aiResponse: `Document "${fileName}" uploaded successfully.`,
    aiResponseHtml: `Document "${fileName}" uploaded successfully.`,
    isUser: false,
   };

   setMessages(prev => [...prev, systemMessage]);
  },
  () => {
   setUploaded(false);
  },
 );

 const { mutate: analyzeDocument, isPending: isAnalyzingDocument } = useAnalyzeDocument(
  data => {
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

   console.log(data.aiResponse),
    setTimeout(() => {
     scrollToBottom();
    }, 100);
  },
  () => {
   setMessages(prev => prev.filter(msg => !msg.pending));
  },
 );

 const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage(
  data => {
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

   console.log(data.aiResponse);

   setTimeout(() => {
    scrollToBottom();
   }, 100);
  },
  () => {
   setMessages(prev => prev.filter(msg => !msg.pending));
  },
 );

 const scrollToBottom = () => {
  if (chatContainerRef.current) {
   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
 };

 const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   question: "",
  },
 });

 const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   setFileName(file.name);
   setUploaded(false);
  }
 };

 const handleUpload = () => {
  const fileInput = fileInputRef.current;
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const payload: UploadDocumentPayload = { file };
  uploadDocument(payload);
 };

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

  form.reset();

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

 return (
  <section className="w-full max-w-[750px] mx-auto space-y-[25px]">
   {/* File Upload Section */}
   <Card className="px-[20px] pt-[20px] pb-10">
    <Label className="block text-primary font-semibold tracking-[-2%] mb-5">Upload Document</Label>
    <CardContent className="p-0 flex flex-col gap-3 xs:flex-row items-center justify-between">
     <div className="flex items-center gap-2 min-w-[250px] w-full xs:w-auto">
      <label
       tabIndex={0}
       htmlFor="fileInput"
       className="text-[11px] bg-secondary px-[15px] py-2 rounded-[10px] cursor-pointer text-primary font-semibold tracking-[-2%] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:outline-none"
       onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
         e.preventDefault();
         fileInputRef?.current?.click();
        }
       }}
      >
       Choose File
      </label>
      <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
      <span className="text-primary text-[11px] tracking-[-2%]">{fileName}</span>
     </div>
     <Button
      onClick={handleUpload}
      disabled={isUploadingDocument || uploaded || !fileInputRef.current?.files?.length}
      className="bg-primary text-white w-full xs:w-auto"
     >
      {isUploadingDocument ? "Uploading..." : "Upload"}
     </Button>
    </CardContent>
   </Card>

   {/* Chat Messages */}
   <Card className="px-[20px] pt-[20px] pb-6">
    <div className="flex justify-between items-center mb-5">
     <Label className="block text-primary font-semibold tracking-[-2%]">Conversation</Label>
     {/* {messages.length > 0 && !messages[messages.length - 1].pending && (
      <Button
       // onClick={generatePDF}
       disabled={isGeneratingPdf}
       size="sm"
       variant="outline"
       className="flex items-center gap-1 text-xs"
      >
       {isGeneratingPdf ? (
        <>
         <Loader2 size={14} className="animate-spin" /> Generating...
        </>
       ) : (
        <>
         <Download size={14} /> Download PDF
        </>
       )}
      </Button>
     )} */}
    </div>
    <CardContent
     ref={chatContainerRef}
     className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto mb-4 p-2 scroll-smooth"
    >
     {messages.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
       <FileText size={24} className="mb-2" />
       <p>Upload a document and ask questions</p>
      </div>
     ) : (
      messages.map(message => (
       <div key={message.id} className={cn("flex w-full", message.isUser ? "justify-end" : "justify-start")}>
        <div
         className={cn(
          "flex items-start gap-2 max-w-[80%] rounded-lg p-3 pr-7",
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
            id={`gpt-response-container-${message.id}`}
           />
          )}
         </div>
        </div>
       </div>
      ))
     )}
    </CardContent>
   </Card>

   {/* Question Form Section */}
   <Card className="px-[20px] pt-[20px] pb-10">
    <CardContent className="p-0">
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
         <FormItem>
          <FormControl>
           <Textarea
            placeholder="Ask a question about the document..."
            className="min-h-24 bg-white border-none text-primary text-sm sm:text-base"
            {...field}
           />
          </FormControl>
         </FormItem>
        )}
       />
       <div className="flex justify-end">
        <Button
         type="submit"
         className="bg-primary text-white"
         disabled={!uploaded || isAnalyzingDocument || isSendingMessage}
        >
         {isAnalyzingDocument || isSendingMessage ? (
          <>
           <Loader2 size={16} className="animate-spin" />
           Sending...
          </>
         ) : (
          "Send"
         )}
        </Button>
       </div>
      </form>
     </Form>
    </CardContent>
   </Card>
  </section>
 );
}

export default ChatForm;
