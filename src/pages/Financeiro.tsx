import { useState, useRef } from "react";
import { format, startOfDay, endOfDay, isWithinInterval, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Upload, 
  FileText, 
  Image, 
  Edit, 
  Trash2, 
  Filter,
  Download,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  BarChart3,
  FileBarChart,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Transacao {
  id: string;
  evento: string;
  eventoId: string;
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string;
  data: string;
  comprovante?: string;
  comprovanteNome?: string;
  comprovanteUrl?: string;
}

interface SaldoEvento {
  eventoId: string;
  evento: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

const Financeiro = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);
  const [dataFiltro, setDataFiltro] = useState<Date | undefined>(new Date());
  const [eventoFiltro, setEventoFiltro] = useState<string>("todos");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    evento: "",
    eventoId: "",
    tipo: "entrada" as "entrada" | "saida",
    valor: 0,
    descricao: "",
    data: format(new Date(), "yyyy-MM-dd"),
    comprovante: null as string | null,
    comprovanteNome: "",
  });

  // Mock data - eventos disponíveis
  const eventos = [
    { id: "1", nome: "Rock in Rio 2024" },
    { id: "2", nome: "Curso de Produção Musical" },
    { id: "3", nome: "Festival de Verão 2025" },
    { id: "4", nome: "Peça Teatral Especial" },
    { id: "5", nome: "Congresso de Tecnologia 2025" },
  ];

  // Mock data - transações
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    {
      id: "1",
      evento: "Rock in Rio 2024",
      eventoId: "1",
      tipo: "entrada",
      valor: 45000,
      descricao: "Venda de ingressos - 1º lote",
      data: "2024-01-15",
    },
    {
      id: "2",
      evento: "Rock in Rio 2024",
      eventoId: "1",
      tipo: "saida",
      valor: 8000,
      descricao: "Pagamento fornecedor - Som e luz",
      data: "2024-01-15",
      comprovante: "data:application/pdf;base64,mock",
      comprovanteNome: "comprovante_som_luz.pdf",
    },
    {
      id: "3",
      evento: "Curso de Produção Musical",
      eventoId: "2",
      tipo: "entrada",
      valor: 12000,
      descricao: "Inscrições do curso - Janeiro",
      data: "2024-01-16",
    },
    {
      id: "4",
      evento: "Festival de Verão 2025",
      eventoId: "3",
      tipo: "entrada",
      valor: 67000,
      descricao: "Venda antecipada de ingressos",
      data: "2024-01-16",
    },
    {
      id: "5",
      evento: "Rock in Rio 2024",
      eventoId: "1",
      tipo: "saida",
      valor: 5000,
      descricao: "Marketing e divulgação",
      data: "2024-01-17",
      comprovante: "data:image/jpeg;base64,mock",
      comprovanteNome: "recibo_marketing.jpg",
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Apenas arquivos JPG, PNG ou PDF são permitidos.",
          variant: "destructive"
        });
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          comprovante: e.target?.result as string,
          comprovanteNome: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventoSelecionado = eventos.find(ev => ev.id === formData.eventoId);
    if (!eventoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um evento válido.",
        variant: "destructive"
      });
      return;
    }

    if (editingTransacao) {
      // Editando transação existente
      setTransacoes(transacoes.map(transacao => 
        transacao.id === editingTransacao.id 
          ? {
              ...transacao,
              ...formData,
              evento: eventoSelecionado.nome,
              comprovanteUrl: formData.comprovante,
            }
          : transacao
      ));
      
      setEditingTransacao(null);
      toast({
        title: "Transação atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criando nova transação
      const novaTransacao: Transacao = {
        id: Date.now().toString(),
        ...formData,
        evento: eventoSelecionado.nome,
        comprovanteUrl: formData.comprovante,
      };

      setTransacoes([...transacoes, novaTransacao]);
      
      toast({
        title: "Transação cadastrada!",
        description: `${formData.tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${formatCurrency(formData.valor)} registrada.`,
      });
    }
    
    // Reset do formulário
    setFormData({
      evento: "",
      eventoId: "",
      tipo: "entrada",
      valor: 0,
      descricao: "",
      data: format(new Date(), "yyyy-MM-dd"),
      comprovante: null,
      comprovanteNome: "",
    });
    setIsOpen(false);
  };

  const handleEdit = (transacao: Transacao) => {
    setFormData({
      evento: transacao.evento,
      eventoId: transacao.eventoId,
      tipo: transacao.tipo,
      valor: transacao.valor,
      descricao: transacao.descricao,
      data: transacao.data,
      comprovante: transacao.comprovanteUrl || null,
      comprovanteNome: transacao.comprovanteNome || "",
    });
    setEditingTransacao(transacao);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso.",
    });
  };

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(transacao => {
    const dataTransacao = parseISO(transacao.data);
    
    // Filtro por data
    let dataMatch = true;
    if (dataFiltro) {
      const inicio = startOfDay(dataFiltro);
      const fim = endOfDay(dataFiltro);
      dataMatch = isWithinInterval(dataTransacao, { start: inicio, end: fim });
    }
    
    // Filtro por evento
    const eventoMatch = eventoFiltro === "todos" || transacao.eventoId === eventoFiltro;
    
    // Filtro por tipo
    const tipoMatch = tipoFiltro === "todos" || transacao.tipo === tipoFiltro;
    
    return dataMatch && eventoMatch && tipoMatch;
  });

  // Calcular saldos por evento
  const saldosPorEvento: SaldoEvento[] = eventos.map(evento => {
    const transacoesEvento = transacoes.filter(t => t.eventoId === evento.id);
    const entradas = transacoesEvento
      .filter(t => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);
    const saidas = transacoesEvento
      .filter(t => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);
    
    return {
      eventoId: evento.id,
      evento: evento.nome,
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  });

  // Totais gerais
  const totalEntradas = transacoes
    .filter(t => t.tipo === "entrada")
    .reduce((sum, t) => sum + t.valor, 0);
  const totalSaidas = transacoes
    .filter(t => t.tipo === "saida")
    .reduce((sum, t) => sum + t.valor, 0);
  const saldoGeral = totalEntradas - totalSaidas;

  // Agrupar transações por dia
  const transacoesPorDia = transacoes.reduce((acc, transacao) => {
    const data = transacao.data;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(transacao);
    return acc;
  }, {} as Record<string, Transacao[]>);

  // Calcular totais por dia
  const totaisPorDia = Object.entries(transacoesPorDia).map(([data, transacoesDia]) => {
    const entradas = transacoesDia.filter(t => t.tipo === "entrada").reduce((sum, t) => sum + t.valor, 0);
    const saidas = transacoesDia.filter(t => t.tipo === "saida").reduce((sum, t) => sum + t.valor, 0);
    return {
      data,
      entradas,
      saidas,
      saldo: entradas - saidas,
      transacoes: transacoesDia,
      quantidade: transacoesDia.length
    };
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Agrupar transações por evento
  const transacoesPorEvento = eventos.map(evento => {
    const transacoesEvento = transacoes.filter(t => t.eventoId === evento.id);
    const entradas = transacoesEvento.filter(t => t.tipo === "entrada").reduce((sum, t) => sum + t.valor, 0);
    const saidas = transacoesEvento.filter(t => t.tipo === "saida").reduce((sum, t) => sum + t.valor, 0);
    
    return {
      evento,
      transacoes: transacoesEvento.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
      entradas,
      saidas,
      saldo: entradas - saidas,
      quantidade: transacoesEvento.length
    };
  }).filter(grupo => grupo.quantidade > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().includes('.pdf')) {
      return <FileText className="w-4 h-4" />;
    }
    return <Image className="w-4 h-4" />;
  };

  const toggleDay = (data: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(data)) {
        newSet.delete(data);
      } else {
        newSet.add(data);
      }
      return newSet;
    });
  };

  const toggleEvent = (eventoId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventoId)) {
        newSet.delete(eventoId);
      } else {
        newSet.add(eventoId);
      }
      return newSet;
    });
  };

  // Funções de exportação
  const exportToExcel = (detalhado: boolean = false) => {
    let dados: any[] = [];
    
    if (detalhado) {
      // Exportação detalhada - uma linha por transação
      dados = transacoes.map(t => ({
        'Data': formatDate(t.data),
        'Evento': t.evento,
        'Tipo': t.tipo === 'entrada' ? 'Entrada' : 'Saída',
        'Descrição': t.descricao,
        'Valor': t.valor,
        'Comprovante': t.comprovanteNome || 'Não'
      }));
    } else {
      // Exportação simplificada - resumo por evento
      dados = saldosPorEvento.map(s => ({
        'Evento': s.evento,
        'Total Entradas': s.entradas,
        'Total Saídas': s.saidas,
        'Saldo': s.saldo
      }));
    }

    // Converter para CSV (simulação de Excel)
    const headers = Object.keys(dados[0] || {}).join(',');
    const rows = dados.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financeiro_${detalhado ? 'detalhado' : 'simplificado'}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast({
      title: "Exportação concluída",
      description: `Relatório ${detalhado ? 'detalhado' : 'simplificado'} exportado com sucesso!`,
    });
  };

  const exportToPDF = (detalhado: boolean = false) => {
    // Simulação de geração de PDF
    toast({
      title: "Gerando PDF...",
      description: `Relatório ${detalhado ? 'detalhado' : 'simplificado'} sendo gerado em PDF.`,
    });
    
    // Em uma implementação real, aqui usaríamos uma biblioteca como jsPDF
    setTimeout(() => {
      toast({
        title: "PDF gerado",
        description: `Relatório ${detalhado ? 'detalhado' : 'simplificado'} salvo como PDF!`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Controle de entradas e saídas por evento
          </p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportToExcel(false)}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel - Simplificado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToExcel(true)}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel - Detalhado
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportToPDF(false)}>
                <FileText className="w-4 h-4 mr-2" />
                PDF - Simplificado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF(true)}>
                <FileText className="w-4 h-4 mr-2" />
                PDF - Detalhado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="hover-scale">
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTransacao ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="evento">Evento *</Label>
                  <Select
                    value={formData.eventoId}
                    onValueChange={(value) => setFormData({...formData, eventoId: value})}
                    required
                  >
                    <SelectTrigger>
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
                
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({...formData, tipo: value as "entrada" | "saida"})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva a transação..."
                  rows={3}
                  required
                />
              </div>

              {formData.tipo === "saida" && (
                <div>
                  <Label>Comprovante</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {formData.comprovante ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getFileIcon(formData.comprovanteNome)}
                          <span className="text-sm font-medium">{formData.comprovanteNome}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setFormData({...formData, comprovante: null, comprovanteNome: ""});
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remover
                          </Button>
                          {formData.comprovante.startsWith('data:image') && (
                            <Button 
                              type="button"
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(formData.comprovante!, '_blank')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Selecionar Arquivo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG ou PDF - Máximo 5MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsOpen(false);
                  setEditingTransacao(null);
                  setFormData({
                    evento: "",
                    eventoId: "",
                    tipo: "entrada",
                    valor: 0,
                    descricao: "",
                    data: format(new Date(), "yyyy-MM-dd"),
                    comprovante: null,
                    comprovanteNome: "",
                  });
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTransacao ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalEntradas)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalSaidas)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Geral</CardTitle>
            <DollarSign className={`h-4 w-4 ${saldoGeral >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoGeral >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldoGeral)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transacoes.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="diario">Movimentação Diária</TabsTrigger>
          <TabsTrigger value="eventos">Por Evento</TabsTrigger>
          <TabsTrigger value="transacoes">Todas Transações</TabsTrigger>
        </TabsList>

        {/* Aba Resumo */}
        <TabsContent value="resumo" className="space-y-6">
          {/* Saldos por Evento */}
          <Card>
            <CardHeader>
              <CardTitle>Saldo por Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saldosPorEvento.map((saldo) => (
                  <div key={saldo.eventoId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{saldo.evento}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Entradas: <span className="text-green-600 font-medium">{formatCurrency(saldo.entradas)}</span></span>
                        <span>Saídas: <span className="text-red-600 font-medium">{formatCurrency(saldo.saidas)}</span></span>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${saldo.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(saldo.saldo)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Movimentação Diária */}
        <TabsContent value="diario" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Movimentação por Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totaisPorDia.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma movimentação encontrada</h3>
                  <p className="text-muted-foreground">Cadastre transações para ver a movimentação diária.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {totaisPorDia.map((dia) => (
                    <Collapsible key={dia.data} open={expandedDays.has(dia.data)} onOpenChange={() => toggleDay(dia.data)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-muted/50">
                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <h3 className="font-medium">{formatDate(dia.data)}</h3>
                              <p className="text-sm text-muted-foreground">{dia.quantidade} transações</p>
                            </div>
                            <div className="flex gap-6 text-sm">
                              <span>Entradas: <span className="text-green-600 font-medium">{formatCurrency(dia.entradas)}</span></span>
                              <span>Saídas: <span className="text-red-600 font-medium">{formatCurrency(dia.saidas)}</span></span>
                              <span>Saldo: <span className={`font-medium ${dia.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(dia.saldo)}</span></span>
                            </div>
                          </div>
                          {expandedDays.has(dia.data) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-2 mt-2 border-l-2 border-muted ml-2 pl-4">
                          {dia.transacoes.map((transacao) => (
                            <div key={transacao.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={transacao.tipo === "entrada" ? "default" : "destructive"} className="text-xs">
                                    {transacao.tipo === "entrada" ? "Entrada" : "Saída"}
                                  </Badge>
                                  <span className="text-sm font-medium">{transacao.evento}</span>
                                </div>
                                <p className="text-sm">{transacao.descricao}</p>
                              </div>
                              <div className={`text-sm font-bold ${transacao.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                                {transacao.tipo === "entrada" ? "+" : "-"}{formatCurrency(transacao.valor)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Por Evento */}
        <TabsContent value="eventos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="w-5 h-5" />
                Movimentação Detalhada por Evento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transacoesPorEvento.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-muted-foreground">Cadastre transações para ver a movimentação por evento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transacoesPorEvento.map((grupo) => (
                    <Collapsible key={grupo.evento.id} open={expandedEvents.has(grupo.evento.id)} onOpenChange={() => toggleEvent(grupo.evento.id)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-muted/50">
                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <h3 className="font-medium">{grupo.evento.nome}</h3>
                              <p className="text-sm text-muted-foreground">{grupo.quantidade} transações</p>
                            </div>
                            <div className="flex gap-6 text-sm">
                              <span>Entradas: <span className="text-green-600 font-medium">{formatCurrency(grupo.entradas)}</span></span>
                              <span>Saídas: <span className="text-red-600 font-medium">{formatCurrency(grupo.saidas)}</span></span>
                              <span>Saldo: <span className={`font-medium ${grupo.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(grupo.saldo)}</span></span>
                            </div>
                          </div>
                          {expandedEvents.has(grupo.evento.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-2 mt-2 border-l-2 border-muted ml-2 pl-4">
                          {grupo.transacoes.map((transacao) => (
                            <div key={transacao.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={transacao.tipo === "entrada" ? "default" : "destructive"} className="text-xs">
                                    {transacao.tipo === "entrada" ? (
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3 mr-1" />
                                    )}
                                    {transacao.tipo === "entrada" ? "Entrada" : "Saída"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{formatDate(transacao.data)}</span>
                                  {transacao.comprovanteNome && (
                                    <div className="flex items-center gap-1">
                                      {getFileIcon(transacao.comprovanteNome)}
                                      <span className="text-xs text-muted-foreground">Comprovante</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm font-medium">{transacao.descricao}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`text-sm font-bold ${transacao.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                                  {transacao.tipo === "entrada" ? "+" : "-"}{formatCurrency(transacao.valor)}
                                </div>
                                <div className="flex gap-1">
                                  {transacao.comprovanteUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(transacao.comprovanteUrl!, '_blank')}
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(transacao)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(transacao.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Todas Transações */}
        <TabsContent value="transacoes" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Filtros:</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="data-filtro" className="text-sm">Data:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !dataFiltro && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dataFiltro ? format(dataFiltro, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dataFiltro}
                        onSelect={setDataFiltro}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {dataFiltro && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDataFiltro(undefined)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="evento-filtro" className="text-sm">Evento:</Label>
                  <Select value={eventoFiltro} onValueChange={setEventoFiltro}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os eventos</SelectItem>
                      {eventos.map((evento) => (
                        <SelectItem key={evento.id} value={evento.id}>
                          {evento.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="tipo-filtro" className="text-sm">Tipo:</Label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="entrada">Entradas</SelectItem>
                      <SelectItem value="saida">Saídas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Transações */}
          <Card>
            <CardHeader>
              <CardTitle>
                Transações ({transacoesFiltradas.length})
                {dataFiltro && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    - {format(dataFiltro, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transacoesFiltradas.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-muted-foreground">
                    {dataFiltro 
                      ? "Não há transações para esta data." 
                      : "Cadastre a primeira transação financeira."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transacoesFiltradas
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((transacao) => (
                      <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={transacao.tipo === "entrada" ? "default" : "destructive"}>
                              {transacao.tipo === "entrada" ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {transacao.tipo === "entrada" ? "Entrada" : "Saída"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{formatDate(transacao.data)}</span>
                            <span className="text-sm font-medium">{transacao.evento}</span>
                          </div>
                          <p className="font-medium">{transacao.descricao}</p>
                          {transacao.comprovanteNome && (
                            <div className="flex items-center gap-1 mt-1">
                              {getFileIcon(transacao.comprovanteNome)}
                              <span className="text-xs text-muted-foreground">{transacao.comprovanteNome}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-lg font-bold ${transacao.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                            {transacao.tipo === "entrada" ? "+" : "-"}{formatCurrency(transacao.valor)}
                          </div>
                          <div className="flex gap-1">
                            {transacao.comprovanteUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(transacao.comprovanteUrl!, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(transacao)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(transacao.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;