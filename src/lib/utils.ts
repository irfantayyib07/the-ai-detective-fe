import { clsx, type ClassValue } from "clsx";
import { marked } from "marked";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
 return `<br/><h${depth}><strong>${text}</strong></h${depth}>`;
};

marked.setOptions({
 renderer: renderer,
 breaks: false,
 gfm: false,
});

export const markdownToHtml = (markdown: string): string => {
 try {
  return marked.parse(markdown, { async: false }) as string;
 } catch (error) {
  console.error("Error parsing markdown:", error);
  return markdown;
 }
};
