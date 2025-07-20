import { useState } from "react";
import { 
  Users, 
  Ticket, 
  DollarSign, 
  CreditCard, 
  QrCode,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from "lucide-react";

import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsePieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface AdminDashboardProps {
  selectedEvent: string;
  showFinancialValues: boolean;
  userRole: "total" | "producer" | "admin";
}

// Mock data
const ticketData = [
  { session: "Sessão 1", disponivel: 1000, vendido: 750, validado: 680 },
  { session: "Sessão 2", disponivel: 800, vendido: 600, validado: 540 },
  { session: "Sessão 3", disponivel: 1200, vendido: 900, validado: 820 },
  { session: "Sessão 4", disponivel: 600, vendido: 400, validado: 350 },
];

const dailySalesData = [
  { day: "01/12", vendas: 45000, ingressos: 150 },
  { day: "02/12", vendas: 67000, ingressos: 220 },
  { day: "03/12", vendas: 89000, ingressos: 290 },
  { day: "04/12", vendas: 112000, ingressos: 380 },
  { day: "05/12", vendas: 98000, ingressos: 320 },
  { day: "06/12", vendas: 134000, ingressos: 450 },
  { day: "07/12", vendas: 156000, ingressos: 520 },
];

const ticketTypeData = [
  { name: "Inteira", value: 45, color: "#8B5CF6" },
  { name: "Meia-entrada", value: 30, color: "#10B981" },
  { name: "Solidário", value: 15, color: "#F59E0B" },
  { name: "Promocional", value: 10, color: "#EF4444" },
];

const paymentMethodData = [
  { name: "Cartão de Crédito", value: 60, color: "#8B5CF6" },
  { name: "PIX", value: 35, color: "#10B981" },
  { name: "Dinheiro", value: 3, color: "#F59E0B" },
  { name: "Débito", value: 2, color: "#EF4444" },
];

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export function AdminDashboard({ selectedEvent, showFinancialValues, userRole }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState(selectedEvent);

  const eventName = currentSelectedEvent === "1" ? "Rock in Rio 2024" : 
                   currentSelectedEvent === "2" ? "Festival de Verão Salvador" :
                   currentSelectedEvent === "3" ? "Lollapalooza Brasil" : "Villa Mix Festival";

  const eventos = [
    { id: "1", nome: "Rock in Rio 2024" },
    { id: "2", nome: "Festival de Verão Salvador" },
    { id: "3", nome: "Lollapalooza Brasil" },
    { id: "4", nome: "Villa Mix Festival" }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Event Filter - Above title */}
      <div className="flex justify-start">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Evento:</span>
          <Select
            value={currentSelectedEvent}
            onValueChange={setCurrentSelectedEvent}
          >
            <SelectTrigger className="w-[200px] h-8 text-sm">
              <SelectValue placeholder="Selecione um evento" />
            </SelectTrigger>
            <SelectContent>
              {eventos.map((evento) => (
                <SelectItem key={evento.id} value={evento.id}>
                  {evento.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{eventName}</h1>
          <p className="text-muted-foreground">Dashboard de controle e métricas</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-success/20 text-success">
            <Calendar className="h-3 w-3 mr-1" />
            Evento Ativo
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Clientes"
          value={formatNumber(2847)}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          description="Únicos registrados"
        />
        <StatCard
          title="Ingressos Vendidos"
          value={formatNumber(1520)}
          icon={Ticket}
          trend={{ value: 8.2, isPositive: true }}
          description="De 2000 disponíveis"
        />
        <StatCard
          title="Financeiro Total"
          value={formatCurrency(456789)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          description="Receita bruta"
          isFinancial
          showValue={showFinancialValues}
        />
        <StatCard
          title="Taxa Ticket Ideal"
          value={formatCurrency(12450)}
          icon={TrendingUp}
          trend={{ value: 5.7, isPositive: true }}
          description="Comissão da plataforma"
          isFinancial
          showValue={showFinancialValues}
        />
      </div>

      {/* Additional Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Taxa Bancária"
          value={formatCurrency(8900)}
          icon={CreditCard}
          description="Taxas de processamento"
          isFinancial
          showValue={showFinancialValues}
        />
        <StatCard
          title="Vendas Cartão"
          value={formatCurrency(274073)}
          icon={CreditCard}
          description="60% do total"
          isFinancial
          showValue={showFinancialValues}
        />
        <StatCard
          title="Vendas PIX"
          value={formatCurrency(159876)}
          icon={QrCode}
          description="35% do total"
          isFinancial
          showValue={showFinancialValues}
        />
        <StatCard
          title="Total de Vendas"
          value={formatCurrency(456789)}
          icon={DollarSign}
          description="Valor total vendido"
          isFinancial
          showValue={showFinancialValues}
        />
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ticket Status Chart */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Status dos Ingressos por Sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ticketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="disponivel" name="Disponível" fill="#E5E7EB" />
                    <Bar dataKey="vendido" name="Vendido" fill="#8B5CF6" />
                    <Bar dataKey="validado" name="Validado" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Sales Chart */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vendas Diárias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'vendas' ? formatCurrency(value as number) : value,
                        name === 'vendas' ? 'Vendas' : 'Ingressos'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      name="vendas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ticket Types */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Tipos de Ingressos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsePieChart>
                    <Pie
                      data={ticketTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Formas de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsePieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-gradient-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-card-foreground">Relatório de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Relatórios detalhados de vendas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-gradient-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-card-foreground">Analytics Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Análises avançadas e métricas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}