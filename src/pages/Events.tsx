import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Download, Eye, Edit, Trash2, ShoppingCart, Tag, DollarSign, Ticket, Calendar, TrendingUp, CheckCircle, XCircle, Plus, Upload, Clock, MapPin, Users, X, GraduationCap, ExternalLink, Filter, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RichTextEditor } from "@/components/RichTextEditor";

// Mock data para produtores cadastrados
const mockProdutores = [
  "Rock Productions",
  "Music Events BR", 
  "Festival Organizer",
  "Entertainment Co",
  "Live Shows Inc"
];

// Mock data para locais cadastrados
const mockLocais = [
  "Teatro Municipal de São Paulo",
  "Estádio do Maracanã",
  "Arena Corinthians",
  "Ginásio do Ibirapuera",
  "Centro de Convenções Anhembi",
  "Espaço das Américas",
  "Teatro Alfa",
  "Allianz Parque",
  "Centro Cultural Banco do Brasil",
  "Memorial da América Latina"
];

// Tipos de evento disponíveis
const tiposEvento = [
  "Congressos e Palestras",
  "Cursos e Workshops", 
  "Esportes",
  "Festas e Shows",
  "Gastronomia",
  "Ingresso Único",
  "Passeios e Tours",
  "Religião e Espiritualidade",
  "Teatros e Espetáculos"
];

// Status disponíveis para eventos
const statusEventos = [
  "Aguardando Revisão",
  "Modo Demostrativo", 
  "Vendas Pausadas",
  "Arquivado",
  "Vendas Encerradas",
  "ESGOTADO",
  "Privado",
  "Vendas Abertas",
  "Em Breve"
];

// Classificações disponíveis
const classificacoes = [
  "Livre",
  "10 anos",
  "12 anos", 
  "14 anos",
  "16 anos",
  "18 anos"
];

// Formas de pagamento disponíveis
const formasPagamento = [
  "PIX",
  "PIX e Cartão"
];

// Mock data
const mockEvents = [
  {
    id: 1,
    status: "Vendas Abertas",
    produtor: "Rock Productions",
    tipoEvento: "Festas e Shows",
    nomeEvento: "Rock in Rio 2024",
    formaPagamento: "PIX e Cartão",
    cobrarTaxa: true,
    taxaTicketIdeal: "5%",
    taxaBancaria: true,
    nomearIngressos: true,
    classificacao: "18 anos",
    pixelFacebook: "123456789",
    arteEvento: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=300&fit=crop",
    descricao: "O maior festival de rock do Brasil",
    certificadoCurso: false,
    quantidadeSessoes: 3,
    urlEvento: "https://ticketideal.com/rock-in-rio-2024"
  },
  {
    id: 2,
    status: "Aguardando Revisão",
    produtor: "Music Events BR",
    tipoEvento: "Cursos e Workshops",
    nomeEvento: "Curso de Produção Musical",
    formaPagamento: "PIX e Cartão",
    cobrarTaxa: false,
    taxaTicketIdeal: "0%",
    taxaBancaria: false,
    nomearIngressos: true,
    classificacao: "Livre",
    pixelFacebook: "987654321",
    arteEvento: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop",
    descricao: "Aprenda produção musical do zero",
    certificadoCurso: true,
    quantidadeSessoes: 8,
    urlEvento: "https://ticketideal.com/curso-producao-musical"
  },
  {
    id: 3,
    status: "ESGOTADO",
    produtor: "Festival Organizer",
    tipoEvento: "Festas e Shows",
    nomeEvento: "Festival de Verão 2025",
    formaPagamento: "PIX",
    cobrarTaxa: true,
    taxaTicketIdeal: "3%",
    taxaBancaria: true,
    nomearIngressos: false,
    classificacao: "16 anos",
    pixelFacebook: "456789123",
    arteEvento: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop",
    descricao: "Festival de música eletrônica",
    certificadoCurso: false,
    quantidadeSessoes: 2,
    urlEvento: "https://ticketideal.com/festival-verao-2025"
  },
  {
    id: 4,
    status: "Privado",
    produtor: "Entertainment Co",
    tipoEvento: "Teatros e Espetáculos",
    nomeEvento: "Peça Teatral Especial",
    formaPagamento: "PIX",
    cobrarTaxa: false,
    taxaTicketIdeal: "0%",
    taxaBancaria: false,
    nomearIngressos: true,
    classificacao: "Livre",
    pixelFacebook: "789123456",
    arteEvento: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    descricao: "Evento privado exclusivo",
    certificadoCurso: false,
    quantidadeSessoes: 1,
    urlEvento: "https://ticketideal.com/peca-teatral-especial"
  },
  {
    id: 5,
    status: "Em Breve",
    produtor: "Live Shows Inc",
    tipoEvento: "Congressos e Palestras",
    nomeEvento: "Congresso de Tecnologia 2025",
    formaPagamento: "PIX e Cartão",
    cobrarTaxa: true,
    taxaTicketIdeal: "4%",
    taxaBancaria: true,
    nomearIngressos: true,
    classificacao: "Livre",
    pixelFacebook: "321654987",
    arteEvento: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=300&fit=crop",
    descricao: "O maior evento de tecnologia do país",
    certificadoCurso: false,
    quantidadeSessoes: 5,
    urlEvento: "https://ticketideal.com/congresso-tecnologia-2025"
  }
];

