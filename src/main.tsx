import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
 <StrictMode>
  <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={queryClient}>
     <BrowserRouter>
      <Routes>
       <Route path="/*" element={<App />} />
      </Routes>
     </BrowserRouter>
    </QueryClientProvider>
   </PersistGate>
  </Provider>
 </StrictMode>,
);
