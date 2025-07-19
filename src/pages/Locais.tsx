import { useState } from "react";
import { 
  Plus, 
  Search, 
  MapPin,
  Edit,
  Trash2,
  Eye,
  Grid,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapaAssentos } from "@/components/MapaAssentos";

interface Assento {
  id: string;
  setor: string;
  letra: string;
  numero: string;
  x: number;
  y: number;
  disponivel: boolean;
}

interface Setor {
  id: string;
  nome: string;
  cor: string;
  assentos: Assento[];
}

interface Local {
  id: string;
  nome: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  setores: Setor[];
}

export default function Locais() {
  const { toast } = useToast();
  
  const [locais, setLocais] = useState<Local[]>([
    {
      id: "1",
      nome: "Teatro Municipal",
      cep: "01234-567",
      endereco: "Rua das Artes",
      numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      setores: [
        {
          id: "1",
          nome: "Plateia",
          cor: "#3B82F6",
          assentos: []
        },
        {
          id: "2", 
          nome: "Balcão",
          cor: "#EF4444",
          assentos: []
        }
      ]
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSetorDialogOpen, setIsSetorDialogOpen] = useState(false);
  const [isAssentoDialogOpen, setIsAssentoDialogOpen] = useState(false);
  const [isAssentoLoteDialogOpen, setIsAssentoLoteDialogOpen] = useState(false);
  const [isMapaDialogOpen, setIsMapaDialogOpen] = useState(false);
  const [editingLocal, setEditingLocal] = useState<Local | null>(null);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<Setor | null>(null);
  const [selectedSetorMapa, setSelectedSetorMapa] = useState<Setor | null>(null);

  const [novoLocal, setNovoLocal] = useState<Partial<Local>>({
    setores: []
  });

  const [novoSetor, setNovoSetor] = useState<Partial<Setor>>({
    cor: "#3B82F6",
    assentos: []
  });

  const [novoAssento, setNovoAssento] = useState<Partial<Assento>>({
    disponivel: true,
    x: 0,
    y: 0
  });

  const [assentosLote, setAssentosLote] = useState({
    letra: "",
    numeroInicio: 1,
    numeroFim: 10,
    espacamento: 50,
    inicioX: 50,
    inicioY: 50
  });

  const filteredLocais = locais.filter(local => 
    local.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveLocal = () => {
    if (!novoLocal.nome || !novoLocal.endereco) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const localCompleto: Local = {
      id: editingLocal?.id || Date.now().toString(),
      nome: novoLocal.nome!,
      cep: novoLocal.cep || "",
      endereco: novoLocal.endereco!,
      numero: novoLocal.numero || "",
      bairro: novoLocal.bairro || "",
      cidade: novoLocal.cidade || "",
      estado: novoLocal.estado || "",
      setores: novoLocal.setores || []
    };

    if (editingLocal) {
      setLocais(locais.map(l => l.id === editingLocal.id ? localCompleto : l));
      toast({
        title: "Sucesso",
        description: "Local atualizado com sucesso!",
      });
    } else {
      setLocais([...locais, localCompleto]);
      toast({
        title: "Sucesso",
        description: "Local cadastrado com sucesso!",
      });
    }

    setIsDialogOpen(false);
    setEditingLocal(null);
    setNovoLocal({ setores: [] });
  };

  const handleSaveSetor = () => {
    if (!novoSetor.nome || !selectedLocal) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const setorCompleto: Setor = {
      id: Date.now().toString(),
      nome: novoSetor.nome!,
      cor: novoSetor.cor || "#3B82F6",
      assentos: []
    };

    const localAtualizado = {
      ...selectedLocal,
      setores: [...selectedLocal.setores, setorCompleto]
    };

    setLocais(locais.map(l => l.id === selectedLocal.id ? localAtualizado : l));
    setSelectedLocal(localAtualizado);
    
    toast({
      title: "Sucesso",
      description: "Setor adicionado com sucesso!",
    });

    setIsSetorDialogOpen(false);
    setNovoSetor({ cor: "#3B82F6", assentos: [] });
  };

  const handleSaveAssento = () => {
    if (!novoAssento.letra || !novoAssento.numero || !selectedSetor || !selectedLocal) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const assentoCompleto: Assento = {
      id: Date.now().toString(),
      setor: selectedSetor.id,
      letra: novoAssento.letra!,
      numero: novoAssento.numero!,
      x: novoAssento.x || 0,
      y: novoAssento.y || 0,
      disponivel: true
    };

    const setorAtualizado = {
      ...selectedSetor,
      assentos: [...selectedSetor.assentos, assentoCompleto]
    };

    const localAtualizado = {
      ...selectedLocal,
      setores: selectedLocal.setores.map(s => s.id === selectedSetor.id ? setorAtualizado : s)
    };

    setLocais(locais.map(l => l.id === selectedLocal.id ? localAtualizado : l));
    setSelectedLocal(localAtualizado);
    setSelectedSetor(setorAtualizado);
    
    toast({
      title: "Sucesso",
      description: "Assento adicionado com sucesso!",
    });

    setIsAssentoDialogOpen(false);
    setNovoAssento({ disponivel: true, x: 0, y: 0 });
  };

  const handleSaveAssentosLote = () => {
    if (!assentosLote.letra || !selectedSetor || !selectedLocal) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (assentosLote.numeroInicio > assentosLote.numeroFim) {
      toast({
        title: "Erro",
        description: "O número inicial deve ser menor que o número final",
        variant: "destructive",
      });
      return;
    }

    const novosAssentos: Assento[] = [];
    for (let i = assentosLote.numeroInicio; i <= assentosLote.numeroFim; i++) {
      const assentoId = `${selectedSetor.id}-${assentosLote.letra}${i.toString().padStart(2, '0')}`;
      
      // Verifica se já existe um assento com essa identificação
      const existeAssento = selectedSetor.assentos.some(
        assento => assento.letra === assentosLote.letra && assento.numero === i.toString().padStart(2, '0')
      );

      if (!existeAssento) {
        const posicaoX = assentosLote.inicioX + ((i - assentosLote.numeroInicio) * assentosLote.espacamento);
        
        novosAssentos.push({
          id: assentoId,
          setor: selectedSetor.id,
          letra: assentosLote.letra,
          numero: i.toString().padStart(2, '0'),
          x: posicaoX,
          y: assentosLote.inicioY,
          disponivel: true
        });
      }
    }

    if (novosAssentos.length === 0) {
      toast({
        title: "Aviso",
        description: "Todos os assentos dessa fila já existem",
        variant: "destructive",
      });
      return;
    }

    const setorAtualizado = {
      ...selectedSetor,
      assentos: [...selectedSetor.assentos, ...novosAssentos]
    };

    const localAtualizado = {
      ...selectedLocal,
      setores: selectedLocal.setores.map(s => s.id === selectedSetor.id ? setorAtualizado : s)
    };

    setLocais(locais.map(l => l.id === selectedLocal.id ? localAtualizado : l));
    setSelectedLocal(localAtualizado);
    setSelectedSetor(setorAtualizado);
    
    toast({
      title: "Sucesso",
      description: `${novosAssentos.length} assentos adicionados com sucesso!`,
    });

    setIsAssentoLoteDialogOpen(false);
    setAssentosLote({
      letra: "",
      numeroInicio: 1,
      numeroFim: 10,
      espacamento: 50,
      inicioX: 50,
      inicioY: 50
    });
  };

  const handleEditLocal = (local: Local) => {
    setEditingLocal(local);
    setNovoLocal(local);
    setIsDialogOpen(true);
  };

  const handleDeleteLocal = (id: string) => {
    setLocais(locais.filter(l => l.id !== id));
    toast({
      title: "Sucesso",
      description: "Local removido com sucesso!",
    });
  };

  const handleAssentoUpdate = (assentosAtualizados: Assento[]) => {
    if (!selectedLocal || !selectedSetorMapa) return;

    const setorAtualizado = {
      ...selectedSetorMapa,
      assentos: assentosAtualizados
    };

    const localAtualizado = {
      ...selectedLocal,
      setores: selectedLocal.setores.map(s => s.id === selectedSetorMapa.id ? setorAtualizado : s)
    };

    setLocais(locais.map(l => l.id === selectedLocal.id ? localAtualizado : l));
    setSelectedLocal(localAtualizado);
    setSelectedSetorMapa(setorAtualizado);
    
    toast({
      title: "Sucesso",
      description: "Posições dos assentos atualizadas!",
    });
  };

  const handleViewLocal = (local: Local) => {
    setSelectedLocal(local);
    setSelectedSetorMapa(null);
    setIsMapaDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Locais</h1>
          <p className="text-muted-foreground">Gestão de locais de eventos e mapas de assentos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingLocal(null);
              setNovoLocal({ setores: [] });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Local
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLocal ? "Editar Local" : "Novo Local"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nome">Nome do Local *</Label>
                <Input
                  id="nome"
                  value={novoLocal.nome || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, nome: e.target.value })}
                  placeholder="Teatro Municipal"
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={novoLocal.cep || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, cep: e.target.value })}
                  placeholder="00000-000"
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={novoLocal.endereco || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, endereco: e.target.value })}
                  placeholder="Rua das Artes"
                />
              </div>

              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={novoLocal.numero || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, numero: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={novoLocal.bairro || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, bairro: e.target.value })}
                  placeholder="Centro"
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={novoLocal.cidade || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, cidade: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={novoLocal.estado || ""}
                  onChange={(e) => setNovoLocal({ ...novoLocal, estado: e.target.value })}
                  placeholder="SP"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLocal}>
                {editingLocal ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Locais */}
      <Card>
        <CardHeader>
          <CardTitle>Locais Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade/Estado</TableHead>
                <TableHead>Setores</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocais.map((local) => (
                <TableRow key={local.id}>
                  <TableCell className="font-medium">{local.nome}</TableCell>
                  <TableCell>
                    {local.endereco}, {local.numero}
                    {local.bairro && ` - ${local.bairro}`}
                  </TableCell>
                  <TableCell>{local.cidade}/{local.estado}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {local.setores.length} setor(es)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLocal(local)}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLocal(local)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLocal(local.id)}
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

      {/* Dialog de Mapa de Assentos */}
      <Dialog open={isMapaDialogOpen} onOpenChange={setIsMapaDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Mapa de Assentos - {selectedLocal?.nome}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLocal && (
            <Tabs defaultValue="setores">
              <TabsList>
                <TabsTrigger value="setores">Setores</TabsTrigger>
                <TabsTrigger value="assentos">Assentos</TabsTrigger>
                <TabsTrigger value="mapa">Mapa</TabsTrigger>
              </TabsList>
              
              <TabsContent value="setores" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Setores</h3>
                  <Dialog open={isSetorDialogOpen} onOpenChange={setIsSetorDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Setor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Setor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nomeSetor">Nome do Setor</Label>
                          <Input
                            id="nomeSetor"
                            value={novoSetor.nome || ""}
                            onChange={(e) => setNovoSetor({ ...novoSetor, nome: e.target.value })}
                            placeholder="Plateia"
                          />
                        </div>
                        <div>
                          <Label htmlFor="corSetor">Cor</Label>
                          <Input
                            id="corSetor"
                            type="color"
                            value={novoSetor.cor}
                            onChange={(e) => setNovoSetor({ ...novoSetor, cor: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsSetorDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveSetor}>Salvar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedLocal.setores.map((setor) => (
                    <Card key={setor.id} className="cursor-pointer" onClick={() => setSelectedSetor(setor)}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: setor.cor }}
                          />
                          <div>
                            <div className="font-medium">{setor.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {setor.assentos.length} assentos
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="assentos" className="space-y-4">
                {selectedSetor ? (
                  <>
                     <div className="flex justify-between items-center">
                       <h3 className="text-lg font-medium">
                         Assentos - {selectedSetor.nome}
                       </h3>
                       <div className="flex space-x-2">
                         <Dialog open={isAssentoLoteDialogOpen} onOpenChange={setIsAssentoLoteDialogOpen}>
                           <DialogTrigger asChild>
                             <Button size="sm" variant="outline">
                               <Plus className="h-4 w-4 mr-2" />
                               Cadastrar Fila
                             </Button>
                           </DialogTrigger>
                           <DialogContent>
                             <DialogHeader>
                               <DialogTitle>Cadastrar Fila de Assentos</DialogTitle>
                             </DialogHeader>
                             <div className="space-y-4">
                               <div className="grid grid-cols-3 gap-4">
                                 <div>
                                   <Label htmlFor="letraFila">Letra da Fila *</Label>
                                   <Input
                                     id="letraFila"
                                     value={assentosLote.letra}
                                     onChange={(e) => setAssentosLote({ ...assentosLote, letra: e.target.value.toUpperCase() })}
                                     placeholder="A, AA, ZA..."
                                     maxLength={3}
                                   />
                                   <p className="text-xs text-muted-foreground mt-1">
                                     Pode usar 1 a 3 letras (A, AA, ZA, etc.)
                                   </p>
                                 </div>
                                 <div>
                                   <Label htmlFor="numeroInicio">Do Número *</Label>
                                   <Input
                                     id="numeroInicio"
                                     type="number"
                                     min="1"
                                     value={assentosLote.numeroInicio}
                                     onChange={(e) => setAssentosLote({ ...assentosLote, numeroInicio: parseInt(e.target.value) || 1 })}
                                   />
                                 </div>
                                 <div>
                                   <Label htmlFor="numeroFim">Até o Número *</Label>
                                   <Input
                                     id="numeroFim"
                                     type="number"
                                     min="1"
                                     value={assentosLote.numeroFim}
                                     onChange={(e) => setAssentosLote({ ...assentosLote, numeroFim: parseInt(e.target.value) || 10 })}
                                   />
                                 </div>
                               </div>
                               
                               <div className="grid grid-cols-3 gap-4">
                                 <div>
                                   <Label htmlFor="espacamento">Espaçamento</Label>
                                   <Input
                                     id="espacamento"
                                     type="number"
                                     value={assentosLote.espacamento}
                                     onChange={(e) => setAssentosLote({ ...assentosLote, espacamento: parseInt(e.target.value) || 50 })}
                                     placeholder="50"
                                   />
                                 </div>
                                 <div>
                                   <Label htmlFor="inicioX">Posição X Inicial</Label>
                                   <Input
                                     id="inicioX"
                                     type="number"
                                     value={assentosLote.inicioX}
                                     onChange={(e) => setAssentosLote({ ...assentosLote, inicioX: parseInt(e.target.value) || 50 })}
                                   />
                                 </div>
                                 <div>
                                   <Label htmlFor="inicioY">Posição Y</Label>
                                   <Input
                                     id="inicioY"
                                     type="number"
                                     value={assentosLote.inicioY}
                                     onChange={(e) => setAssentosLote({ ...assentosLote, inicioY: parseInt(e.target.value) || 50 })}
                                   />
                                 </div>
                               </div>
                               
                               <div className="p-3 bg-muted rounded-lg">
                                 <p className="text-sm text-muted-foreground">
                                   <strong>Preview:</strong> Fila {assentosLote.letra} - 
                                   Assentos {assentosLote.letra}{assentosLote.numeroInicio.toString().padStart(2, '0')} 
                                   até {assentosLote.letra}{assentosLote.numeroFim.toString().padStart(2, '0')}
                                   {assentosLote.numeroFim >= assentosLote.numeroInicio && 
                                     ` (${assentosLote.numeroFim - assentosLote.numeroInicio + 1} assentos)`
                                   }
                                 </p>
                               </div>
                             </div>
                             <div className="flex justify-end space-x-2">
                               <Button variant="outline" onClick={() => setIsAssentoLoteDialogOpen(false)}>
                                 Cancelar
                               </Button>
                               <Button onClick={handleSaveAssentosLote}>Criar Fila</Button>
                             </div>
                           </DialogContent>
                         </Dialog>
                         
                         <Dialog open={isAssentoDialogOpen} onOpenChange={setIsAssentoDialogOpen}>
                           <DialogTrigger asChild>
                             <Button size="sm">
                               <Plus className="h-4 w-4 mr-2" />
                               Assento Individual
                             </Button>
                           </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Novo Assento</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="letraAssento">Letra</Label>
                              <Input
                                id="letraAssento"
                                value={novoAssento.letra || ""}
                                onChange={(e) => setNovoAssento({ ...novoAssento, letra: e.target.value })}
                                placeholder="A"
                              />
                            </div>
                            <div>
                              <Label htmlFor="numeroAssento">Número</Label>
                              <Input
                                id="numeroAssento"
                                value={novoAssento.numero || ""}
                                onChange={(e) => setNovoAssento({ ...novoAssento, numero: e.target.value })}
                                placeholder="01"
                              />
                            </div>
                            <div>
                              <Label htmlFor="xAssento">Posição X</Label>
                              <Input
                                id="xAssento"
                                type="number"
                                value={novoAssento.x}
                                onChange={(e) => setNovoAssento({ ...novoAssento, x: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="yAssento">Posição Y</Label>
                              <Input
                                id="yAssento"
                                type="number"
                                value={novoAssento.y}
                                onChange={(e) => setNovoAssento({ ...novoAssento, y: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAssentoDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveAssento}>Salvar</Button>
                          </div>
                           </DialogContent>
                         </Dialog>
                       </div>
                     </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assento</TableHead>
                          <TableHead>Posição</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSetor.assentos.map((assento) => (
                          <TableRow key={assento.id}>
                            <TableCell>{assento.letra}{assento.numero}</TableCell>
                            <TableCell>X: {assento.x}, Y: {assento.y}</TableCell>
                            <TableCell>
                              <Badge variant={assento.disponivel ? "default" : "secondary"}>
                                {assento.disponivel ? "Disponível" : "Ocupado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Selecione um setor para visualizar os assentos
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="mapa">
                {selectedLocal && (
                  <MapaAssentos
                    local={selectedLocal}
                    setorSelecionado={selectedSetorMapa}
                    onSetorSelect={setSelectedSetorMapa}
                    onAssentoUpdate={handleAssentoUpdate}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}