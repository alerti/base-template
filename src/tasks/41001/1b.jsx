import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

function App() {
  return <DrawingPad />;
}

function DrawingPad() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState('draw');
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      setCtx(context);
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, []);
  
  const startDrawing = (e) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };
  
  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    ctx.strokeStyle = mode === 'draw' ? brushColor : bgColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    setHistory([...history.slice(0, historyIndex + 1), {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      mode
    }]);
    setHistoryIndex(prev => prev + 1);
  };
  
  const endDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };
  
  const undo = () => {
    if (historyIndex > -1) {
      setHistoryIndex(prev => prev - 1);
      redrawCanvas();
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      redrawCanvas();
    }
  };
  
  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setHistory([]);
      setHistoryIndex(-1);
    }
  };
  
  const saveCanvas = () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };
  
  const redrawCanvas = () => {
    clearCanvas();
    history.slice(0, historyIndex + 1).forEach(point => {
      ctx.strokeStyle = point.color;
      ctx.lineWidth = point.size;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
  };
  
  const toggleGrid = () => setShowGrid(!showGrid);
  
  return (
    <div className="flex flex-col items-center p-4">
      <canvas
        ref={canvasRef}
        width={window.innerWidth < 640 ? "90%" : "600"}
        height="400"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{ border: '1px solid black', background: bgColor }}
        className="rounded-md"
      />
      <div className="mt-4 space-y-2">
        <ColorPicker color={brushColor} onChange={setBrushColor} label="Brush Color"/>
        <Select onValueChange={setBrushSize}>
          <SelectTrigger><SelectValue placeholder="Brush Size"/></SelectTrigger>
          {[2, 5, 10, 15, 20].map(size => <SelectItem key={size} value={size.toString()}>{size}</SelectItem>)}
        </Select>
        <Button onClick={() => setMode(mode === 'draw' ? 'erase' : 'draw')}>
          Switch to {mode === 'draw' ? 'Erase' : 'Draw'}
        </Button>
        <ColorPicker color={bgColor} onChange={setBgColor} label="Background Color"/>
        <Button onClick={toggleGrid}>Toggle Grid</Button>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={clearCanvas}>Clear Canvas</Button>
        <Button onClick={saveCanvas}>Save Drawing</Button>
      </div>
      {showGrid && <div className="grid-overlay" style={{ width: '600px', height: '400px', pointerEvents: 'none' }} />}
    </div>
  );
}

function ColorPicker({ color, onChange, label }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="color" value={color} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default App;