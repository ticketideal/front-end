import { useState, useRef } from "react";
import { 
  Plus, 
  Search, 
  Building, 
  User,
  Phone,
  Mail,
  MapPin,
  Upload,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Produtor {
  id: string;
  tipo: "pf" | "pj";
  nome: string;
  razaoSocial?: string;
  documento: string; // CPF ou CNPJ
  telefone: string;
  email: string;
  senha: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  logomarca?: string;
  logomarcaUrl?: string;
}

export default function Produtores() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [produtores, setProdutores] = useState<Produtor[]>([
    {
      id: "1",
      tipo: "pj",
      nome: "Producer ABC Ltda",
      razaoSocial: "Producer ABC Eventos e Entretenimento Ltda",
      documento: "12.345.678/0001-90",
      telefone: "(11) 99999-9999",
      email: "contato@producerabc.com",
      senha: "senha123",
      cep: "01234-567",
      endereco: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProdutor, setEditingProdutor] = useState<Produtor | null>(null);

  const [novoProdutor, setNovoProdutor] = useState<Partial<Produtor>>({
    tipo: "pj"
  });

  const filteredProdutores = produtores.filter(produtor => 
    produtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produtor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produtor.documento.includes(searchTerm)
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar formato
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        toast({
          title: "Erro",
          description: "Apenas arquivos JPG são aceitos para a logomarca",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho (simulação - em produção validaria as dimensões)
      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setNovoProdutor({ 
          ...novoProdutor, 
          logomarca: file.name,
          logomarcaUrl: imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProdutor = () => {
    if (!novoProdutor.nome || !novoProdutor.documento || !novoProdutor.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const produtorCompleto: Produtor = {
      id: editingProdutor?.id || Date.now().toString(),
      tipo: novoProdutor.tipo as Produtor['tipo'] || "pj",
      nome: novoProdutor.nome!,
      razaoSocial: novoProdutor.razaoSocial,
      documento: novoProdutor.documento!,
      telefone: novoProdutor.telefone || "",
      email: novoProdutor.email!,
      senha: novoProdutor.senha || "",
      cep: novoProdutor.cep || "",
      endereco: novoProdutor.endereco || "",
      numero: novoProdutor.numero || "",
      complemento: novoProdutor.complemento,
      bairro: novoProdutor.bairro || "",
      cidade: novoProdutor.cidade || "",
      estado: novoProdutor.estado || "",
      logomarca: novoProdutor.logomarca,
      logomarcaUrl: novoProdutor.logomarcaUrl
    };

    if (editingProdutor) {
      setProdutores(produtores.map(p => p.id === editingProdutor.id ? produtorCompleto : p));
      toast({
        title: "Sucesso",
        description: "Produtor atualizado com sucesso!",
      });
    } else {
      setProdutores([...produtores, produtorCompleto]);
      toast({
        title: "Sucesso",
        description: "Produtor cadastrado com sucesso!",
      });
    }

    setIsDialogOpen(false);
    setEditingProdutor(null);
    setNovoProdutor({ tipo: "pj" });
  };

  const handleEditProdutor = (produtor: Produtor) => {
    setEditingProdutor(produtor);
    setNovoProdutor(produtor);
    setIsDialogOpen(true);
  };

  const handleDeleteProdutor = (id: string) => {
    setProdutores(produtores.filter(p => p.id !== id));
    toast({
      title: "Sucesso",
      description: "Produtor removido com sucesso!",
    });
  };

  const getTipoBadge = (tipo: Produtor['tipo']) => {
    return (
      <Badge variant={tipo === "pj" ? "default" : "secondary"}>
        {tipo === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produtores</h1>
          <p className="text-muted-foreground">Gestão de produtores de eventos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProdutor(null);
              setNovoProdutor({ tipo: "pj" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produtor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProdutor ? "Editar Produtor" : "Novo Produtor"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Pessoa *</Label>
                <Select value={novoProdutor.tipo} onValueChange={(value) => setNovoProdutor({ ...novoProdutor, tipo: value as Produtor['tipo'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                    <SelectItem value="pf">Pessoa Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={novoProdutor.nome || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, nome: e.target.value })}
                    placeholder="Nome do produtor"
                  />
                </div>

                {novoProdutor.tipo === "pj" && (
                  <div>
                    <Label htmlFor="razaoSocial">Razão Social</Label>
                    <Input
                      id="razaoSocial"
                      value={novoProdutor.razaoSocial || ""}
                      onChange={(e) => setNovoProdutor({ ...novoProdutor, razaoSocial: e.target.value })}
                      placeholder="Razão social da empresa"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="documento">
                    {novoProdutor.tipo === "pj" ? "CNPJ *" : "CPF *"}
                  </Label>
                  <Input
                    id="documento"
                    value={novoProdutor.documento || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, documento: e.target.value })}
                    placeholder={novoProdutor.tipo === "pj" ? "00.000.000/0000-00" : "000.000.000-00"}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={novoProdutor.telefone || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoProdutor.email || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={novoProdutor.senha || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, senha: e.target.value })}
                    placeholder="Digite a senha"
                  />
                </div>

                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={novoProdutor.cep || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, cep: e.target.value })}
                    placeholder="00000-000"
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={novoProdutor.endereco || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, endereco: e.target.value })}
                    placeholder="Rua, Avenida..."
                  />
                </div>

                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={novoProdutor.numero || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, numero: e.target.value })}
                    placeholder="123"
                  />
                </div>

                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={novoProdutor.complemento || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, complemento: e.target.value })}
                    placeholder="Apto, Sala..."
                  />
                </div>

                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={novoProdutor.bairro || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, bairro: e.target.value })}
                    placeholder="Centro"
                  />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={novoProdutor.cidade || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, cidade: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={novoProdutor.estado || ""}
                    onChange={(e) => setNovoProdutor({ ...novoProdutor, estado: e.target.value })}
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <Label>Logomarca</Label>
                <div className="mt-2 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <p>Orientação: Paisagem (horizontal)</p>
                    <p>Formato: JPG</p>
                    <p>Dimensão: 499x227px</p>
                    <p>Cor de Fundo: Branco #FFFFFF</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Imagem
                    </Button>
                    
                    {novoProdutor.logomarcaUrl && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={novoProdutor.logomarcaUrl}
                          alt="Logomarca"
                          className="h-16 w-auto border rounded"
                        />
                        <span className="text-sm text-muted-foreground">
                          {novoProdutor.logomarca}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProdutor}>
                {editingProdutor ? "Atualizar" : "Salvar"}
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
              placeholder="Buscar por nome, e-mail ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtores */}
      <Card>
        <CardHeader>
          <CardTitle>Produtores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produtor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutores.map((produtor) => (
                <TableRow key={produtor.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={produtor.logomarcaUrl} />
                        <AvatarFallback>
                          {produtor.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{produtor.nome}</div>
                        {produtor.razaoSocial && (
                          <div className="text-sm text-muted-foreground">
                            {produtor.razaoSocial}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTipoBadge(produtor.tipo)}</TableCell>
                  <TableCell className="font-mono">{produtor.documento}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {produtor.email}
                      </div>
                      {produtor.telefone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {produtor.telefone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {produtor.cidade}, {produtor.estado}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProdutor(produtor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProdutor(produtor.id)}
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
    </div>
  );
}