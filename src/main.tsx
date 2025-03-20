import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./redux/store.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
 <StrictMode>
  <Provider store={store}>
   <QueryClientProvider client={queryClient}>
    <BrowserRouter>
     <Routes>
      <Route path="/*" element={<App />} />
     </Routes>
    </BrowserRouter>
   </QueryClientProvider>
  </Provider>
 </StrictMode>,
);
