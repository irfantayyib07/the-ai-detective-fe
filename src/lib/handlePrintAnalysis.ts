import { Message } from "@/types/chat-types";
import toast from "react-hot-toast";

export const handlePrintResponse = (
 message: Message,
 setDownloadingMessageId: React.Dispatch<React.SetStateAction<string | null>>,
 fileName: string,
) => {
 if (message.isUser || message.pending) return;

 setDownloadingMessageId(message.id);

 try {
  const contentToPrint = message.aiResponseHtml || message.aiResponse;
  const logoUrl = "https://the-ai-detective-fe.vercel.app/logo.png";

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
   toast.error("Popup blocked. Please allow popups for this site.");
   setDownloadingMessageId(null);
   return;
  }

  printWindow.document.head.innerHTML = `
      <title>Analysis Report for ${fileName}</title>
      <style>
        @page {
          size: A4;
          margin: 1.5cm;
        }
        * {
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.5;
          background-color: #fff;
          font-size: 12pt;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .container {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;  /* Increased spacing after header */
          padding-bottom: 15px;
          border-bottom: 1px solid #ddd;
        }
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }
        .logo {
          width: 120px;
          height: auto;
        }
        .header h1 {
          font-size: 16pt;
          margin: 0 0 5px 0;
          color: #01211C;
        }
        .header p {
          color: #01211C;
          font-size: 10pt;
          margin: 0;
        }
        .content {
          flex-grow: 1;
        }
        .content p {
          margin: 0 0 8px 0;
          line-height: 1.4;
          text-align: left;
        }
        .footer {
          margin-top: 60px;  /* Increased spacing after content */
          padding-top: 15px;
          text-align: center;
          font-size: 10pt;
          color: #01211C;
          border-top: 1px solid #ddd;
        }
        .footer-logo {
          width: 80px;
          height: auto;
          margin-bottom: 5px;
        }
        .footer p {
          margin: 0;
        }
        h1, h2, h3, h4, h5, h6 {
          margin: 12px 0 6px 0;
          color: #01211C;
          page-break-after: avoid;
        }
        h2 { font-size: 15pt; }
        h3 { font-size: 13pt; }
        h4 { font-size: 12pt; }
        h5 { font-size: 11pt; }
        h6 { font-size: 10pt; }
        
        ul, ol {
          padding-left: 20px;
          margin: 8px 0;
        }
        li {
          margin-bottom: 4px;
        }
        
        code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: Consolas, Monaco, 'Andale Mono', monospace;
          font-size: 11pt;
        }
        pre {
          background-color: #f3f4f6;
          padding: 8px;
          border-radius: 3px;
          overflow-x: auto;
          font-family: Consolas, Monaco, 'Andale Mono', monospace;
          font-size: 10pt;
          margin: 8px 0;
          white-space: pre-wrap;
          page-break-inside: avoid;
        }
        
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 6px;
          text-align: left;
          font-size: 11pt;
        }
        th {
          background-color: #f8fafc;
        }
        
        /* Prevent page breaks inside paragraphs */
        p {
          page-break-inside: avoid;
        }
        
        /* Ensure that headings don't get orphaned */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
        }
        
        @media print {
          .no-print {
            display: none;
          }
        }
        
        /* Loading indicator */
        .loading-indicator {
          position: fixed;
          top: 10px;
          right: 10px;
          background: #01211C;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 9999;
        }
      </style>
    `;

  printWindow.document.body.innerHTML = `
      <div id="loadingIndicator" class="loading-indicator no-print">
        Loading content and images...
      </div>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="${logoUrl}" alt="The Ai Detective Logo" class="logo" id="headerLogo">
          </div>
          <h1>Analysis Report for ${fileName}</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="content">
          ${contentToPrint}
        </div>
        
        <div class="footer">
          <img src="${logoUrl}" alt="The Ai Detective Logo" class="footer-logo" id="footerLogo">
          <p>Generated by The Ai Detective</p>
          <p>&copy; ${new Date().getFullYear()} The Ai Detective</p>
        </div>
      </div>
    `;

  const checkImagesLoaded = () => {
   const allImgs = Array.from(printWindow.document.querySelectorAll("img"));
   return allImgs.every(img => img.complete);
  };

  const printWithTimeout = () => {
   const loadingIndicator = printWindow.document.getElementById("loadingIndicator");
   if (loadingIndicator) {
    loadingIndicator.style.display = "none";
   }

   setTimeout(() => {
    printWindow.print();

    setTimeout(() => {
     setDownloadingMessageId(null);
    }, 500);
   }, 100);
  };

  const maxWaitTime = 3000;
  let waitStart = Date.now();

  const checkInterval = setInterval(() => {
   const timeElapsed = Date.now() - waitStart;

   if (checkImagesLoaded() || timeElapsed >= maxWaitTime) {
    clearInterval(checkInterval);
    printWithTimeout();
   } else {
    const loadingIndicator = printWindow.document.getElementById("loadingIndicator");
    if (loadingIndicator) {
     loadingIndicator.textContent = `Loading content and images... (${Math.round(
      (timeElapsed / maxWaitTime) * 100,
     )}%)`;
    }
   }
  }, 200);

  const controlsDiv = printWindow.document.createElement("div");
  controlsDiv.className = "no-print";
  controlsDiv.style.cssText =
   "position:fixed;top:10px;left:10px;z-index:9999;background:#fff;padding:10px;border:1px solid #ddd;border-radius:4px;";
  controlsDiv.innerHTML = `
      <button id="printNowBtn" style="margin-right:10px;padding:5px 10px;background:#01211C;color:white;border:none;border-radius:3px;cursor:pointer;">
        Print Now
      </button>
      <button id="closeBtn" style="padding:5px 10px;background:#f3f4f6;border:1px solid #ddd;border-radius:3px;cursor:pointer;">
        Close
      </button>
    `;
  printWindow.document.body.appendChild(controlsDiv);

  printWindow.document.getElementById("printNowBtn")?.addEventListener("click", () => {
   clearInterval(checkInterval);
   printWithTimeout();
  });

  printWindow.document.getElementById("closeBtn")?.addEventListener("click", () => {
   clearInterval(checkInterval);
   setDownloadingMessageId(null);
   printWindow.close();
  });

  printWindow.addEventListener("beforeunload", () => {
   setDownloadingMessageId(null);
  });
 } catch (error) {
  console.error("Error printing response:", error);
  toast.error("Failed to print response");
  setDownloadingMessageId(null);
 }
};
