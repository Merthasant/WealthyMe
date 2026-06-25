import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthCheck from "./check/auth.check.tsx";
import ProfileCheck from "./check/profile.check.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthCheck>
        <ProfileCheck>
          <App />
        </ProfileCheck>
      </AuthCheck>
    </QueryClientProvider>
  </StrictMode>,
);
