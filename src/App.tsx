
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import StarredIndices from "./pages/StarredIndices";
import IndexDetails from "./pages/IndexDetails";
import Dashboards from "./pages/Dashboards";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SideLayout from "./components/SideLayout";
import { StarredProvider } from "./contexts/StarredContext";
import ChatBot from "./components/ChatBot";
import DashboardEditor from "./components/dashboards/DashboardEditor";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <ChatBot />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StarredProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/simulator" element={
              <ProtectedRoute>
                <SideLayout>
                  <Index />
                </SideLayout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <SideLayout>
                  <Inventory />
                </SideLayout>
              </ProtectedRoute>
            } />
            <Route path="/starred" element={
              <ProtectedRoute>
                <SideLayout>
                  <StarredIndices />
                </SideLayout>
              </ProtectedRoute>
            } />
            <Route path="/index-details" element={
              <ProtectedRoute>
                <SideLayout>
                  <IndexDetails />
                </SideLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboards" element={
              <ProtectedRoute>
                <SideLayout>
                  <Dashboards />
                </SideLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard-editor" element={
              <ProtectedRoute>
                <SideLayout>
                  <DashboardEditor onSave={(name, widgets) => {
                    // This gets the Dashboards component to handle the save
                    window.location.href = '/dashboards';
                    // Store the data in localStorage for retrieval
                    localStorage.setItem('newDashboardData', JSON.stringify({ name, widgets }));
                  }} />
                </SideLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StarredProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
