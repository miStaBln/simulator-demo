
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import StarredIndices from "./pages/StarredIndices";
import IndexDetails from "./pages/IndexDetails";
import NotFound from "./pages/NotFound";
import SideLayout from "./components/SideLayout";
import { StarredProvider } from "./contexts/StarredContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StarredProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/simulator" replace />} />
            <Route path="/simulator" element={
              <SideLayout>
                <Index />
              </SideLayout>
            } />
            <Route path="/inventory" element={
              <SideLayout>
                <Inventory />
              </SideLayout>
            } />
            <Route path="/starred" element={
              <SideLayout>
                <StarredIndices />
              </SideLayout>
            } />
            <Route path="/index-details" element={
              <SideLayout>
                <IndexDetails />
              </SideLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StarredProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
