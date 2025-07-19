import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Customers from "./pages/Customers";
import CustomerTickets from "./pages/CustomerTickets";
import CustomerSales from "./pages/CustomerSales";
import Events from "./pages/Events";
import EventSessions from "./pages/EventSessions";
import SessionLots from "./pages/SessionLots";
import Financeiro from "./pages/Financeiro";
import Vendas from "./pages/Vendas";
import Produtores from "./pages/Produtores";
import Locais from "./pages/Locais";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/alterar-senha" element={<ChangePassword />} />
            <Route path="/" element={
              <Layout>
                {(props) => <Index {...props} />}
              </Layout>
            } />
            <Route path="/clientes" element={<Layout><Customers /></Layout>} />
            <Route path="/clientes/:customerId/ingressos" element={<Layout><CustomerTickets /></Layout>} />
            <Route path="/clientes/:customerId/vendas" element={<Layout><CustomerSales /></Layout>} />
            <Route path="/eventos" element={<Layout><Events /></Layout>} />
            <Route path="/eventos/:eventId/sessoes" element={<Layout><EventSessions /></Layout>} />
            <Route path="/eventos/:eventId/sessoes/:sessionId/lotes" element={<Layout><SessionLots /></Layout>} />
            <Route path="/financeiro" element={<Layout><Financeiro /></Layout>} />
            <Route path="/vendas" element={<Layout><Vendas /></Layout>} />
            <Route path="/produtores" element={<Layout><Produtores /></Layout>} />
            <Route path="/locais" element={<Layout><Locais /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
