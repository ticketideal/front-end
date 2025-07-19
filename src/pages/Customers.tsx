import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  Edit,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  FileText,
  Download,
  MessageCircle,
  TrendingUp,
  Building2,
  FileSpreadsheet,
  FileImage,
  ChevronDown
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data dos clientes
const mockCustomers = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    cpf: "123.456.789-01",
    telefone: "(11) 99999-1234",
    ingressos: 5,
    valorTotal: 1500.00,
    dataCompra: "2024-12-10",
    status: "Pago",
    
    totalVendas: 3,
    produtores: ["Rock Productions", "Music Events BR"]
  },
  {
    id: "2", 
    nome: "João Santos",
    email: "joao.santos@gmail.com",
    cpf: "987.654.321-09",
    telefone: "(21) 98888-5678",
    ingressos: 1,
    valorTotal: 300.00,
    dataCompra: "2024-12-09",
    status: "Pago",
    totalVendas: 1,
    produtores: ["Rock Productions"]
  },
  {
    id: "3",
    nome: "Ana Oliveira", 
    email: "ana.oliveira@yahoo.com",
    cpf: "456.789.123-45",
    telefone: "(11) 97777-9012",
    ingressos: 7,
    valorTotal: 2100.00,
    dataCompra: "2024-12-08",
    status: "Pendente",
    
    totalVendas: 4,
    produtores: ["Music Events BR", "Festival Organizer", "Rock Productions"]
  },
  {
    id: "4",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@empresa.com",
    cpf: "789.123.456-78",
    telefone: "(31) 96666-3456",
    ingressos: 2,
    valorTotal: 600.00,
    dataCompra: "2024-12-07",
    status: "Pago",
    
    totalVendas: 2,
    produtores: ["Festival Organizer", "Music Events BR"]
  },
  {
    id: "5",
    nome: "Lucia Costa",
    email: "lucia.costa@outlook.com",
    cpf: "321.654.987-12",
    telefone: "(41) 95555-7890",
    ingressos: 3,
    valorTotal: 900.00,
    dataCompra: "2024-12-06",
    status: "Pago",
    
    totalVendas: 2,
    produtores: ["Rock Productions"]
  }
];

export default function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    nome: true,
    email: true,
    cpf: true,
    telefone: true,
    ingressos: true,
    vendas: true,
    produtores: true
  });

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cpf.includes(searchTerm) ||
    customer.telefone.includes(searchTerm)
  );

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
      "Cancelado": "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>;
  };

  const handleEdit = (customer: typeof mockCustomers[0]) => {
    setEditingCustomer({...customer});
  };

  const handleSaveEdit = () => {
    // Aqui implementaria a lógica de salvamento
    console.log("Salvando cliente:", editingCustomer);
    setEditingCustomer(null);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    const columnsToExport = Object.entries(selectedColumns)
      .filter(([_, selected]) => selected)
      .map(([column, _]) => column);
    
    console.log(`Exportando para ${format} com colunas:`, columnsToExport);
    // Aqui implementaria a lógica de exportação
    setExportDialogOpen(false);
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev]
    }));
  };

  const columnLabels = {
    nome: "Nome",
    email: "Email", 
    cpf: "CPF",
    telefone: "Telefone",
    ingressos: "Ingressos",
    vendas: "Vendas",
    produtores: "Produtores"
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground">Informações dos compradores de ingressos</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Exportar Dados</DialogTitle>
                <DialogDescription>
                  Escolha o formato e as colunas para exportar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Seleção de Colunas */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Colunas para Exportar</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(columnLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          checked={selectedColumns[key as keyof typeof selectedColumns]}
                          onCheckedChange={() => toggleColumn(key)}
                        />
                        <Label 
                          htmlFor={key} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de Exportação */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Formato</Label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleExport('excel')}
                      className="flex-1"
                      disabled={Object.values(selectedColumns).every(v => !v)}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button 
                      onClick={() => handleExport('pdf')}
                      variant="outline"
                      className="flex-1"
                      disabled={Object.values(selectedColumns).every(v => !v)}
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, CPF, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{filteredCustomers.length}</div>
              <div className="text-sm text-muted-foreground">Clientes encontrados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <div className="text-sm text-muted-foreground">Total de Clientes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">{formatCurrency(mockCustomers.reduce((sum, c) => sum + c.valorTotal, 0))}</div>
            <div className="text-sm text-muted-foreground">Receita Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{mockCustomers.reduce((sum, c) => sum + c.ingressos, 0)}</div>
            <div className="text-sm text-muted-foreground">Ingressos Vendidos</div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Ingressos</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Produtores</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.nome}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <a 
                            href={`mailto:${customer.email}`}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {customer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-green-500" />
                          <a 
                            href={`https://wa.me/${customer.telefone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-500 hover:underline"
                          >
                            {customer.telefone}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{customer.cpf}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/clientes/${customer.id}/ingressos`)}
                        className="h-8 px-2"
                      >
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                          {customer.ingressos}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/clientes/${customer.id}/vendas`)}
                        className="h-8 px-2"
                      >
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                          <TrendingUp className="h-4 w-4" />
                          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                            {customer.totalVendas}
                          </Badge>
                        </div>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.produtores.slice(0, 2).map((produtor, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-primary" />
                            <span className="text-xs">{produtor}</span>
                          </div>
                        ))}
                        {customer.produtores.length > 2 && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              +{customer.produtores.length - 2} mais
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Cliente</DialogTitle>
                              <DialogDescription>
                                Edite as informações do cliente
                              </DialogDescription>
                            </DialogHeader>
                            {editingCustomer && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="nome">Nome</Label>
                                  <Input
                                    id="nome"
                                    value={editingCustomer.nome}
                                    onChange={(e) => setEditingCustomer({...editingCustomer, nome: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={editingCustomer.email}
                                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="telefone">Telefone</Label>
                                  <Input
                                    id="telefone"
                                    value={editingCustomer.telefone}
                                    onChange={(e) => setEditingCustomer({...editingCustomer, telefone: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cpf">CPF</Label>
                                  <Input
                                    id="cpf"
                                    value={editingCustomer.cpf}
                                    onChange={(e) => setEditingCustomer({...editingCustomer, cpf: e.target.value})}
                                  />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                  <Button variant="outline" onClick={() => setEditingCustomer(null)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={handleSaveEdit}>
                                    Salvar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}