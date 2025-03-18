import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "../ui/label";

const formSchema = z.object({
 question: z.string().min(1, "Please enter a question"),
 document: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function ChatForm() {
 const [fileName, setFileName] = useState<string>("No file chosen");
 const [isUploading, setIsUploading] = useState<boolean>(false);

 const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   question: "",
  },
 });

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   setFileName(file.name);
   form.setValue("document", file);
  }
 };

 const handleUpload = () => {
  const file = form.getValues("document");
  if (!file) return;

  setIsUploading(true);

  setTimeout(() => {
   setIsUploading(false);

   console.log("File uploaded:", file.name);
  }, 1500);
 };

 const onSubmit = (data: FormValues) => {
  console.log("Form submitted:", data);
 };

 return (
  <section className="w-full max-w-[750px] mx-auto space-y-[25px]">
   <Card className="px-[20px] pt-[20px] pb-10">
    <Label className="block text-primary font-semibold tracking-[-2%] mb-5">Upload Document</Label>
    <CardContent className="p-0 flex flex-col gap-3 xs:flex-row items-center justify-between">
     <div className="flex items-center gap-2 min-w-[250px] w-full xs:w-auto">
      <label
       htmlFor="fileInput"
       className="text-[11px] bg-secondary px-[15px] py-[11px] rounded-[10px] cursor-pointer text-primary font-semibold tracking-[-2%]"
      >
       Choose File
      </label>
      <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
      <span className="text-primary text-[11px] tracking-[-2%]">{fileName}</span>
     </div>
     <Button
      onClick={handleUpload}
      disabled={!form.getValues("document") || isUploading}
      className="bg-primary text-white w-full xs:w-auto"
     >
      {isUploading ? "Uploading..." : "Upload"}
     </Button>
    </CardContent>
   </Card>

   <Card className="px-[20px] pt-[20px] pb-10">
    <CardContent className="p-0">
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
        <Button type="submit" className="bg-primary text-white">
         Send
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
