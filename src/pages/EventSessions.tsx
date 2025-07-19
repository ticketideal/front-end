import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Calendar, Clock, Users, ExternalLink, ArrowLeft, Edit, Upload, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  capacidadeMaxima: number;
  ativo: boolean;
  totalLotes: number;
  tipoAssento: "livre" | "numerado";
  // Campos específicos para cursos
  cargaHoraria?: string;
  diasSemana?: string[];
  imagemProfessor?: string | null;
}

const EventSessions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const teacherImageRef = useRef<HTMLInputElement>(null);
  
  // Simular que o tipo de evento vem de uma API ou contexto
  // Em produção, isso viria dos dados reais do evento
  const tipoEvento = "Cursos e Workshops"; // Simulando - viria dos dados reais do evento
  const isCurso = tipoEvento === "Cursos e Workshops";
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    horaInicio: "",
    horaFim: "",
    capacidadeMaxima: 100,
    tipoAssento: isCurso ? "livre" : "livre" as "livre" | "numerado",
    // Campos específicos para cursos
    cargaHoraria: "",
    diasSemana: [] as string[],
    imagemProfessor: null as string | null,
  });

  const diasSemana = [
    { value: 'domingo', label: 'Domingo' },
    { value: 'segunda', label: 'Segunda' },
    { value: 'terca', label: 'Terça' },
    { value: 'quarta', label: 'Quarta' },
    { value: 'quinta', label: 'Quinta' },
    { value: 'sexta', label: 'Sexta' },
    { value: 'sabado', label: 'Sábado' }
  ];

  // Mock data - substituir por dados reais
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      nome: "Sessão Principal",
      descricao: "Sessão principal do evento com apresentações principais",
      dataInicio: "2024-03-15",
      dataFim: "2024-03-15",
      horaInicio: "19:00",
      horaFim: "23:00",
      capacidadeMaxima: 500,
      ativo: true,
      totalLotes: 3,
      tipoAssento: "livre",
      cargaHoraria: "40",
      diasSemana: ["segunda", "quarta", "sexta"],
      imagemProfessor: null,
    },
    {
      id: "2",
      nome: "Sessão VIP",
      descricao: "Sessão exclusiva para convidados VIP",
      dataInicio: "2024-03-15",
      dataFim: "2024-03-15",
      horaInicio: "18:00",
      horaFim: "19:00",
      capacidadeMaxima: 50,
      ativo: true,
      totalLotes: 1,
      tipoAssento: "numerado",
      cargaHoraria: "",
      diasSemana: [],
      imagemProfessor: null,
    },
  ]);

  const handleTeacherImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar para 1080x1080px
          canvas.width = 1080;
          canvas.height = 1080;
          
          const sourceSize = Math.min(img.width, img.height);
          const sourceX = (img.width - sourceSize) / 2;
          const sourceY = (img.height - sourceSize) / 2;
          
          ctx?.drawImage(
            img,
            sourceX, sourceY, sourceSize, sourceSize,
            0, 0, 1080, 1080
          );
          
          // Converter para JPG com qualidade 0.9
          const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
          
          setFormData({...formData, imagemProfessor: resizedImage});
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const updateDayOfWeek = (day: string, checked: boolean) => {
    const currentDays = formData.diasSemana;
    const newDays = checked 
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);
    
    setFormData({...formData, diasSemana: newDays});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSession) {
      // Atualizar sessão existente
      setSessions(sessions.map(session => 
        session.id === editingSession.id 
          ? { ...session, ...formData }
          : session
      ));
      
      setEditingSession(null);
      toast({
        title: "Sessão atualizada com sucesso!",
      });
    } else {
      // Criar nova sessão
      const newSession: Session = {
        id: Date.now().toString(),
        ...formData,
        ativo: true,
        totalLotes: 0,
      };

      setSessions([...sessions, newSession]);
      setIsOpen(false);
      
      toast({
        title: "Sessão criada com sucesso!",
        description: "Redirecionando para configurar os lotes...",
      });

      // Redireciona automaticamente para a página de lotes da sessão criada
      setTimeout(() => {
        navigate(`/eventos/${eventId}/sessoes/${newSession.id}/lotes`);
      }, 1000);
    }
    
    // Reset do formulário
    setFormData({
      nome: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
      horaInicio: "",
      horaFim: "",
      capacidadeMaxima: 100,
      tipoAssento: isCurso ? "livre" : "livre",
      cargaHoraria: "",
      diasSemana: [],
      imagemProfessor: null,
    });
  };

  const handleManageLots = (sessionId: string) => {
    navigate(`/eventos/${eventId}/sessoes/${sessionId}/lotes`);
  };

  const handleEditSession = (session: Session) => {
    setFormData({
      nome: session.nome,
      descricao: session.descricao,
      dataInicio: session.dataInicio,
      dataFim: session.dataFim,
      horaInicio: session.horaInicio,
      horaFim: session.horaFim,
      capacidadeMaxima: session.capacidadeMaxima,
      tipoAssento: session.tipoAssento,
      cargaHoraria: session.cargaHoraria || "",
      diasSemana: session.diasSemana || [],
      imagemProfessor: session.imagemProfessor || null,
    });
    setEditingSession(session);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/eventos')}
            className="hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Eventos
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Sessões do Evento</h1>
            <p className="text-muted-foreground">
              Gerencie as sessões e seus respectivos lotes
            </p>
          </div>
        </div>
        
        <Dialog open={isOpen || !!editingSession} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditingSession(null);
        }}>
          <DialogTrigger asChild>
            <Button className="hover-scale">
              <Plus className="w-4 h-4 mr-2" />
              Nova Sessão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSession ? 'Editar Sessão' : 'Criar Nova Sessão'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Sessão</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Sessão Principal"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva a sessão..."
                  rows={3}
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
                <Label htmlFor="capacidadeMaxima">Capacidade Máxima</Label>
                <Input
                  id="capacidadeMaxima"
                  type="number"
                  min="1"
                  value={formData.capacidadeMaxima}
                  onChange={(e) => setFormData({...formData, capacidadeMaxima: parseInt(e.target.value)})}
                  required
                />
              </div>

              {!isCurso && (
                <div className="border rounded-lg p-4 space-y-4">
                  <Label className="text-base font-semibold">Tipo de Assento</Label>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="assentoLivre"
                        name="tipoAssento"
                        value="livre"
                        checked={formData.tipoAssento === "livre"}
                        onChange={(e) => setFormData({...formData, tipoAssento: e.target.value as "livre" | "numerado"})}
                      />
                      <Label htmlFor="assentoLivre" className="text-sm">Assento Livre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="assentoNumerado"
                        name="tipoAssento"
                        value="numerado"
                        checked={formData.tipoAssento === "numerado"}
                        onChange={(e) => setFormData({...formData, tipoAssento: e.target.value as "livre" | "numerado"})}
                      />
                      <Label htmlFor="assentoNumerado" className="text-sm">Plateia Numerada</Label>
                    </div>
                  </div>
                </div>
              )}

              {isCurso && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">Tipo de Assento:</Label>
                    <Badge variant="outline">Assento Livre (Curso)</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Para cursos e workshops, o tipo de assento é sempre livre e não pode ser alterado.
                  </p>
                </div>
              )}

              {/* Campos específicos para Cursos */}
              {isCurso && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Configurações do Curso</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Carga Horária (horas) *</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 40"
                        value={formData.cargaHoraria}
                        onChange={(e) => setFormData({...formData, cargaHoraria: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Imagem do Professor (1080x1080px)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {formData.imagemProfessor ? (
                          <div className="space-y-2">
                            <img 
                              src={formData.imagemProfessor} 
                              alt="Preview da imagem do professor" 
                              className="w-20 h-20 object-cover rounded-lg mx-auto"
                            />
                            <div className="text-center">
                              <Button 
                                type="button"
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setFormData({...formData, imagemProfessor: null});
                                  if (teacherImageRef.current) {
                                    teacherImageRef.current.value = '';
                                  }
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remover
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Button 
                              type="button"
                              variant="outline" 
                              size="sm"
                              onClick={() => teacherImageRef.current?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Selecionar
                            </Button>
                          </div>
                        )}
                        <input
                          ref={teacherImageRef}
                          type="file"
                          accept="image/*"
                          onChange={handleTeacherImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dias da Semana do Curso *</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {diasSemana.map((dia) => (
                        <div key={dia.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={dia.value}
                            checked={formData.diasSemana.includes(dia.value)}
                            onCheckedChange={(checked) => 
                              updateDayOfWeek(dia.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={dia.value} className="text-sm">
                            {dia.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsOpen(false);
                  setEditingSession(null);
                  setFormData({
                    nome: "",
                    descricao: "",
                    dataInicio: "",
                    dataFim: "",
                    horaInicio: "",
                    horaFim: "",
                    capacidadeMaxima: 100,
                    tipoAssento: isCurso ? "livre" : "livre",
                    cargaHoraria: "",
                    diasSemana: [],
                    imagemProfessor: null,
                  });
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSession ? 'Atualizar Sessão' : 'Criar Sessão'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma sessão encontrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie a primeira sessão para este evento
              </p>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Sessão
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {session.nome}
                      {session.ativo ? (
                        <Badge variant="default">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {session.descricao}
                    </p>
                  </div>
                   <div className="flex gap-2">
                     <Button
                       variant="outline"
                       onClick={() => handleEditSession(session)}
                       className="hover-scale"
                     >
                       <Edit className="w-4 h-4 mr-2" />
                       Editar
                     </Button>
                     <Button
                       onClick={() => handleManageLots(session.id)}
                       className="hover-scale"
                     >
                       <ExternalLink className="w-4 h-4 mr-2" />
                       Gerenciar Lotes
                     </Button>
                   </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Período</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.dataInicio).toLocaleDateString()} - {new Date(session.dataFim).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Horário</p>
                      <p className="text-sm text-muted-foreground">
                        {session.horaInicio} - {session.horaFim}
                      </p>
                    </div>
                  </div>
                  
                   <div className="flex items-center gap-2">
                     <Users className="w-4 h-4 text-muted-foreground" />
                     <div>
                       <p className="text-sm font-medium">Capacidade</p>
                        <p className="text-sm text-muted-foreground">
                          {session.capacidadeMaxima} {session.tipoAssento === "numerado" ? "assentos numerados" : "lugares livres"} ({session.totalLotes} lotes)
                          {isCurso && session.cargaHoraria && (
                            <span> • {session.cargaHoraria}h de carga horária</span>
                          )}
                          {isCurso && session.diasSemana && session.diasSemana.length > 0 && (
                            <span> • {session.diasSemana.map(dia => diasSemana.find(d => d.value === dia)?.label).join(', ')}</span>
                          )}
                        </p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EventSessions;