import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import { Loader2, User, FileText, Download } from "lucide-react";
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
 summary?: string;
 summaryHtml?: string;
 content: string;
 contentHtml?: string;
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
 const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

 const markdownToHtml = (markdown: string): string => {
  try {
   return marked.parse(markdown, { async: false }) as string;
  } catch (error) {
   console.error("Error parsing markdown:", error);
   return markdown;
  }
 };

 useEffect(() => {
  const message: Message = {
   id: `ai-${Date.now()}`,
   summary: "**Likelihood of AI Usage: 2 (Unlikely)**",
   content: `### Analysis:

Upon reviewing the content of the uploaded document titled *"Shopify.docx"*, the following observations were made:

#### Indicators of AI Authorship:
1. **Structured Organisation**: The document is well-organised, with clear headings and subheadings such as "Understanding Shopify," "Shopify Development Tools and Technologies," and "Shopify API." This level of structure is characteristic of both human and AI-generated content.
2. **Neutral Tone and Formality**: The tone is formal and neutral, which is typical of professional or technical writing. However, this does not strongly indicate AI authorship as it aligns with the expected style for such a topic.
3. **Absence of Personalisation**: The text lacks personal anecdotes, subjective opinions, or emotional depth, which are often absent in AI-generated content. However, this is also appropriate for the technical nature of the document.

#### Indicators of Human Authorship:
1. **Technical Accuracy and Contextual Relevance**: The content demonstrates a clear understanding of Shopify development, including specific tools (e.g., Shopify CLI, Liquid, APIs) and technologies (e.g., Node.js, Python, Ruby on Rails). This level of detail suggests domain expertise, which is more indicative of human authorship.
2. **Natural Language Flow**: The phrasing and sentence structures appear natural and free from the repetitive patterns or unnatural idioms often found in AI-generated text.
3. **No Overuse of Passive Voice**: The document uses active voice predominantly, which is a common trait of human writing.
4. **No Excessive Formality or Advanced Vocabulary**: The vocabulary is appropriate for the subject matter and does not exhibit the excessive formality or overly complex language sometimes seen in AI-generated content.

#### Ambiguities:
- The document's technical nature and lack of personalisation could be misconstrued as AI-generated. However, these traits are consistent with the expected style for a professional guide on Shopify development.

---

### Recommendation:

Based on the analysis, the likelihood of AI involvement in the creation of this document is **Unlikely (2)**. The content demonstrates technical expertise, natural language flow, and appropriate tone, all of which align with human authorship. 

However, to ensure a thorough evaluation:
1. **Human Review**: It is recommended that an educator or subject matter expert reviews the document for any stylistic or contextual inconsistencies that may not be apparent through automated analysis.
2. **Comparison with Student's Previous Work**: If applicable, compare the document's style and complexity with the student's prior submissions to identify any significant deviations.

This approach will help confirm the authenticity of the document while maintaining fairness and academic integrity.`,
   isUser: false,
  };
  message.contentHtml = markdownToHtml(message.content);
  message.summaryHtml = markdownToHtml(message?.summary || "");
  setMessages([message]);
 }, []);

 const { mutate: uploadDocument, isPending: isUploadingDocument } = useUploadDocument(
  data => {
   toast.success(data.message);
   setSourceId(String(data.sourceId));
   setFileName(data.fileName);
   setUploaded(true);

   const systemMessage: Message = {
    id: `system-${Date.now()}`,
    summary: "",
    summaryHtml: "",
    content: `Document "${fileName}" uploaded successfully.`,
    contentHtml: `Document "${fileName}" uploaded successfully.`,
    isUser: false,
   };

   setMessages(prev => [...prev, systemMessage]);
  },
  err => {
   toast.error(`Upload failed: ${err}`);
   setUploaded(false);
  },
 );

 const {
  mutate: analyzeDocument,
  isPending: isAnalyzingDocument,
  error: analyzeDocumentError,
 } = useAnalyzeDocument(
  data => {
   setSessionId(data.conversationId);

   const detailedAnalysisHtml = markdownToHtml(data.detailedAnalysis);
   const summaryHtml = data.summary ? markdownToHtml(data.summary) : "";

   setMessages(prev =>
    prev.map(msg => {
     if (msg.pending) {
      const aiMessage: Message = {
       id: `ai-${Date.now()}`,
       summary: data.summary || "",
       summaryHtml: summaryHtml,
       content: data.detailedAnalysis,
       contentHtml: detailedAnalysisHtml,
       isUser: false,
      };
      return aiMessage;
     }
     return msg;
    }),
   );

   console.log(data.summary, data.detailedAnalysis),
    setTimeout(() => {
     scrollToBottom();
    }, 100);
  },
  err => {
   toast.error(`Analysis failed: ${err}`);
   setMessages(prev => prev.filter(msg => !msg.pending));
  },
 );

 const {
  mutate: sendMessage,
  isPending: isSendingMessage,
  error: sendMessageError,
 } = useSendMessage(
  data => {
   const detailedResponseHtml = markdownToHtml(data.detailedResponse);
   const summaryHtml = data.summary ? markdownToHtml(data.summary) : "";

   setMessages(prev =>
    prev.map(msg => {
     if (msg.pending) {
      const aiMessage: Message = {
       id: `ai-${Date.now()}`,
       summary: data.summary || "",
       summaryHtml: summaryHtml,
       content: data.detailedResponse,
       contentHtml: detailedResponseHtml,
       isUser: false,
      };
      return aiMessage;
     }
     return msg;
    }),
   );

   console.log(data.summary, data.detailedResponse);

   setTimeout(() => {
    scrollToBottom();
   }, 100);
  },
  err => {
   toast.error(`Failed to get response: ${err}`);
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
   content: data.question,
   contentHtml: data.question,
   isUser: true,
  };

  const pendingMessage: Message = {
   id: `pending-${Date.now()}`,
   content: "",
   contentHtml: "",
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

 useEffect(() => {
  if (analyzeDocumentError) {
   toast.error(`Analysis error: ${analyzeDocumentError.message}`);
  }
  if (sendMessageError) {
   toast.error(`Message error: ${sendMessageError.message}`);
  }
 }, [analyzeDocumentError, sendMessageError]);

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
     {messages.length > 0 && !messages[messages.length - 1].pending && (
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
     )}
    </div>
    <CardContent
     ref={chatContainerRef}
     className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto mb-4 p-2"
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
          "flex items-start gap-2 max-w-[80%] rounded-lg p-3",
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
             __html:
              message.summaryHtml && message.contentHtml
               ? `${message.summaryHtml}${message.contentHtml}`
               : message.contentHtml || message.content,
            }}
            id="gpt-response-container"
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
