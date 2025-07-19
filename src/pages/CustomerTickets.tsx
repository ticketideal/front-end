import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Ticket,
  Calendar,
  MapPin,
  CreditCard,
  User,
  Clock,
  CheckCircle,
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

// Mock data dos ingressos
const mockTickets = [
  {
    id: "T001",
    evento: "Rock in Rio 2024",
    tipo: "Pista Premium",
    setor: "Pista A",
    valor: 300.00,
    data: "2024-12-15",
    horario: "20:00",
    local: "Cidade do Rock - RJ",
    status: "Ativo",
    qrCode: "QR123456789",
    portao: "Portão 3"
  },
  {
    id: "T002", 
    evento: "Rock in Rio 2024",
    tipo: "Pista Premium",
    setor: "Pista A",
    valor: 300.00,
    data: "2024-12-15",
    horario: "20:00",
    local: "Cidade do Rock - RJ",
    status: "Ativo",
    qrCode: "QR123456790",
    portao: "Portão 3"
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

export default function CustomerTickets() {
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
      "Ativo": "default",
      "Usado": "secondary", 
      "Cancelado": "destructive",
      "Expirado": "outline"
    } as const;
    
    const icons = {
      "Ativo": CheckCircle,
      "Usado": Clock,
      "Cancelado": XCircle,
      "Expirado": XCircle
    };
    
    const Icon = icons[status as keyof typeof icons] || CheckCircle;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

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
              <Ticket className="h-8 w-8" />
              Ingressos do Cliente
            </h1>
            <p className="text-muted-foreground">Ingressos de {customer.nome}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Ticket className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{mockTickets.length}</div>
            <div className="text-sm text-muted-foreground">Total de Ingressos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">{formatCurrency(mockTickets.reduce((sum, t) => sum + t.valor, 0))}</div>
            <div className="text-sm text-muted-foreground">Valor Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{mockTickets.filter(t => t.status === "Ativo").length}</div>
            <div className="text-sm text-muted-foreground">Ingressos Ativos</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Lista de Ingressos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Tipo/Setor</TableHead>
                  <TableHead>Data/Horário</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                    <TableCell className="font-medium">{ticket.evento}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.tipo}</div>
                        <div className="text-sm text-muted-foreground">{ticket.setor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <div className="text-sm">{formatDate(ticket.data)}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.horario}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <div>
                          <div className="text-sm">{ticket.local}</div>
                          <div className="text-xs text-muted-foreground">{ticket.portao}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(ticket.valor)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs bg-muted p-2 rounded">
                        {ticket.qrCode}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {mockTickets.length === 0 && (
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhum ingresso encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}