import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  User,
  MapPin,
  CreditCard,
  FileText,
  Edit,
  Trash2,
  Eye,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CountrySelector, type Country } from "@/components/CountrySelector";

interface IngressoDetalhes {
  inteira: { quantidade: number; preco: number };
  meia: { quantidade: number; preco: number };
  promocional: { quantidade: number; preco: number };
  solidario: { quantidade: number; preco: number };
}

interface IngressoGerado {
  id: string;
  vendaId: string;
  numero: string;
  tipo: string;
  evento: string;
  cliente: string;
  valor: number;
  status: "ativo" | "usado" | "cancelado";
  qrCode: string;
  dataCompra: string;
  sessao: string;
  lote: string;
}

interface Venda {
  id: string;
  numero: string;
  status: "pendente" | "pago" | "cancelado";
  produtor: string;
  evento: string;
  cliente: string;
  presencial: boolean;
  formaRecebimento: "pix" | "cartao";
  pagamentoPresencial?: "dinheiro" | "pix" | "credito" | "debito";
  dataHora: string;
  valorIngressos: number;
  taxaBancaria: number;
  valorTaxaTicketIdeal: number;
  valorTotal: number;
  pagarmeId?: string;
  pagarmeRetorno?: string;
  asaasInvoiceUrl?: string;
  asaasId?: string;
  asaasRetorno?: string;
  repasseEfetuado: boolean;
  ingressos: IngressoDetalhes;
  sessao: string;
  lote: string;
  ingressosGerados?: IngressoGerado[];
}

