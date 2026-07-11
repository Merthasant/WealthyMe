import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthChecker from "./checker/auth.checker.tsx";
import ProfileChecker from "./checker/profile.checker.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthChecker>
        <ProfileChecker>
          <App />
        </ProfileChecker>
      </AuthChecker>
    </QueryClientProvider>
  </StrictMode>,
);
