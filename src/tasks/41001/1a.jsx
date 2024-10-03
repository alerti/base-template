import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl mb-4">Drawing Pad</h1>
      <DrawingCanvas />
    </div>
  );
}

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState('draw');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    setBgColorOnCanvas();
  }, []);
  
  const setBgColorOnCanvas = () => {
    if (contextRef.current) {
      contextRef.current.fillStyle = bgColor;
      contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  
  const startDrawing = ({ nativeEvent }) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    saveState();
  };
  
  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
  };
  
  const draw = ({ nativeEvent }) => {
    if (!contextRef.current) return;
    if (mode === 'draw') {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (mode === 'erase') {
      contextRef.current.clearRect(nativeEvent.offsetX, nativeEvent.offsetY, brushSize, brushSize);
    }
  };
  
  const saveState = () => {
    const imgData = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imgData]);
    setHistoryIndex(prev => prev + 1);
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      const imgData = history[historyIndex - 1];
      contextRef.current.putImageData(imgData, 0, 0);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      const imgData = history[historyIndex + 1];
      contextRef.current.putImageData(imgData, 0, 0);
    }
  };
  
  const clearCanvas = () => {
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setBgColorOnCanvas();
      setNotification('Canvas cleared!');
      setTimeout(() => setNotification(null), 2000);
    }
  };
  
  const saveImage = () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    setNotification('Image saved!');
    setTimeout(() => setNotification(null), 2000);
  };
  
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };
  
  return (
    <div className="w-full max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Drawing Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controls
            color={color}
            setColor={setColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            mode={mode}
            setMode={setMode}
            bgColor={bgColor}
            setBgColor={setBgColor}
            toggleGrid={toggleGrid}
            undo={undo}
            redo={redo}
            clearCanvas={clearCanvas}
            saveImage={saveImage}
          />
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            style={{
              width: '90%',
              maxWidth: '600px',
              height: '400px',
              border: '1px solid #ccc',
              background: bgColor,
              backgroundImage: showGrid ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'0.5\' y=\'0.5\' width=\'19\' height=\'19\' stroke=\'rgba(0,0,0,0.1)\'/%3E%3C/svg%3E")' : 'none',
            }}
          />
        </CardContent>
      </Card>
      {notification && <div className="mt-4 text-green-600">{notification}</div>}
    </div>
  );
}

function Controls({
                    color, setColor, brushSize, setBrushSize, mode, setMode,
                    bgColor, setBgColor, toggleGrid, undo, redo, clearCanvas, saveImage
                  }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Size: {brushSize}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Brush Size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[2, 5, 10, 15, 20].map(size => (
            <DropdownMenuItem key={size} onClick={() => setBrushSize(size)}>{size}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={() => setMode(mode === 'draw' ? 'erase' : 'draw')}>
        {mode === 'draw' ? 'Erase' : 'Draw'}
      </Button>
      <Button onClick={toggleGrid}>Toggle Grid</Button>
      <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
      <Button onClick={clearCanvas}>Clear</Button>
      <Button onClick={saveImage}>Save</Button>
    </div>
  );
}