export default function Vendas() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: "1",
      numero: "001",
      status: "pago",
      produtor: "Producer ABC",
      evento: "Show de Rock",
      cliente: "João Silva - +5511999999999",
      presencial: false,
      formaRecebimento: "pix",
      dataHora: "2024-01-15T20:00:00",
      valorIngressos: 100.00,
      taxaBancaria: 3.50,
      valorTaxaTicketIdeal: 5.00,
      valorTotal: 108.50,
      pagarmeId: "pay_123",
      repasseEfetuado: false,
      ingressos: {
        inteira: { quantidade: 1, preco: 100.00 },
        meia: { quantidade: 0, preco: 50.00 },
        promocional: { quantidade: 0, preco: 80.00 },
        solidario: { quantidade: 0, preco: 25.00 }
      },
      sessao: "Sessão 1 - 20:00",
      lote: "3º Lote",
      ingressosGerados: [
        {
          id: "T001",
          vendaId: "1",
          numero: "001-001",
          tipo: "inteira",
          evento: "Show de Rock",
          cliente: "João Silva",
          valor: 100.00,
          status: "ativo",
          qrCode: "QR001001",
          dataCompra: "2024-01-15T20:00:00",
          sessao: "Sessão 1 - 20:00",
          lote: "3º Lote"
        }
      ]
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null);
  const [viewingVenda, setViewingVenda] = useState<Venda | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [novaVenda, setNovaVenda] = useState<Partial<Venda>>({
    status: "pendente",
    presencial: false,
    repasseEfetuado: false,
    valorIngressos: 0,
    taxaBancaria: 0,
    valorTaxaTicketIdeal: 0,
    valorTotal: 0
  });

  const [clienteInfo, setClienteInfo] = useState({
    nome: "",
    whatsapp: "",
    country: undefined as Country | undefined
  });

  const [ingressos, setIngressos] = useState({
    inteira: { quantidade: 0, preco: 100.00 },
    meia: { quantidade: 0, preco: 50.00 },
    promocional: { quantidade: 0, preco: 80.00 },
    solidario: { quantidade: 0, preco: 25.00 }
  });

  const [sessaoSelecionada, setSessaoSelecionada] = useState("");
  const [loteSelecionado, setLoteSelecionado] = useState("");

  // Configurações de taxa por evento
  const eventTaxRates: { [key: string]: number } = {
    "Show de Rock": 8.5,
    "Festival de Jazz": 7.0,
    "Concert Pop": 9.0,
    "Festival Eletrônico": 8.0,
    "Show Sertanejo": 6.5,
    "Festival Country": 7.5
  };

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = 
      venda.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.produtor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || venda.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveVenda = () => {
    if (!novaVenda.produtor || !novaVenda.evento || !clienteInfo.nome || !clienteInfo.whatsapp || !loteSelecionado) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const totalIngressosQuantidade = Object.values(ingressos).reduce((total, item) => total + item.quantidade, 0);
    if (totalIngressosQuantidade === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um ingresso",
        variant: "destructive",
      });
      return;
    }

    const totalIngressos = calcularTotalIngressos();
    const taxaPercentual = eventTaxRates[novaVenda.evento!] || 8.0;
    const valorTaxaTicketIdeal = (totalIngressos * taxaPercentual) / 100;
    
    const vendaCompleta: Venda = {
      id: editingVenda?.id || Date.now().toString(),
      numero: novaVenda.numero || `${vendas.length + 1}`.padStart(3, '0'),
      status: novaVenda.status as Venda['status'] || "pendente",
      produtor: novaVenda.produtor!,
      evento: novaVenda.evento!,
      cliente: `${clienteInfo.nome} - ${clienteInfo.whatsapp}`,
      presencial: novaVenda.presencial || false,
      formaRecebimento: "pix", // Valor fixo já que foi removido do form
      pagamentoPresencial: novaVenda.pagamentoPresencial as Venda['pagamentoPresencial'],
      dataHora: novaVenda.dataHora || new Date().toISOString(),
      valorIngressos: totalIngressos,
      taxaBancaria: novaVenda.taxaBancaria || 0,
      valorTaxaTicketIdeal: valorTaxaTicketIdeal,
      valorTotal: totalIngressos + (novaVenda.taxaBancaria || 0) + valorTaxaTicketIdeal,
      pagarmeId: novaVenda.pagarmeId,
      pagarmeRetorno: novaVenda.pagarmeRetorno,
      asaasInvoiceUrl: novaVenda.asaasInvoiceUrl,
      asaasId: novaVenda.asaasId,
      asaasRetorno: novaVenda.asaasRetorno,
      repasseEfetuado: novaVenda.repasseEfetuado || false,
      ingressos: { ...ingressos },
      sessao: sessaoSelecionada,
      lote: loteSelecionado
    };
    
    const ingressosGerados = gerarIngressos(vendaCompleta);
    vendaCompleta.ingressosGerados = ingressosGerados;

    if (editingVenda) {
      setVendas(vendas.map(v => v.id === editingVenda.id ? vendaCompleta : v));
      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso!",
      });
    } else {
      setVendas([...vendas, vendaCompleta]);
      toast({
        title: "Sucesso",
        description: "Venda cadastrada com sucesso!",
      });
    }

    setIsDialogOpen(false);
    setEditingVenda(null);
    setNovaVenda({
      status: "pendente",
      presencial: false,
      repasseEfetuado: false,
      valorIngressos: 0,
      taxaBancaria: 0,
      valorTaxaTicketIdeal: 0,
      valorTotal: 0
    });
    setClienteInfo({ nome: "", whatsapp: "", country: undefined });
    setIngressos({
      inteira: { quantidade: 0, preco: 100.00 },
      meia: { quantidade: 0, preco: 50.00 },
      promocional: { quantidade: 0, preco: 80.00 },
      solidario: { quantidade: 0, preco: 25.00 }
    });
    setSessaoSelecionada("");
    setLoteSelecionado("");
  };

  const handleEditVenda = (venda: Venda) => {
    setEditingVenda(venda);
    setNovaVenda(venda);
    setClienteInfo({
      nome: venda.cliente.split(' - ')[0] || '',
      whatsapp: venda.cliente.split(' - ')[1] || '',
      country: undefined
    });
    setIngressos(venda.ingressos);
    setSessaoSelecionada(venda.sessao);
    setLoteSelecionado(venda.lote);
    setIsDialogOpen(true);
  };

  const handleViewVenda = (venda: Venda) => {
    setViewingVenda(venda);
    setIsViewDialogOpen(true);
  };

  const handleDeleteVenda = (id: string) => {
    setVendas(vendas.filter(v => v.id !== id));
    toast({
      title: "Sucesso",
      description: "Venda removida com sucesso!",
    });
  };

  const getStatusBadge = (status: Venda['status']) => {
    const variants = {
      pendente: "bg-yellow-100 text-yellow-800",
      pago: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const calcularTotalIngressos = () => {
    return Object.values(ingressos).reduce((total, item) => {
      return total + (item.quantidade * item.preco);
    }, 0);
  };

  const calcularTaxaTicketIdeal = () => {
    if (!novaVenda.evento) return 0;
    const totalIngressos = calcularTotalIngressos();
    const taxaPercentual = eventTaxRates[novaVenda.evento] || 8.0;
    return (totalIngressos * taxaPercentual) / 100;
  };

  const handleIngressoChange = (tipo: keyof typeof ingressos, quantidade: number) => {
    setIngressos(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], quantidade }
    }));
  };

  const calcularTotalIngressosVenda = (ingressosVenda: IngressoDetalhes) => {
    return Object.values(ingressosVenda).reduce((total, item) => {
      return total + (item.quantidade * item.preco);
    }, 0);
  };

  const gerarIngressos = (venda: Venda): IngressoGerado[] => {
    const ingressos: IngressoGerado[] = [];
    let contador = 1;
    
    Object.entries(venda.ingressos).forEach(([tipo, detalhes]) => {
      for (let i = 0; i < detalhes.quantidade; i++) {
        const numeroIngresso = `${venda.numero}-${contador.toString().padStart(3, '0')}`;
        const qrCode = `QR${venda.numero}${contador.toString().padStart(3, '0')}`;
        
        ingressos.push({
          id: `${venda.id}-${tipo}-${i + 1}`,
          vendaId: venda.id,
          numero: numeroIngresso,
          tipo: tipo === 'meia' ? 'Meia Entrada' : tipo.charAt(0).toUpperCase() + tipo.slice(1),
          evento: venda.evento,
          cliente: venda.cliente.split(' - ')[0],
          valor: detalhes.preco,
          status: venda.status === 'pago' ? 'ativo' : 'cancelado',
          qrCode: qrCode,
          dataCompra: venda.dataHora,
          sessao: venda.sessao,
          lote: venda.lote
        });
        
        contador++;
      }
    });
    
    return ingressos;
  };

  const obterTotalIngressosVenda = (venda: Venda) => {
    return Object.values(venda.ingressos).reduce((total, item) => total + item.quantidade, 0);
  };

  const updatePrecosPorLote = (lote: string) => {
    const precos = {
      "lote1": { inteira: 50.00, meia: 25.00, promocional: 40.00, solidario: 15.00 },
      "lote2": { inteira: 75.00, meia: 37.50, promocional: 60.00, solidario: 20.00 },
      "lote3": { inteira: 100.00, meia: 50.00, promocional: 80.00, solidario: 25.00 }
    };

    if (precos[lote as keyof typeof precos]) {
      const novosPrecos = precos[lote as keyof typeof precos];
      setIngressos(prev => ({
        inteira: { ...prev.inteira, preco: novosPrecos.inteira },
        meia: { ...prev.meia, preco: novosPrecos.meia },
        promocional: { ...prev.promocional, preco: novosPrecos.promocional },
        solidario: { ...prev.solidario, preco: novosPrecos.solidario }
      }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendas</h1>
          <p className="text-muted-foreground">Gestão de vendas de ingressos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingVenda(null);
              setNovaVenda({
                status: "pendente",
                presencial: false,
                repasseEfetuado: false,
                valorIngressos: 0,
                taxaBancaria: 0,
                valorTaxaTicketIdeal: 0,
                valorTotal: 0
              });
              setClienteInfo({ nome: "", whatsapp: "", country: undefined });
              setIngressos({
                inteira: { quantidade: 0, preco: 100.00 },
                meia: { quantidade: 0, preco: 50.00 },
                promocional: { quantidade: 0, preco: 80.00 },
                solidario: { quantidade: 0, preco: 25.00 }
              });
              setSessaoSelecionada("");
              setLoteSelecionado("");
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVenda ? "Editar Venda" : "Nova Venda"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={novaVenda.numero || ""}
                  onChange={(e) => setNovaVenda({ ...novaVenda, numero: e.target.value })}
                  placeholder="001"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={novaVenda.status} onValueChange={(value) => setNovaVenda({ ...novaVenda, status: value as Venda['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="produtor">Produtor *</Label>
                <Select value={novaVenda.produtor} onValueChange={(value) => setNovaVenda({ ...novaVenda, produtor: value, evento: "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produtor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Producer ABC">Producer ABC</SelectItem>
                    <SelectItem value="Producer XYZ">Producer XYZ</SelectItem>
                    <SelectItem value="Producer 123">Producer 123</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="evento">Evento *</Label>
                <Select value={novaVenda.evento} onValueChange={(value) => setNovaVenda({ ...novaVenda, evento: value })} disabled={!novaVenda.produtor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {novaVenda.produtor === "Producer ABC" && (
                      <>
                        <SelectItem value="Show de Rock">Show de Rock</SelectItem>
                        <SelectItem value="Festival de Jazz">Festival de Jazz</SelectItem>
                      </>
                    )}
                    {novaVenda.produtor === "Producer XYZ" && (
                      <>
                        <SelectItem value="Concert Pop">Concert Pop</SelectItem>
                        <SelectItem value="Festival Eletrônico">Festival Eletrônico</SelectItem>
                      </>
                    )}
                    {novaVenda.produtor === "Producer 123" && (
                      <>
                        <SelectItem value="Show Sertanejo">Show Sertanejo</SelectItem>
                        <SelectItem value="Festival Country">Festival Country</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sessao">Sessão *</Label>
                <Select value={sessaoSelecionada} onValueChange={setSessaoSelecionada} disabled={!novaVenda.evento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a sessão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sessao1">Sessão 1 - 20:00</SelectItem>
                    <SelectItem value="sessao2">Sessão 2 - 22:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lote">Lote *</Label>
                <Select 
                  value={loteSelecionado} 
                  onValueChange={(value) => {
                    setLoteSelecionado(value);
                    updatePrecosPorLote(value);
                  }} 
                  disabled={!sessaoSelecionada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o lote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lote1">1º Lote - Inteira: R$ 50,00</SelectItem>
                    <SelectItem value="lote2">2º Lote - Inteira: R$ 75,00</SelectItem>
                    <SelectItem value="lote3">3º Lote - Inteira: R$ 100,00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nome do Cliente *</Label>
                <Input
                  value={clienteInfo.nome}
                  onChange={(e) => setClienteInfo({ ...clienteInfo, nome: e.target.value })}
                  placeholder="Nome completo do cliente"
                />
              </div>

              <div className="col-span-2">
                <Label>WhatsApp (formato internacional) *</Label>
                <div className="flex gap-2">
                  <CountrySelector 
                    value={clienteInfo.country}
                    onSelect={(country) => {
                      setClienteInfo({ 
                        ...clienteInfo, 
                        country,
                        whatsapp: country.dialCode 
                      });
                    }}
                  />
                  <Input
                    className="flex-1"
                    value={clienteInfo.whatsapp}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Garantir que sempre comece com o código do país
                      if (clienteInfo.country && !value.startsWith(clienteInfo.country.dialCode)) {
                        value = clienteInfo.country.dialCode + value.replace(/^\+?\d{0,3}/, '');
                      }
                      setClienteInfo({ ...clienteInfo, whatsapp: value });
                    }}
                    placeholder="11999999999"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Exemplo: {clienteInfo.country?.dialCode || "+55"}11999999999
                </p>
              </div>



              <div className="flex items-center space-x-2 col-span-2">
                <input
                  type="checkbox"
                  id="presencial"
                  checked={novaVenda.presencial}
                  onChange={(e) => setNovaVenda({ ...novaVenda, presencial: e.target.checked })}
                />
                <Label htmlFor="presencial">Venda Presencial</Label>
              </div>

              {novaVenda.presencial && (
                <div>
                  <Label htmlFor="pagamentoPresencial">Pagamento Presencial</Label>
                  <Select value={novaVenda.pagamentoPresencial} onValueChange={(value) => setNovaVenda({ ...novaVenda, pagamentoPresencial: value as Venda['pagamentoPresencial'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="credito">Crédito</SelectItem>
                      <SelectItem value="debito">Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Tipos de Ingressos */}
              {loteSelecionado && (
                <div className="col-span-2">
                  <Label className="text-lg font-semibold">Tipos de Ingressos</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2 p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-2">
                      <Label>Inteira - R$ {ingressos.inteira.preco.toFixed(2)}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={ingressos.inteira.quantidade}
                        onChange={(e) => handleIngressoChange('inteira', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Meia Entrada - R$ {ingressos.meia.preco.toFixed(2)}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={ingressos.meia.quantidade}
                        onChange={(e) => handleIngressoChange('meia', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Promocional - R$ {ingressos.promocional.preco.toFixed(2)}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={ingressos.promocional.quantidade}
                        onChange={(e) => handleIngressoChange('promocional', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Solidário - R$ {ingressos.solidario.preco.toFixed(2)}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={ingressos.solidario.quantidade}
                        onChange={(e) => handleIngressoChange('solidario', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total dos Ingressos:</span>
                      <span>R$ {calcularTotalIngressos().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="taxaBancaria">Taxa Bancária</Label>
                <Input
                  id="taxaBancaria"
                  type="number"
                  step="0.01"
                  value={novaVenda.taxaBancaria}
                  onChange={(e) => setNovaVenda({ ...novaVenda, taxaBancaria: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="valorTaxaTicketIdeal">Taxa Ticket Ideal</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="valorTaxaTicketIdeal"
                      type="number"
                      step="0.01"
                      value={calcularTaxaTicketIdeal().toFixed(2)}
                      readOnly
                      className="bg-muted"
                    />
                    <span className="text-sm text-muted-foreground">
                      ({novaVenda.evento ? eventTaxRates[novaVenda.evento]?.toFixed(1) || "8.0" : "8.0"}%)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculado automaticamente baseado no evento selecionado
                  </p>
                </div>
              </div>

              <div className="col-span-2">
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex justify-between items-center text-xl font-bold text-success">
                    <span>VALOR TOTAL FINAL:</span>
                    <span>R$ {(calcularTotalIngressos() + (novaVenda.taxaBancaria || 0) + calcularTaxaTicketIdeal()).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveVenda}>
                {editingVenda ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, cliente, evento ou produtor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Qtd. Ingressos</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">{venda.numero}</TableCell>
                  <TableCell>{getStatusBadge(venda.status)}</TableCell>
                  <TableCell>{venda.cliente}</TableCell>
                  <TableCell>{venda.evento}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const clienteId = "1"; // Em produção, viria do banco de dados
                        navigate(`/clientes/${clienteId}/ingressos?venda=${venda.numero}`);
                      }}
                      className="h-auto p-1 hover:bg-primary/10"
                      title="Ver ingressos desta venda"
                    >
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        {obterTotalIngressosVenda(venda)} ingressos
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell>R$ {venda.valorTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    {format(new Date(venda.dataHora), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewVenda(venda)}
                        title="Visualizar detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVenda(venda)}
                        title="Editar venda"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVenda(venda.id)}
                        title="Excluir venda"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para visualizar detalhes da venda */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda #{viewingVenda?.numero}</DialogTitle>
          </DialogHeader>
          
          {viewingVenda && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Informações da Venda</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(viewingVenda.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Produtor:</span>
                      <span>{viewingVenda.produtor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Evento:</span>
                      <span>{viewingVenda.evento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sessão:</span>
                      <span>{viewingVenda.sessao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lote:</span>
                      <span>{viewingVenda.lote}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data/Hora:</span>
                      <span>{format(new Date(viewingVenda.dataHora), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span>{viewingVenda.cliente.split(' - ')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">WhatsApp:</span>
                      <span>{viewingVenda.cliente.split(' - ')[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Venda:</span>
                      <span>{viewingVenda.presencial ? "Presencial" : "Online"}</span>
                    </div>
                    {viewingVenda.presencial && viewingVenda.pagamentoPresencial && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pagamento:</span>
                        <span>{viewingVenda.pagamentoPresencial}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Detalhes dos Ingressos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Ingressos Comprados
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const clienteId = "1"; // Em produção, viria do banco
                        navigate(`/clientes/${clienteId}/ingressos?venda=${viewingVenda.numero}`);
                      }}
                    >
                      Ver todos os ingressos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(viewingVenda.ingressos).map(([tipo, detalhes]) => (
                      detalhes.quantidade > 0 && (
                        <div key={tipo} className="p-3 border rounded-lg bg-muted/20">
                          <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">{tipo === 'meia' ? 'Meia Entrada' : tipo}</span>
                            <Badge variant="secondary">{detalhes.quantidade}x</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            R$ {detalhes.preco.toFixed(2)} cada
                          </div>
                          <div className="text-lg font-semibold mt-2">
                            Total: R$ {(detalhes.quantidade * detalhes.preco).toFixed(2)}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  
                  {/* Lista de Ingressos Gerados */}
                  {viewingVenda.ingressosGerados && viewingVenda.ingressosGerados.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Ingressos Gerados:</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {viewingVenda.ingressosGerados.map((ingresso) => (
                          <div key={ingresso.id} className="flex items-center justify-between p-2 border rounded-lg bg-background">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{ingresso.numero}</div>
                              <div className="text-xs text-muted-foreground">{ingresso.tipo} - {ingresso.qrCode}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">R$ {ingresso.valor.toFixed(2)}</div>
                              <Badge 
                                variant={ingresso.status === 'ativo' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {ingresso.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total de Ingressos:</span>
                      <span className="text-lg font-bold">{obterTotalIngressosVenda(viewingVenda)} ingressos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumo Financeiro */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor dos Ingressos:</span>
                    <span>R$ {viewingVenda.valorIngressos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa Bancária:</span>
                    <span>R$ {viewingVenda.taxaBancaria.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa Ticket Ideal:</span>
                    <span>R$ {viewingVenda.valorTaxaTicketIdeal.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>VALOR TOTAL:</span>
                    <span>R$ {viewingVenda.valorTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditVenda(viewingVenda);
                }}>
                  Editar Venda
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}