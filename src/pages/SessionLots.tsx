import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Calendar, Clock, Users, DollarSign, Gift, Heart, Edit, Trash2, MapPin, Sofa } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Zona {
  id: string;
  nome: string;
  assentos: string; // Ex: "A1-A20, B1-B15"
  quantidade: number;
  valorInteira: number;
  valorMeia: number;
  valorPromocional: number;
  valorSolidario: number;
}

interface Setor {
  id: string;
  nome: string;
  capacidade: number;
  valorInteira: number;
  valorMeia: number;
  valorPromocional: number;
  valorSolidario: number;
}

interface Lot {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  quantidadeMaxima: number;
  quantidadeVendida: number;
  ativo: boolean;
  
  // Tipos de ingresso
  ingressoPromocional: boolean;
  ingressoSolidario: boolean;
  ingressoGratuito: boolean;
  meiaEntrada: boolean;
  
  // Tipo de assento
  tipoAssento: "livre" | "numerado";
  
  // Setores (para assentos livres) ou Zonas (para numerados)
  setores: Setor[];
  zonas: Zona[];
  
  // Descrições
  descricaoSolidario: string;
  descricaoPromocional: string;
}

const SessionLots = () => {
  const { eventId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  
  // Simular que os dados do evento vêm de uma API
  // Em produção, isso viria do contexto ou de uma API call
  const tipoEvento = "Cursos e Workshops"; // Simulando - viria dos dados reais do evento
  const isCurso = tipoEvento === "Cursos e Workshops";
  
  // Se for curso, sempre assento livre; senão, vem da sessão
  const tipoAssentoSessao = isCurso ? "livre" : "livre"; // Em produção, isso viria da sessão
  
  const [formData, setFormData] = useState({
    nome: "",
    dataInicio: "",
    dataFim: "",
    horaInicio: "",
    horaFim: "",
    quantidadeMaxima: 100,
    ingressoPromocional: false,
    ingressoSolidario: false,
    ingressoGratuito: false,
    meiaEntrada: true,
    setores: [
      {
        id: "1",
        nome: "Pista",
        capacidade: 100,
        valorInteira: 50,
        valorMeia: 25,
        valorPromocional: 40,
        valorSolidario: 0,
      }
    ] as Setor[],
    zonas: [
      {
        id: "1",
        nome: "Zona Central",
        assentos: "A1-A20, B1-B20",
        quantidade: 40,
        valorInteira: 50,
        valorMeia: 25,
        valorPromocional: 40,
        valorSolidario: 0,
      }
    ] as Zona[],
    descricaoSolidario: "",
    descricaoPromocional: "",
  });

  // Mock data - substituir por dados reais
  const [lots, setLots] = useState<Lot[]>([
    {
      id: "1",
      nome: "1º Lote - Promocional",
      dataInicio: "2024-01-15",
      dataFim: "2024-02-15",
      horaInicio: "00:00",
      horaFim: "23:59",
      quantidadeMaxima: 100,
      quantidadeVendida: 75,
      ativo: true,
      ingressoPromocional: true,
      ingressoSolidario: false,
      ingressoGratuito: false,
      meiaEntrada: true,
      tipoAssento: "livre",
      setores: [
        {
          id: "1",
          nome: "Pista",
          capacidade: 80,
          valorInteira: 80,
          valorMeia: 40,
          valorPromocional: 60,
          valorSolidario: 0,
        },
        {
          id: "2", 
          nome: "Camarote",
          capacidade: 20,
          valorInteira: 150,
          valorMeia: 75,
          valorPromocional: 120,
          valorSolidario: 0,
        }
      ],
      zonas: [],
      descricaoSolidario: "",
      descricaoPromocional: "Oferta especial por tempo limitado! Garante já seu ingresso com desconto.",
    },
    {
      id: "2",
      nome: "2º Lote - Numerado",
      dataInicio: "2024-02-16",
      dataFim: "2024-03-10",
      horaInicio: "00:00",
      horaFim: "23:59",
      quantidadeMaxima: 200,
      quantidadeVendida: 45,
      ativo: true,
      ingressoPromocional: false,
      ingressoSolidario: true,
      ingressoGratuito: false,
      meiaEntrada: false,
      tipoAssento: "numerado",
      setores: [],
      zonas: [
        {
          id: "1",
          nome: "Zona Premium",
          assentos: "A1-A15, B1-B15",
          quantidade: 30,
          valorInteira: 120,
          valorMeia: 60,
          valorPromocional: 0,
          valorSolidario: 90,
        },
        {
          id: "2",
          nome: "Zona Lateral",
          assentos: "C1-C25, D1-D25",
          quantidade: 50,
          valorInteira: 80,
          valorMeia: 40,
          valorPromocional: 0,
          valorSolidario: 60,
        }
      ],
      descricaoSolidario: "1kg de alimento não perecível",
      descricaoPromocional: "",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLot) {
      // Editando lote existente  
      const updatedLots = lots.map(lot => 
        lot.id === editingLot.id 
          ? { ...lot, ...formData, tipoAssento: lot.tipoAssento }
          : lot
      );
      setLots(updatedLots);
      
      toast({
        title: "Lote atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
    } else {
      // Criando novo lote - usa o tipo de assento da sessão
      const newLot: Lot = {
        id: Date.now().toString(),
        ...formData,
        tipoAssento: tipoAssentoSessao,
        quantidadeVendida: 0,
        ativo: true,
      };
      setLots([...lots, newLot]);
      
      toast({
        title: "Lote criado com sucesso!",
        description: "O novo lote foi adicionado à sessão.",
      });
    }

    // Reset form  
    setFormData({
      nome: "",
      dataInicio: "",
      dataFim: "",
      horaInicio: "",
      horaFim: "",
      quantidadeMaxima: 100,
      ingressoPromocional: false,
      ingressoSolidario: false,
      ingressoGratuito: false,
      meiaEntrada: true,
      setores: [
        {
          id: "1",
          nome: "Pista",
          capacidade: 100,
          valorInteira: 50,
          valorMeia: 25,
          valorPromocional: 40,
          valorSolidario: 0,
        }
      ],
      zonas: [
        {
          id: "1",
          nome: "Zona Central",
          assentos: "A1-A20, B1-B20",
          quantidade: 40,
          valorInteira: 50,
          valorMeia: 25,
          valorPromocional: 40,
          valorSolidario: 0,
        }
      ],
      descricaoSolidario: "",
      descricaoPromocional: "",
    });
    setEditingLot(null);
    setIsOpen(false);
  };

  const handleEdit = (lot: Lot) => {
    setEditingLot(lot);
      setFormData({
        nome: lot.nome,
        dataInicio: lot.dataInicio,
        dataFim: lot.dataFim,
        horaInicio: lot.horaInicio,
        horaFim: lot.horaFim,
        quantidadeMaxima: lot.quantidadeMaxima,
        ingressoPromocional: lot.ingressoPromocional,
        ingressoSolidario: lot.ingressoSolidario,
        ingressoGratuito: lot.ingressoGratuito,
        meiaEntrada: lot.meiaEntrada,
        setores: lot.setores,
        zonas: lot.zonas,
        descricaoSolidario: lot.descricaoSolidario,
        descricaoPromocional: lot.descricaoPromocional,
      });
    setIsOpen(true);
  };

  const handleDelete = (lotId: string) => {
    const updatedLots = lots.filter(lot => lot.id !== lotId);
    setLots(updatedLots);
    
    toast({
      title: "Lote excluído com sucesso!",
      description: "O lote foi removido da sessão.",
    });
  };

  const handleNewLot = () => {
    setEditingLot(null);
    setFormData({
      nome: "",
      dataInicio: "",
      dataFim: "",
      horaInicio: "",
      horaFim: "",
      quantidadeMaxima: 100,
      ingressoPromocional: false,
      ingressoSolidario: false,
      ingressoGratuito: false,
      meiaEntrada: true,
      setores: [
        {
          id: "1",
          nome: "Pista",
          capacidade: 100,
          valorInteira: 50,
          valorMeia: 25,
          valorPromocional: 40,
          valorSolidario: 0,
        }
      ],
      zonas: [
        {
          id: "1",
          nome: "Zona Central",
          assentos: "A1-A20, B1-B20",
          quantidade: 40,
          valorInteira: 50,
          valorMeia: 25,
          valorPromocional: 40,
          valorSolidario: 0,
        }
      ],
      descricaoSolidario: "",
      descricaoPromocional: "",
    });
    setIsOpen(true);
  };

  const getTicketTypes = (lot: Lot) => {
    const types = [];
    if (lot.ingressoPromocional) types.push("Promocional");
    if (lot.ingressoSolidario) types.push("Solidário");
    if (lot.ingressoGratuito) types.push("Gratuito");
    return types.length > 0 ? types : ["Padrão"];
  };

  const addSetor = () => {
    const newSetor: Setor = {
      id: Date.now().toString(),
      nome: "",
      capacidade: 50,
      valorInteira: 50,
      valorMeia: 25,
      valorPromocional: 40,
      valorSolidario: 0,
    };
    setFormData({
      ...formData,
      setores: [...formData.setores, newSetor]
    });
  };

  const removeSetor = (setorId: string) => {
    if (formData.setores.length > 1) {
      setFormData({
        ...formData,
        setores: formData.setores.filter(s => s.id !== setorId)
      });
    }
  };

  const updateSetor = (setorId: string, field: keyof Setor, value: any) => {
    setFormData({
      ...formData,
      setores: formData.setores.map(s => 
        s.id === setorId ? { ...s, [field]: value } : s
      )
    });
  };

  const addZona = () => {
    const newZona: Zona = {
      id: Date.now().toString(),
      nome: "",
      assentos: "",
      quantidade: 20,
      valorInteira: 50,
      valorMeia: 25,
      valorPromocional: 40,
      valorSolidario: 0,
    };
    setFormData({
      ...formData,
      zonas: [...formData.zonas, newZona]
    });
  };

  const removeZona = (zonaId: string) => {
    if (formData.zonas.length > 1) {
      setFormData({
        ...formData,
        zonas: formData.zonas.filter(z => z.id !== zonaId)
      });
    }
  };

  const updateZona = (zonaId: string, field: keyof Zona, value: any) => {
    setFormData({
      ...formData,
      zonas: formData.zonas.map(z => 
        z.id === zonaId ? { ...z, [field]: value } : z
      )
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcula capacidade total dos setores ou zonas
  const getTotalCapacidade = (setores: Setor[], zonas: Zona[]) => {
    if (setores.length > 0) {
      return setores.reduce((total, setor) => total + setor.capacidade, 0);
    }
    return zonas.reduce((total, zona) => total + zona.quantidade, 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/eventos/${eventId}/sessoes`)}
            className="hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Sessões
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Lotes da Sessão</h1>
            <p className="text-muted-foreground">
              Configure os lotes de ingresso desta sessão
            </p>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingLot(null);
          }
          setIsOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="hover-scale" onClick={handleNewLot}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLot ? 'Editar Lote' : 'Criar Novo Lote'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Lote</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: 1º Lote - Promocional"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horaInicio">Hora Início</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horaFim">Hora Fim</Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({...formData, horaFim: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantidadeMaxima">Capacidade Total</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantidadeMaxima"
                    type="number"
                    min="1"
                    value={getTotalCapacidade(formData.setores, formData.zonas)}
                    readOnly
                    className="bg-muted"
                  />
                  <span className="text-sm text-muted-foreground flex items-center">
                    (Calculado automaticamente)
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Tipo de Assento:</Label>
                  <Badge variant="outline">
                    {isCurso ? "Assento Livre (Curso)" : tipoAssentoSessao === "livre" ? "Assento Livre" : "Plateia Numerada"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isCurso 
                    ? "Para cursos, o tipo de assento é sempre livre e não pode ser alterado."
                    : "O tipo de assento foi definido na configuração da sessão e não pode ser alterado aqui."
                  }
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <Label className="text-base font-semibold">Tipos de Ingresso</Label>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="meiaEntrada" className="text-sm">Permitir Meia Entrada</Label>
                  <Switch
                    id="meiaEntrada"
                    checked={formData.meiaEntrada}
                    onCheckedChange={(checked) => setFormData({...formData, meiaEntrada: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ingressoPromocional" className="text-sm">Ingresso Promocional Antecipado</Label>
                  <Switch
                    id="ingressoPromocional"
                    checked={formData.ingressoPromocional}
                    onCheckedChange={(checked) => setFormData({...formData, ingressoPromocional: checked})}
                  />
                </div>

                {formData.ingressoPromocional && (
                  <div>
                    <Label htmlFor="descricaoPromocional">Descrição do Ingresso Promocional</Label>
                    <Textarea
                      id="descricaoPromocional"
                      value={formData.descricaoPromocional}
                      onChange={(e) => setFormData({...formData, descricaoPromocional: e.target.value})}
                      placeholder="Ex: Oferta especial por tempo limitado! Garante já seu ingresso com desconto."
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ingressoSolidario" className="text-sm">Ingresso Solidário</Label>
                  <Switch
                    id="ingressoSolidario"
                    checked={formData.ingressoSolidario}
                    onCheckedChange={(checked) => setFormData({...formData, ingressoSolidario: checked})}
                  />
                </div>

                {formData.ingressoSolidario && (
                  <div>
                    <Label htmlFor="descricaoSolidario">Descrição do Ingresso Solidário</Label>
                    <Textarea
                      id="descricaoSolidario"
                      value={formData.descricaoSolidario}
                      onChange={(e) => setFormData({...formData, descricaoSolidario: e.target.value})}
                      placeholder="Ex: 1kg de alimento não perecível"
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ingressoGratuito" className="text-sm">Ingresso Gratuito</Label>
                  <Switch
                    id="ingressoGratuito"
                    checked={formData.ingressoGratuito}
                    onCheckedChange={(checked) => setFormData({...formData, ingressoGratuito: checked})}
                  />
                </div>
              </div>

              {tipoAssentoSessao === "livre" ? (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Setores e Valores</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSetor}
                      className="hover-scale"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Setor
                    </Button>
                  </div>

                  {formData.setores.map((setor, index) => (
                    <div key={setor.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Setor {index + 1}</Label>
                        {formData.setores.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSetor(setor.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nome do Setor</Label>
                          <Input
                            value={setor.nome}
                            onChange={(e) => updateSetor(setor.id, "nome", e.target.value)}
                            placeholder="Ex: Pista, Camarote, VIP"
                            required
                          />
                        </div>
                        <div>
                          <Label>Capacidade</Label>
                          <Input
                            type="number"
                            min="1"
                            value={setor.capacidade}
                            onChange={(e) => updateSetor(setor.id, "capacidade", parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Valor Inteira (R$)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={setor.valorInteira}
                            onChange={(e) => updateSetor(setor.id, "valorInteira", parseFloat(e.target.value))}
                            disabled={formData.ingressoGratuito}
                          />
                        </div>
                        {formData.meiaEntrada && (
                          <div>
                            <Label>Valor Meia (R$)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={setor.valorMeia}
                              onChange={(e) => updateSetor(setor.id, "valorMeia", parseFloat(e.target.value))}
                              disabled={formData.ingressoGratuito}
                            />
                          </div>
                        )}
                      </div>

                      {(formData.ingressoPromocional || formData.ingressoSolidario) && (
                        <div className="grid grid-cols-2 gap-4">
                          {formData.ingressoPromocional && (
                            <div>
                              <Label>Valor Promocional (R$)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={setor.valorPromocional}
                                onChange={(e) => updateSetor(setor.id, "valorPromocional", parseFloat(e.target.value))}
                                disabled={formData.ingressoGratuito}
                              />
                            </div>
                          )}
                          {formData.ingressoSolidario && (
                            <div>
                              <Label>Valor Solidário (R$)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={setor.valorSolidario}
                                onChange={(e) => updateSetor(setor.id, "valorSolidario", parseFloat(e.target.value))}
                                disabled={formData.ingressoGratuito}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Zonas de Plateia Numerada</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addZona}
                      className="hover-scale"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Zona
                    </Button>
                  </div>

                  {formData.zonas.map((zona, index) => (
                    <div key={zona.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Zona {index + 1}</Label>
                        {formData.zonas.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeZona(zona.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>Nome da Zona</Label>
                          <Input
                            value={zona.nome}
                            onChange={(e) => updateZona(zona.id, "nome", e.target.value)}
                            placeholder="Ex: Zona Premium, Zona Central, Zona Lateral"
                            required
                          />
                        </div>
                        <div>
                          <Label>Grupo de Assentos</Label>
                          <Input
                            value={zona.assentos}
                            onChange={(e) => updateZona(zona.id, "assentos", e.target.value)}
                            placeholder="Ex: A1-A20, B1-B15 ou Fileiras 1-5"
                            required
                          />
                        </div>
                        <div>
                          <Label>Quantidade de Assentos</Label>
                          <Input
                            type="number"
                            min="1"
                            value={zona.quantidade}
                            onChange={(e) => updateZona(zona.id, "quantidade", parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Valor Inteira (R$)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={zona.valorInteira}
                            onChange={(e) => updateZona(zona.id, "valorInteira", parseFloat(e.target.value))}
                            disabled={formData.ingressoGratuito}
                          />
                        </div>
                        {formData.meiaEntrada && (
                          <div>
                            <Label>Valor Meia (R$)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={zona.valorMeia}
                              onChange={(e) => updateZona(zona.id, "valorMeia", parseFloat(e.target.value))}
                              disabled={formData.ingressoGratuito}
                            />
                          </div>
                        )}
                      </div>

                      {(formData.ingressoPromocional || formData.ingressoSolidario) && (
                        <div className="grid grid-cols-2 gap-4">
                          {formData.ingressoPromocional && (
                            <div>
                              <Label>Valor Promocional (R$)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={zona.valorPromocional}
                                onChange={(e) => updateZona(zona.id, "valorPromocional", parseFloat(e.target.value))}
                                disabled={formData.ingressoGratuito}
                              />
                            </div>
                          )}
                          {formData.ingressoSolidario && (
                            <div>
                              <Label>Valor Solidário (R$)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={zona.valorSolidario}
                                onChange={(e) => updateZona(zona.id, "valorSolidario", parseFloat(e.target.value))}
                                disabled={formData.ingressoGratuito}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsOpen(false);
                  setEditingLot(null);
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLot ? 'Salvar Alterações' : 'Criar Lote'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {lots.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lote encontrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie o primeiro lote para esta sessão
              </p>
              <Button onClick={handleNewLot}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Lote
              </Button>
            </CardContent>
          </Card>
        ) : (
          lots.map((lot) => (
            <Card key={lot.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {lot.nome}
                      {lot.ativo ? (
                        <Badge variant="default">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getTicketTypes(lot).map((type) => (
                        <Badge
                          key={type}
                          variant="outline"
                          className="text-xs"
                        >
                          {type === "Promocional" && <Gift className="w-3 h-3 mr-1" />}
                          {type === "Solidário" && <Heart className="w-3 h-3 mr-1" />}
                          {type === "Gratuito" && <Users className="w-3 h-3 mr-1" />}
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(lot)}
                      className="hover-scale"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(lot.id)}
                      className="hover-scale text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Período</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(lot.dataInicio).toLocaleDateString()} - {new Date(lot.dataFim).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Horário</p>
                      <p className="text-sm text-muted-foreground">
                        {lot.horaInicio} - {lot.horaFim}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {lot.tipoAssento === "numerado" ? "Zonas" : "Setores"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lot.tipoAssento === "numerado" 
                          ? `${lot.zonas.length} zona${lot.zonas.length !== 1 ? 's' : ''} • ${getTotalCapacidade(lot.setores, lot.zonas)} assentos`
                          : `${lot.setores.length} setor${lot.setores.length !== 1 ? 'es' : ''} • ${getTotalCapacidade(lot.setores, lot.zonas)} lugares`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Vendidos</p>
                      <p className="text-sm text-muted-foreground">
                        {lot.quantidadeVendida}/{getTotalCapacidade(lot.setores, lot.zonas)} ({Math.round((lot.quantidadeVendida / getTotalCapacidade(lot.setores, lot.zonas)) * 100)}%)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">
                    {lot.tipoAssento === "numerado" ? "Zonas e Valores" : "Setores e Valores"}
                  </h4>
                  <div className="space-y-4">
                    {lot.tipoAssento === "numerado" ? (
                      lot.zonas.map((zona, index) => (
                        <div key={zona.id} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {zona.nome}
                            </h5>
                            <span className="text-sm text-muted-foreground">
                              {zona.quantidade} assentos
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Assentos:</strong> {zona.assentos}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Inteira</p>
                              <p className="font-medium">{formatCurrency(zona.valorInteira)}</p>
                            </div>
                            {lot.meiaEntrada && (
                              <div>
                                <p className="text-muted-foreground">Meia</p>
                                <p className="font-medium">{formatCurrency(zona.valorMeia)}</p>
                              </div>
                            )}
                            {lot.ingressoPromocional && (
                              <div>
                                <p className="text-muted-foreground">Promocional</p>
                                <p className="font-medium">{formatCurrency(zona.valorPromocional)}</p>
                              </div>
                            )}
                            {lot.ingressoSolidario && (
                              <div>
                                <p className="text-muted-foreground">Solidário</p>
                                <p className="font-medium">{formatCurrency(zona.valorSolidario)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      lot.setores.map((setor, index) => (
                        <div key={setor.id} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {setor.nome}
                            </h5>
                            <span className="text-sm text-muted-foreground">
                              {setor.capacidade} lugares
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Inteira</p>
                              <p className="font-medium">{formatCurrency(setor.valorInteira)}</p>
                            </div>
                            {lot.meiaEntrada && (
                              <div>
                                <p className="text-muted-foreground">Meia</p>
                                <p className="font-medium">{formatCurrency(setor.valorMeia)}</p>
                              </div>
                            )}
                            {lot.ingressoPromocional && (
                              <div>
                                <p className="text-muted-foreground">Promocional</p>
                                <p className="font-medium">{formatCurrency(setor.valorPromocional)}</p>
                              </div>
                            )}
                            {lot.ingressoSolidario && (
                              <div>
                                <p className="text-muted-foreground">Solidário</p>
                                <p className="font-medium">{formatCurrency(setor.valorSolidario)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {lot.ingressoPromocional && lot.descricaoPromocional && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Promocional:</span> {lot.descricaoPromocional}
                      </p>
                    </div>
                  )}
                  
                  {lot.ingressoSolidario && lot.descricaoSolidario && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Ingresso Solidário:</span> {lot.descricaoSolidario}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionLots;