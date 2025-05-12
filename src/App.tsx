
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConsultationProvider } from "./context/ConsultationContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Confirmation from "./pages/Confirmation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DoctorRecommendation from "./components/DoctorRecommendation";
import BookingFlow from "./components/BookingFlow";
import ConsultationHistory from "./components/ConsultationHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConsultationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/doctors" element={<DoctorRecommendation />} />
                <Route path="/booking" element={<BookingFlow />} />
                <Route path="/history" element={<ConsultationHistory />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ConsultationProvider>
  </QueryClientProvider>
);

export default App;
