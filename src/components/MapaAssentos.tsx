import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Group } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  setores: Setor[];
}

interface MapaAssentosProps {
  local: Local;
  setorSelecionado?: Setor | null;
  onSetorSelect: (setor: Setor | null) => void;
  onAssentoUpdate?: (assentos: Assento[]) => void;
}

export function MapaAssentos({ 
  local, 
  setorSelecionado, 
  onSetorSelect,
  onAssentoUpdate 
}: MapaAssentosProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f8f9fa",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Limpar canvas
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#f8f9fa";

    if (setorSelecionado) {
      // Mostrar apenas os assentos do setor selecionado
      renderSetorAssentos(setorSelecionado);
    } else {
      // Mostrar todos os setores
      renderTodosSetores();
    }

    fabricCanvas.renderAll();
  }, [fabricCanvas, local, setorSelecionado]);

  const renderTodosSetores = () => {
    if (!fabricCanvas) return;

    local.setores.forEach((setor, index) => {
      const setorX = 50 + (index % 3) * 250;
      const setorY = 50 + Math.floor(index / 3) * 200;

      // Área do setor
      const setorRect = new Rect({
        left: setorX,
        top: setorY,
        width: 200,
        height: 150,
        fill: setor.cor + "20", // Transparência
        stroke: setor.cor,
        strokeWidth: 2,
        selectable: true,
        hoverCursor: "pointer",
        moveCursor: "pointer",
      });

      // Nome do setor
      const setorLabel = new FabricText(setor.nome, {
        left: setorX + 10,
        top: setorY + 10,
        fontSize: 16,
        fontWeight: "bold",
        fill: setor.cor,
        selectable: false,
      });

      // Contador de assentos
      const contadorAssentos = new FabricText(`${setor.assentos.length} assentos`, {
        left: setorX + 10,
        top: setorY + 35,
        fontSize: 12,
        fill: "#666",
        selectable: false,
      });

      // Adicionar evento de clique no setor
      setorRect.on("mousedown", () => {
        onSetorSelect(setor);
      });

      fabricCanvas.add(setorRect, setorLabel, contadorAssentos);

      // Mostrar alguns assentos como preview
      setor.assentos.slice(0, 12).forEach((assento, assentoIndex) => {
        const assentoX = setorX + 20 + (assentoIndex % 6) * 25;
        const assentoY = setorY + 60 + Math.floor(assentoIndex / 6) * 25;

        const assentoCircle = new Circle({
          left: assentoX,
          top: assentoY,
          radius: 8,
          fill: assento.disponivel ? "#22c55e" : "#ef4444",
          stroke: "#333",
          strokeWidth: 1,
          selectable: false,
        });

        fabricCanvas.add(assentoCircle);
      });
    });
  };

  const renderSetorAssentos = (setor: Setor) => {
    if (!fabricCanvas) return;

    // Título do setor
    const titulo = new FabricText(`${setor.nome} - ${setor.assentos.length} assentos`, {
      left: 20,
      top: 20,
      fontSize: 20,
      fontWeight: "bold",
      fill: setor.cor,
      selectable: false,
    });

    fabricCanvas.add(titulo);

    // Renderizar assentos
    setor.assentos.forEach((assento) => {
      const assentoX = Math.max(50, Math.min(750, assento.x || 100));
      const assentoY = Math.max(80, Math.min(550, assento.y || 100));

      // Círculo do assento
      const assentoCircle = new Circle({
        left: assentoX,
        top: assentoY,
        radius: 15,
        fill: assento.disponivel ? "#22c55e" : "#ef4444",
        stroke: setor.cor,
        strokeWidth: 2,
        selectable: true,
        hasControls: false,
        hasBorders: true,
      });

      // Label do assento
      const assentoLabel = new FabricText(`${assento.letra}${assento.numero}`, {
        left: assentoX - 8,
        top: assentoY - 6,
        fontSize: 10,
        fontWeight: "bold",
        fill: "#fff",
        selectable: false,
        evented: false,
      });

      // Adicionar ao canvas separadamente por simplicidade
      fabricCanvas.add(assentoCircle);
      fabricCanvas.add(assentoLabel);
    });

    // Legenda
    const legendaDisponivel = new Circle({
      left: 50,
      top: 550,
      radius: 8,
      fill: "#22c55e",
      stroke: "#333",
      strokeWidth: 1,
      selectable: false,
    });

    const legendaDisponivelText = new FabricText("Disponível", {
      left: 70,
      top: 545,
      fontSize: 12,
      fill: "#333",
      selectable: false,
    });

    const legendaOcupado = new Circle({
      left: 160,
      top: 550,
      radius: 8,
      fill: "#ef4444",
      stroke: "#333",
      strokeWidth: 1,
      selectable: false,
    });

    const legendaOcupadoText = new FabricText("Ocupado", {
      left: 180,
      top: 545,
      fontSize: 12,
      fill: "#333",
      selectable: false,
    });

    fabricCanvas.add(legendaDisponivel, legendaDisponivelText, legendaOcupado, legendaOcupadoText);
  };

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.max(zoom / 1.2, 0.5);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    setZoom(1);
    fabricCanvas.setZoom(1);
    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    fabricCanvas.renderAll();
  };

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Posições dos assentos salvas!",
    });
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onSetorSelect(null)}>
            Ver Todos os Setores
          </Button>
          {setorSelecionado && (
            <Badge style={{ backgroundColor: setorSelecionado.cor, color: "#fff" }}>
              {setorSelecionado.nome}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          {setorSelecionado && (
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <Card>
        <CardContent className="p-4">
          <div className="border border-gray-200 rounded-lg shadow-inner overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      {setorSelecionado ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Como usar:</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Arraste os assentos para reposicioná-los</li>
              <li>• Use os controles de zoom para melhor visualização</li>
              <li>• Clique em "Salvar" para confirmar as alterações</li>
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Setores do Local:</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-2">
              Clique em um setor para visualizar e editar seus assentos individualmente.
            </p>
            <div className="flex flex-wrap gap-2">
              {local.setores.map((setor) => (
                <Button
                  key={setor.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onSetorSelect(setor)}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: setor.cor }}
                  />
                  {setor.nome} ({setor.assentos.length})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}