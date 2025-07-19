import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  TrendingUp,
  Calendar,
  CreditCard,
  User,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data das vendas
const mockSales = [
  {
    id: "V001",
    evento: "Rock in Rio 2024",
    quantidade: 2,
    valorUnitario: 300.00,
    valorTotal: 600.00,
    dataCompra: "2024-12-10",
    status: "Pago",
    metodoPagamento: "Cartão de Crédito",
    parcelas: "3x",
    observacoes: "Compra realizada pelo site"
  },
  {
    id: "V002",
    evento: "Festival de Verão 2025",
    quantidade: 1,
    valorUnitario: 250.00,
    valorTotal: 250.00,
    dataCompra: "2024-11-28",
    status: "Pendente",
    metodoPagamento: "PIX",
    parcelas: "À vista",
    observacoes: "Aguardando confirmação do pagamento"
  },
  {
    id: "V003",
    evento: "Show Acústico 2024",
    quantidade: 4,
    valorUnitario: 150.00,
    valorTotal: 600.00,
    dataCompra: "2024-11-15",
    status: "Pago",
    metodoPagamento: "Boleto",
    parcelas: "À vista",
    observacoes: "Compra para família"
  }
];

const mockCustomers = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    cpf: "123.456.789-01",
    telefone: "(11) 99999-1234"
  },
  {
    id: "2", 
    nome: "João Santos",
    email: "joao.santos@gmail.com",
    cpf: "987.654.321-09",
    telefone: "(21) 98888-5678"
  },
  {
    id: "3",
    nome: "Ana Oliveira", 
    email: "ana.oliveira@yahoo.com",
    cpf: "456.789.123-45",
    telefone: "(11) 97777-9012"
  },
  {
    id: "4",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@empresa.com",
    cpf: "789.123.456-78",
    telefone: "(31) 96666-3456"
  },
  {
    id: "5",
    nome: "Lucia Costa",
    email: "lucia.costa@outlook.com",
    cpf: "321.654.987-12",
    telefone: "(41) 95555-7890"
  }
];

export default function CustomerSales() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const customer = mockCustomers.find(c => c.id === customerId);
  
  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cliente não encontrado</h1>
          <Button onClick={() => navigate('/clientes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Clientes
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Pago": "default",
      "Pendente": "secondary",
      "Cancelado": "destructive",
      "Estornado": "outline"
    } as const;
    
    const icons = {
      "Pago": CheckCircle,
      "Pendente": Clock,
      "Cancelado": XCircle,
      "Estornado": XCircle
    };
    
    const Icon = icons[status as keyof typeof icons] || CheckCircle;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      "Cartão de Crédito": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "PIX": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Boleto": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Débito": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {method}
      </span>
    );
  };

  const totalVendas = mockSales.reduce((sum, sale) => sum + sale.valorTotal, 0);
  const vendasPagas = mockSales.filter(sale => sale.status === "Pago");
  const totalIngressos = mockSales.reduce((sum, sale) => sum + sale.quantidade, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/clientes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              Vendas do Cliente
            </h1>
            <p className="text-muted-foreground">Histórico de vendas de {customer.nome}</p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg font-semibold">{customer.nome}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CPF</p>
              <p className="text-sm font-mono">{customer.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p className="text-sm">{customer.telefone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{mockSales.length}</div>
            <div className="text-sm text-muted-foreground">Total de Vendas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">{formatCurrency(totalVendas)}</div>
            <div className="text-sm text-muted-foreground">Valor Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{vendasPagas.length}</div>
            <div className="text-sm text-muted-foreground">Vendas Pagas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{totalIngressos}</div>
            <div className="text-sm text-muted-foreground">Ingressos Comprados</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Histórico de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                    <TableCell className="font-medium">{sale.evento}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{sale.quantidade}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(sale.valorUnitario)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(sale.valorTotal)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(sale.dataCompra)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getPaymentMethodBadge(sale.metodoPagamento)}
                        <div className="text-xs text-muted-foreground">{sale.parcelas}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sale.status)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate" title={sale.observacoes}>
                        {sale.observacoes}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {mockSales.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhuma venda encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}