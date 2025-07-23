import { useState, useMemo } from "react";
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
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  useCustomers,
  useUpdateCustomer,
  useExportCustomers,
} from "@/hooks/useCustomers";
import { Customer } from "@/services/customerService";

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
  TableRow,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [selectedColumns, setSelectedColumns] = useState({
    nome: true,
    email: true,
    cpf: true,
    telefone: true,
    ingressos: true,
    vendas: true,
    produtores: true,
  });

  // Parâmetros para a consulta da API
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
    }),
    [currentPage, itemsPerPage, searchTerm]
  );

  // Hooks para API
  const {
    data: customersResponse,
    isLoading,
    error,
  } = useCustomers(queryParams);
  const updateCustomer = useUpdateCustomer();
  const exportCustomers = useExportCustomers();

  // Reset página quando buscar
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pago: "default",
      Pendente: "secondary",
      Cancelado: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleSaveEdit = () => {
    if (editingCustomer) {
      updateCustomer.mutate(
        { id: editingCustomer.id, customer: editingCustomer },
        {
          onSuccess: () => {
            setEditingCustomer(null);
          },
        }
      );
    }
  };

  const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    const local = digits.startsWith("55") ? digits.slice(2) : digits;
    if (local.length === 11) {
      return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
    }
    if (local.length === 10) {
      return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
    }
    return phone;
  };

  const handleExport = (format: "excel" | "pdf") => {
    const filters = {
      search: searchTerm || undefined,
    };

    exportCustomers.mutate(
      { filters, format },
      {
        onSuccess: () => {
          setExportDialogOpen(false);
        },
      }
    );
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  };

  const columnLabels = {
    nome: "Nome",
    email: "Email",
    cpf: "CPF",
    telefone: "Telefone",
    ingressos: "Ingressos",
    vendas: "Vendas",
    produtores: "Produtores",
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Erro ao carregar clientes
            </div>
            <p className="text-muted-foreground">
              Verifique sua conexão e tente novamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const customers = customersResponse?.data || [];
  const totalCustomers = customersResponse?.total || 0;
  const totalPages = Math.ceil(
    Number(customersResponse?.total || 0) / itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground">
            Informações dos compradores de ingressos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={exportCustomers.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                {exportCustomers.isPending ? "Exportando..." : "Exportar"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Exportar Dados</DialogTitle>
                <DialogDescription>
                  Escolha o formato para exportar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExport("excel")}
                    className="flex-1"
                    disabled={exportCustomers.isPending}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    onClick={() => handleExport("pdf")}
                    variant="outline"
                    className="flex-1"
                    disabled={exportCustomers.isPending}
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
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
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {totalCustomers}
              </div>
              <div className="text-sm text-muted-foreground">
                Clientes encontrados
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="text-sm text-muted-foreground">
              Total de Clientes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">
              {formatCurrency(
                customers.reduce((sum, c) => sum + c.valorTotal, 0)
              )}
            </div>
            <div className="text-sm text-muted-foreground">Receita Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.ingressos, 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Ingressos Vendidos
            </div>
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
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhum cliente encontrado para esta busca"
                  : "Nenhum cliente cadastrado"}
              </p>
            </div>
          ) : (
            <>
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
                    {customers.map((customer) => (
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
                                href={`https://wa.me/${customer.telefone.replace(
                                  /\D/g,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-green-500 hover:underline"
                              >
                                {formatPhone(customer.telefone)}
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {customer.cpf}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/clientes/${customer.id}/ingressos`)
                            }
                            className="h-8 px-2"
                          >
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {customer.ingressos}
                            </Badge>
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/clientes/${customer.id}/vendas`)
                            }
                            className="h-8 px-2"
                          >
                            <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                              <TrendingUp className="h-4 w-4" />
                              <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                {customer.totalVendas}
                              </Badge>
                            </div>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {customer.produtores
                              .slice(0, 2)
                              .map((produtor, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1"
                                >
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
                                        onChange={(e) =>
                                          setEditingCustomer({
                                            ...editingCustomer,
                                            nome: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="email">Email</Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={editingCustomer.email}
                                        onChange={(e) =>
                                          setEditingCustomer({
                                            ...editingCustomer,
                                            email: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="telefone">Telefone</Label>
                                      <Input
                                        id="telefone"
                                        value={editingCustomer.telefone}
                                        onChange={(e) =>
                                          setEditingCustomer({
                                            ...editingCustomer,
                                            telefone: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="cpf">CPF</Label>
                                      <Input
                                        id="cpf"
                                        value={editingCustomer.cpf}
                                        onChange={(e) =>
                                          setEditingCustomer({
                                            ...editingCustomer,
                                            cpf: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditingCustomer(null)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        onClick={handleSaveEdit}
                                        disabled={updateCustomer.isPending}
                                      >
                                        {updateCustomer.isPending
                                          ? "Salvando..."
                                          : "Salvar"}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages} ({totalCustomers}{" "}
                    clientes total)
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          if (totalPages <= 7) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return null;
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
