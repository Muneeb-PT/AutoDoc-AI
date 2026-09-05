import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";

const Analyze = lazy(() => import("./pages/Analyze.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Payment = lazy(() => import("./pages/Payment.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const History = lazy(() => import("./pages/History.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 size={28} className="animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter
          basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/history" element={<History />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