export default function Events() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const [createSessionsDialogOpen, setCreateSessionsDialogOpen] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const editImageRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [currentEventType, setCurrentEventType] = useState("");
  const [sessions, setSessions] = useState([{ 
    id: 1, 
    nomeSessao: "", 
    descricaoBreve: "", 
    local: "", 
    dataInicio: "", 
    horaInicio: "", 
    dataTermino: "", 
    horaTermino: "", 
    capacidade: "", 
    ingressosPorCpf: "", 
    tipoAssento: "",
    cargaHoraria: "",
    diasSemana: [] as string[],
    imagemProfessor: null as string | null
  }]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const teacherImageRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  
  // Estado para salvar dados do evento
  const [eventFormData, setEventFormData] = useState({
    nomeEvento: "",
    produtor: "",
    tipoEvento: "",
    classificacao: "",
    formaPagamento: "",
    taxaTicketIdeal: "",
    pixelFacebook: "",
    descricao: "",
    cobrarTaxa: false,
    taxaBancaria: false,
    nomearIngressos: false,
    certificadoCurso: false
  });
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedColumns, setSelectedColumns] = useState({
    status: true,
    produtor: true,
    tipoEvento: true,
    nomeEvento: true,
    formaPagamento: true,
    cobrarTaxa: true,
    taxaTicketIdeal: true,
    taxaBancaria: true,
    nomearIngressos: true,
    classificacao: true,
    pixelFacebook: true,
    arteEvento: true,
    descricao: true,
    certificadoCurso: true
  });

  const filteredEvents = mockEvents.filter(event => {
    // Filtro por texto de busca
    const matchesSearch = event.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.produtor.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status arquivado
    const matchesArchiveFilter = showArchived ? true : event.status !== "Arquivado";
    
    return matchesSearch && matchesArchiveFilter;
  });

  // Gerar sugestões de busca únicas (só se tiver pelo menos 2 caracteres)
  const searchSuggestions = searchTerm.length > 1 ? Array.from(new Set([
    ...mockEvents.map(event => event.nomeEvento),
    ...mockEvents.map(event => event.produtor),
    ...mockEvents.map(event => event.tipoEvento)
  ])).filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase()) && 
    item.toLowerCase() !== searchTerm.toLowerCase()
  ).slice(0, 8) : []; // Limitar a 8 sugestões

  const columnLabels = {
    status: "Status",
    produtor: "Produtor",
    tipoEvento: "Tipo do Evento",
    nomeEvento: "Nome do Evento",
    formaPagamento: "Forma de Pagamento",
    cobrarTaxa: "Cobrar Taxa",
    taxaTicketIdeal: "Taxa Ticket Ideal",
    taxaBancaria: "Taxa Bancária",
    nomearIngressos: "Nomear Ingressos",
    classificacao: "Classificação",
    pixelFacebook: "ID Pixel Facebook",
    arteEvento: "Arte do Evento",
    descricao: "Descrição",
    certificadoCurso: "Certificado Curso"
  };

  const handleExport = () => {
    console.log("Exportando:", { format: exportFormat, columns: selectedColumns });
    setExportDialogOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar se é imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar para 1080x1080
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = 1080;
          canvas.height = 1080;
          
          // Calcular dimensões para manter proporção e preencher 1080x1080
          const sourceSize = Math.min(img.width, img.height);
          const sourceX = (img.width - sourceSize) / 2;
          const sourceY = (img.height - sourceSize) / 2;
          
          // Desenhar imagem redimensionada e enquadrada
          ctx?.drawImage(
            img,
            sourceX, sourceY, sourceSize, sourceSize, // source
            0, 0, 1080, 1080 // destination
          );
          
          // Converter para base64
          const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
          setEventImage(resizedImage);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addSession = () => {
    const newId = Math.max(...sessions.map(s => s.id)) + 1;
    setSessions([...sessions, { 
      id: newId, 
      nomeSessao: "", 
      descricaoBreve: "", 
      local: "", 
      dataInicio: "", 
      horaInicio: "", 
      dataTermino: "", 
      horaTermino: "", 
      capacidade: "", 
      ingressosPorCpf: "", 
      tipoAssento: currentEventType === "Cursos e Workshops" ? "livre" : "",
      cargaHoraria: "",
      diasSemana: [],
      imagemProfessor: null
    }]);
  };

  const removeSession = (id: number) => {
    if (sessions.length > 1) {
      setSessions(sessions.filter(session => session.id !== id));
    }
  };

  const updateSession = (id: number, field: string, value: string | string[]) => {
    setSessions(sessions.map(session => 
      session.id === id ? { ...session, [field]: value } : session
    ));
  };

  const updateSessionDayOfWeek = (sessionId: number, day: string, checked: boolean) => {
    setSessions(sessions.map(session => {
      if (session.id === sessionId) {
        const newDays = checked 
          ? [...session.diasSemana, day]
          : session.diasSemana.filter(d => d !== day);
        return { ...session, diasSemana: newDays };
      }
      return session;
    }));
  };

  const handleTeacherImageUpload = (sessionId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
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
          
          const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
          setSessions(sessions.map(session => 
            session.id === sessionId ? { ...session, imagemProfessor: resizedImage } : session
          ));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const diasSemana = [
    { value: 'domingo', label: 'Domingo' },
    { value: 'segunda', label: 'Segunda' },
    { value: 'terca', label: 'Terça' },
    { value: 'quarta', label: 'Quarta' },
    { value: 'quinta', label: 'Quinta' },
    { value: 'sexta', label: 'Sexta' },
    { value: 'sabado', label: 'Sábado' }
  ];

  const handleBordero = (eventId: number, eventName: string) => {
    console.log(`Abrindo bordero para evento ${eventId}: ${eventName}`);
    // Aqui você implementaria a lógica para abrir o bordero/relatório
    alert(`Bordero do evento: ${eventName}`);
  };

  const handleGerenciarSessoes = (eventId: number, eventName: string) => {
    console.log(`Navegando para gerenciar sessões do evento ${eventId}: ${eventName}`);
    // Navega para a página de sessões do evento específico
    navigate(`/eventos/${eventId}/sessoes`);
  };

  const handleCreateEvent = () => {
    // Aqui seria feita a lógica de criação do evento
    console.log("Evento criado!");
    setCreateEventDialogOpen(false);
    // Abrir dialog de sessões
    setCreateSessionsDialogOpen(true);
  };

  const handleStatusChange = (eventId: number, newStatus: string) => {
    console.log(`Alterando status do evento ${eventId} para: ${newStatus}`);
    // Aqui você implementaria a lógica para salvar no backend
    setEditingStatusId(null);
  };

  const handleStatusDoubleClick = (eventId: number) => {
    setEditingStatusId(eventId);
  };

  const handleImageDoubleClick = (eventId: number) => {
    setEditingImageId(eventId);
  };

  const handleEventImageUpload = (eventId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar se é imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar para 1080x1080
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = 1080;
          canvas.height = 1080;
          
          // Calcular dimensões para manter proporção e preencher 1080x1080
          const sourceSize = Math.min(img.width, img.height);
          const sourceX = (img.width - sourceSize) / 2;
          const sourceY = (img.height - sourceSize) / 2;
          
          // Desenhar imagem redimensionada e enquadrada
          ctx?.drawImage(
            img,
            sourceX, sourceY, sourceSize, sourceSize, // source
            0, 0, 1080, 1080 // destination
          );
          
          // Converter para base64
          const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
          
          // Aqui você implementaria a lógica para salvar no backend
          console.log(`Atualizando imagem do evento ${eventId}:`, resizedImage);
          
          // Fechar o modo de edição
          setEditingImageId(null);
  };

  const handleBordero = (eventId: number, eventName: string) => {
    console.log(`Abrindo bordero para evento ${eventId}: ${eventName}`);
    // Aqui você implementaria a lógica para abrir o bordero/relatório
    alert(`Bordero do evento: ${eventName}`);
  };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aguardando Revisão":
        return (
          <Badge variant="default" className="bg-cyan-100 text-cyan-800 border-cyan-200">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Modo Demostrativo":
      case "Vendas Pausadas":
      case "Vendas Encerradas":
      case "ESGOTADO":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Arquivado":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Privado":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Eye className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Vendas Abertas":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Em Breve":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
          <p className="text-muted-foreground">Gerencie todos os eventos da plataforma</p>
        </div>
        <Dialog open={createEventDialogOpen} onOpenChange={setCreateEventDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Evento</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nomeEvento">Nome do Evento *</Label>
                <Input 
                  id="nomeEvento" 
                  placeholder="Ex: Rock in Rio 2024" 
                  value={eventFormData.nomeEvento}
                  onChange={(e) => setEventFormData({...eventFormData, nomeEvento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="produtor">Produtor *</Label>
                <Select value={eventFormData.produtor} onValueChange={(value) => setEventFormData({...eventFormData, produtor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produtor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProdutores.map((produtor) => (
                      <SelectItem key={produtor} value={produtor}>
                        {produtor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="tipoEvento">Tipo do Evento *</Label>
                <Select value={eventFormData.tipoEvento} onValueChange={(value) => {
                   setEventFormData({...eventFormData, tipoEvento: value});
                   setCurrentEventType(value);
                   if (value === "Cursos e Workshops") {
                     setSessions(sessions.map(session => ({ 
                       ...session, 
                       tipoAssento: "livre" 
                     })));
                   }
                 }}>
                  <SelectTrigger>
                     <SelectValue placeholder="Selecione o tipo do evento" />
                   </SelectTrigger>
                   <SelectContent>
                     {tiposEvento.map((tipo) => (
                       <SelectItem key={tipo} value={tipo}>
                         {tipo}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
              <div className="space-y-2">
                <Label htmlFor="classificacao">Classificação *</Label>
                <Select value={eventFormData.classificacao} onValueChange={(value) => setEventFormData({...eventFormData, classificacao: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    {classificacoes.map((classificacao) => (
                      <SelectItem key={classificacao} value={classificacao}>
                        {classificacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <Select value={eventFormData.formaPagamento} onValueChange={(value) => setEventFormData({...eventFormData, formaPagamento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxaTicketIdeal">Taxa Ticket Ideal</Label>
                <Input 
                  id="taxaTicketIdeal" 
                  placeholder="Ex: 5%" 
                  value={eventFormData.taxaTicketIdeal}
                  onChange={(e) => setEventFormData({...eventFormData, taxaTicketIdeal: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixelFacebook">ID Pixel Facebook</Label>
                <Input 
                  id="pixelFacebook" 
                  placeholder="Ex: 123456789" 
                  value={eventFormData.pixelFacebook}
                  onChange={(e) => setEventFormData({...eventFormData, pixelFacebook: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Arte do Evento (1080x1080px)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {eventImage ? (
                    <div className="space-y-4">
                      <img 
                        src={eventImage} 
                        alt="Preview da arte do evento" 
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEventImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          Remover Imagem
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Imagem
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        A imagem será automaticamente ajustada para 1080x1080px
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="descricao">Descrição do Evento</Label>
                <RichTextEditor
                  content={eventFormData.descricao}
                  onChange={(content) => setEventFormData({...eventFormData, descricao: content})}
                  placeholder="Digite a descrição do evento... Use os botões da barra para formatação, adicionar títulos, links e emojis 🎉"
                  className="min-h-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Você pode usar negrito, itálico, títulos, listas, links e emojis na descrição do evento.
                </p>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cobrarTaxa" 
                    checked={eventFormData.cobrarTaxa}
                    onCheckedChange={(checked) => setEventFormData({...eventFormData, cobrarTaxa: checked as boolean})}
                  />
                  <Label htmlFor="cobrarTaxa">Cobrar Taxa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="taxaBancaria" 
                    checked={eventFormData.taxaBancaria}
                    onCheckedChange={(checked) => setEventFormData({...eventFormData, taxaBancaria: checked as boolean})}
                  />
                  <Label htmlFor="taxaBancaria">Taxa Bancária</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="nomearIngressos" 
                    checked={eventFormData.nomearIngressos}
                    onCheckedChange={(checked) => setEventFormData({...eventFormData, nomearIngressos: checked as boolean})}
                  />
                  <Label htmlFor="nomearIngressos">Nomear Ingressos</Label>
                </div>
                {currentEventType === "Cursos e Workshop" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="certificadoCurso" 
                      checked={eventFormData.certificadoCurso}
                      onCheckedChange={(checked) => setEventFormData({...eventFormData, certificadoCurso: checked as boolean})}
                    />
                    <Label htmlFor="certificadoCurso">Certificado de Curso (apenas para cursos)</Label>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateEventDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateEvent}>
                Próximo: Configurar Sessões
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Cadastrar Sessões */}
        <Dialog open={createSessionsDialogOpen} onOpenChange={setCreateSessionsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configurar Sessões do Evento</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Configure as datas, horários e locais das sessões do seu evento
              </p>
            </DialogHeader>
            
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <Card key={session.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Sessão {index + 1}</CardTitle>
                      {sessions.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSession(session.id)}
                          className="text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                   <CardContent>
                     <div className="space-y-6">
                       {/* Nome e Descrição */}
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label>{currentEventType === "Cursos e Workshops" ? "Nome da Aula *" : "Nome da Sessão *"}</Label>
                           <Input
                             placeholder={currentEventType === "Cursos e Workshops" ? "Ex: Aula 1, Introdução..." : "Ex: Sessão 1, Apresentação..."}
                             value={session.nomeSessao}
                             onChange={(e) => updateSession(session.id, 'nomeSessao', e.target.value)}
                           />
                         </div>
                          <div className="space-y-2">
                            <Label>Local do Evento *</Label>
                            <Select
                              value={session.local}
                              onValueChange={(value) => updateSession(session.id, 'local', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um local" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockLocais.map((local) => (
                                  <SelectItem key={local} value={local}>
                                    {local}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                       </div>

                       <div className="space-y-2">
                         <Label>Descrição Breve</Label>
                         <Input
                           placeholder="Descrição curta da sessão..."
                           value={session.descricaoBreve}
                           onChange={(e) => updateSession(session.id, 'descricaoBreve', e.target.value)}
                         />
                       </div>

                       {/* Datas e Horários */}
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label>Data e Hora de Início *</Label>
                           <div className="grid grid-cols-2 gap-2">
                             <div className="relative">
                               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                               <Input
                                 type="date"
                                 value={session.dataInicio}
                                 onChange={(e) => updateSession(session.id, 'dataInicio', e.target.value)}
                                 className="pl-10"
                               />
                             </div>
                             <div className="relative">
                               <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                               <Input
                                 type="time"
                                 value={session.horaInicio}
                                 onChange={(e) => updateSession(session.id, 'horaInicio', e.target.value)}
                                 className="pl-10"
                               />
                             </div>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <Label>Data e Hora de Término *</Label>
                           <div className="grid grid-cols-2 gap-2">
                             <div className="relative">
                               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                               <Input
                                 type="date"
                                 value={session.dataTermino}
                                 onChange={(e) => updateSession(session.id, 'dataTermino', e.target.value)}
                                 className="pl-10"
                               />
                             </div>
                             <div className="relative">
                               <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                               <Input
                                 type="time"
                                 value={session.horaTermino}
                                 onChange={(e) => updateSession(session.id, 'horaTermino', e.target.value)}
                                 className="pl-10"
                               />
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Capacidade e Configurações */}
                       <div className="grid grid-cols-3 gap-4">
                         <div className="space-y-2">
                           <Label>Público/Capacidade *</Label>
                           <div className="relative">
                             <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                             <Input
                               type="number"
                               placeholder="Ex: 500"
                               value={session.capacidade}
                               onChange={(e) => updateSession(session.id, 'capacidade', e.target.value)}
                               className="pl-10"
                             />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <Label>Ingressos por CPF *</Label>
                           <Input
                             type="number"
                             placeholder="Ex: 4"
                             value={session.ingressosPorCpf}
                             onChange={(e) => updateSession(session.id, 'ingressosPorCpf', e.target.value)}
                           />
                         </div>
                         {currentEventType !== "Cursos e Workshops" && (
                           <div className="space-y-2">
                             <Label>Tipo de Assento *</Label>
                             <Select
                               value={session.tipoAssento}
                               onValueChange={(value) => updateSession(session.id, 'tipoAssento', value)}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder="Selecionar" />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="livre">Assentos Livres</SelectItem>
                                 <SelectItem value="numerado">Assentos Numerados</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                         )}
                       </div>

                       {/* Campos específicos para Cursos */}
                       {currentEventType === "Cursos e Workshops" && (
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
                                 value={session.cargaHoraria}
                                 onChange={(e) => updateSession(session.id, 'cargaHoraria', e.target.value)}
                               />
                             </div>
                             <div className="space-y-2">
                               <Label>Imagem do Professor (1080x1080px)</Label>
                               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                 {session.imagemProfessor ? (
                                   <div className="space-y-2">
                                     <img 
                                       src={session.imagemProfessor} 
                                       alt="Preview da imagem do professor" 
                                       className="w-20 h-20 object-cover rounded-lg mx-auto"
                                     />
                                     <div className="text-center">
                                       <Button 
                                         variant="outline" 
                                         size="sm"
                                         onClick={() => {
                                           setSessions(sessions.map(s => 
                                             s.id === session.id ? { ...s, imagemProfessor: null } : s
                                           ));
                                           if (teacherImageRefs.current[session.id]) {
                                             teacherImageRefs.current[session.id]!.value = '';
                                           }
                                         }}
                                       >
                                         Remover
                                       </Button>
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="text-center">
                                     <Button 
                                       variant="outline" 
                                       size="sm"
                                       onClick={() => teacherImageRefs.current[session.id]?.click()}
                                     >
                                       <Upload className="w-4 h-4 mr-2" />
                                       Selecionar
                                     </Button>
                                   </div>
                                 )}
                                 <input
                                   ref={(el) => {
                                     if (el) teacherImageRefs.current[session.id] = el;
                                   }}
                                   type="file"
                                   accept="image/*"
                                   onChange={(e) => handleTeacherImageUpload(session.id, e)}
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
                                     id={`${session.id}-${dia.value}`}
                                     checked={session.diasSemana.includes(dia.value)}
                                     onCheckedChange={(checked) => 
                                       updateSessionDayOfWeek(session.id, dia.value, checked as boolean)
                                     }
                                   />
                                   <Label htmlFor={`${session.id}-${dia.value}`} className="text-sm">
                                     {dia.label}
                                   </Label>
                                 </div>
                               ))}
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" onClick={addSession} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Nova Sessão
              </Button>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCreateSessionsDialogOpen(false);
                  setCreateEventDialogOpen(true);
                }}
              >
                Voltar para Evento
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCreateSessionsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  console.log("Evento finalizado, redirecionando para lotes da primeira sessão...");
                  
                  // Simula a criação do evento e pega o ID
                  const newEventId = Date.now();
                  // Simula a criação da primeira sessão
                  const firstSessionId = Date.now() + 1;
                  
                  setCreateSessionsDialogOpen(false);
                  // Reset forms
                  setEventImage(null);
                  setSessions([{ 
                    id: 1, 
                    nomeSessao: "", 
                    descricaoBreve: "", 
                    local: "", 
                    dataInicio: "", 
                    horaInicio: "", 
                    dataTermino: "", 
                    horaTermino: "", 
                    capacidade: "", 
                    ingressosPorCpf: "", 
                    tipoAssento: "",
                    cargaHoraria: "",
                    diasSemana: [],
                    imagemProfessor: null
                  }]);
                  
                  // Redireciona diretamente para os lotes da primeira sessão
                  navigate(`/eventos/${newEventId}/sessoes/${firstSessionId}/lotes`);
                }}>
                  Finalizar Cadastro
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Export */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                    <Input
                      placeholder="Buscar por nome do evento, produtor ou tipo..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSearchOpen(e.target.value.length > 1); // Só abre após 2+ caracteres
                      }}
                      className="pl-10 pr-10"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => {
                          setSearchTerm("");
                          setSearchOpen(false);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </PopoverTrigger>
                {searchSuggestions.length > 0 && (
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandEmpty>Nenhuma sugestão encontrada.</CommandEmpty>
                        <CommandGroup heading="Sugestões">
                          {searchSuggestions.map((suggestion, index) => (
                            <CommandItem
                              key={index}
                              value={suggestion}
                              onSelect={() => {
                                setSearchTerm(suggestion);
                                setSearchOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Search className="mr-2 h-4 w-4" />
                              <span className="flex-1">{suggestion}</span>
                              {mockEvents.some(e => e.nomeEvento === suggestion) && (
                                <span className="text-xs text-muted-foreground">Evento</span>
                              )}
                              {mockEvents.some(e => e.produtor === suggestion) && (
                                <span className="text-xs text-muted-foreground">Produtor</span>
                              )}
                              {mockEvents.some(e => e.tipoEvento === suggestion) && (
                                <span className="text-xs text-muted-foreground">Tipo</span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
            
            <div className="flex items-center gap-4 px-4 py-2 border border-border rounded-lg bg-muted/30">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <Label htmlFor="show-archived" className="text-sm font-medium">
                  Mostrar Arquivados
                </Label>
              </div>
            </div>
            
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Exportar Eventos</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Formato</Label>
                    <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excel" id="excel" />
                        <Label htmlFor="excel">Excel (.xlsx)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="pdf" />
                        <Label htmlFor="pdf">PDF</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Colunas para exportar</Label>
                    <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
                      {Object.entries(columnLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={selectedColumns[key as keyof typeof selectedColumns]}
                            onCheckedChange={(checked) =>
                              setSelectedColumns(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                          <Label htmlFor={key} className="text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleExport} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Eventos ({filteredEvents.length})
            {!showArchived && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (excluindo arquivados)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arte</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Produtor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nome do Evento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Sessões</TableHead>
                <TableHead>Bordero</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {editingImageId === event.id ? (
                      <div className="space-y-2">
                        <div className="text-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => editImageRefs.current[event.id]?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Selecionar Nova Imagem
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingImageId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                        <input
                          ref={(el) => {
                            if (el) editImageRefs.current[event.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEventImageUpload(event.id, e)}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div 
                        onDoubleClick={() => handleImageDoubleClick(event.id)}
                        className="cursor-pointer"
                        title="Duplo clique para editar imagem"
                      >
                        <img 
                          src={event.arteEvento} 
                          alt="Arte do evento" 
                          className="w-16 h-16 object-cover rounded-lg hover:opacity-80 transition-opacity"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingStatusId === event.id ? (
                      <Select
                        defaultValue={event.status}
                        onValueChange={(value) => handleStatusChange(event.id, value)}
                        onOpenChange={(open) => {
                          if (!open) setEditingStatusId(null);
                        }}
                      >
                        <SelectTrigger className="w-auto min-w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusEventos.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div 
                        onDoubleClick={() => handleStatusDoubleClick(event.id)}
                        className="cursor-pointer"
                        title="Duplo clique para editar"
                      >
                        {getStatusBadge(event.status)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{event.produtor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.tipoEvento}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-medium">{event.nomeEvento}</div>
                      <a 
                        href={event.urlEvento} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 underline flex items-center gap-1"
                      >
                        ir para o evento
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{event.formaPagamento}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{event.taxaTicketIdeal}</span>
                      {event.taxaBancaria && (
                        <Badge variant="outline" className="text-xs">
                          Taxa Bancária
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 p-2 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleGerenciarSessoes(event.id, event.nomeEvento)}
                      title="Clique para gerenciar as sessões deste evento"
                    >
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{event.quantidadeSessoes}</span>
                      <span className="text-sm text-muted-foreground">
                        {event.quantidadeSessoes === 1 ? 'sessão' : 'sessões'}
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground ml-1" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBordero(event.id, event.nomeEvento)}
                    >
                      Bordero
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Configurações - {event.nomeEvento}</DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="geral" className="w-full">
                            <TabsList className="grid w-full grid-cols-7">
                              <TabsTrigger value="geral">Geral</TabsTrigger>
                              <TabsTrigger value="carrinho">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Carrinho
                              </TabsTrigger>
                              <TabsTrigger value="cupons">
                                <Tag className="w-4 h-4 mr-1" />
                                Cupons
                              </TabsTrigger>
                              <TabsTrigger value="financeiro">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Financeiro
                              </TabsTrigger>
                              <TabsTrigger value="ingressos">
                                <Ticket className="w-4 h-4 mr-1" />
                                Ingressos
                              </TabsTrigger>
                              <TabsTrigger value="sessoes">
                                <Calendar className="w-4 h-4 mr-1" />
                                Sessões
                              </TabsTrigger>
                              <TabsTrigger value="vendas">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Vendas
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="geral" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Informações Gerais</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Nome do Evento</Label>
                                      <p className="mt-1 font-medium">{event.nomeEvento}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Produtor</Label>
                                      <p className="mt-1">{event.produtor}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                                      <Badge variant="outline" className="mt-1">{event.tipoEvento}</Badge>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Classificação</Label>
                                      <p className="mt-1">{event.classificacao}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Forma de Pagamento</Label>
                                      <p className="mt-1">{event.formaPagamento}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">ID Pixel Facebook</Label>
                                      <p className="mt-1">{event.pixelFacebook}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label htmlFor={`taxa-${event.id}`} className="text-sm font-medium text-muted-foreground">Taxa Ticket Ideal (%)</Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Input 
                                          id={`taxa-${event.id}`}
                                          type="number" 
                                          min="0" 
                                          max="100" 
                                          step="0.1"
                                          defaultValue={event.taxaTicketIdeal.replace('%', '')}
                                          className="w-32"
                                        />
                                        <span className="text-sm text-muted-foreground">%</span>
                                        <Button size="sm" variant="outline">
                                          Salvar
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="col-span-2">
                                      <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                                      <p className="mt-1">{event.descricao}</p>
                                    </div>
                                    {event.certificadoCurso && (
                                      <div className="col-span-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Certificado de Curso Disponível
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="carrinho" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Configurações do Carrinho</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground">Configurações específicas do carrinho para {event.nomeEvento}</p>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="cupons" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Cupons de Desconto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground">Gerenciar cupons específicos para {event.nomeEvento}</p>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="financeiro" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Configurações Financeiras</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Taxa Ticket Ideal</Label>
                                      <p className="mt-1">{event.taxaTicketIdeal}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Taxa Bancária</Label>
                                      <p className="mt-1">{event.taxaBancaria ? "Sim" : "Não"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Cobrar Taxa</Label>
                                      <p className="mt-1">{event.cobrarTaxa ? "Sim" : "Não"}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="ingressos" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Configurações de Ingressos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Nomear Ingressos</Label>
                                    <p className="mt-1">{event.nomearIngressos ? "Sim" : "Não"}</p>
                                  </div>
                                  <p className="text-muted-foreground mt-4">Tipos de ingressos para {event.nomeEvento}</p>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="sessoes" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Sessões do Evento</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground">Gerenciar datas e horários para {event.nomeEvento}</p>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="vendas" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Relatório de Vendas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground">Dados de vendas específicos para {event.nomeEvento}</p>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}