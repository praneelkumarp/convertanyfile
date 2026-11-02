import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Convert from "./pages/Convert";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { AdSenseLoader } from "@/components/ads/AdSenseLoader";
import { RouteSeo } from "@/components/RouteSeo";
import MergePdf from "./pages/MergePdf";
import SplitPdf from "./pages/SplitPdf";
import CompressImage from "./pages/CompressImage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Loads AdSense script only after user consent */}
        <AdSenseLoader />
        <RouteSeo />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/compress-image" element={<CompressImage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Cookie consent banner — auto-hides after user decides */}
        <ConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
