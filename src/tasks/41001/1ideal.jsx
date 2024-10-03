// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Notification Component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  
  if (!message) return null;
  
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow animate-fadeIn`}>
      {message}
    </div>
  );
}

export default function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushMode, setBrushMode] = useState("draw"); // 'draw' or 'erase'
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [showGrid, setShowGrid] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth < 640 ? window.innerWidth * 0.9 : 600;
    canvas.height = 400;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = brushMode === "draw" ? brushColor : "#FFFFFF";
    ctx.lineWidth = brushMode === "draw" ? brushSize : brushSize * 2;
    ctxRef.current = ctx;
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) drawGrid(ctx, canvas.width, canvas.height);
    
    // Save initial state
    saveHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, showGrid]);
  
  // Update Brush Settings
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = brushMode === "draw" ? brushColor : "#FFFFFF";
      ctxRef.current.lineWidth = brushMode === "draw" ? brushSize : brushSize * 2;
    }
  }, [brushColor, brushSize, brushMode]);
  
  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const imgData = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth < 640 ? window.innerWidth * 0.9 : 600;
      canvas.height = 400;
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
      ctxRef.current.putImageData(imgData, 0, 0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Draw Grid
  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  // Start Drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  
  // Finish Drawing
  const finishDrawing = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveHistory();
  };
  
  // Draw on Canvas
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  
  // Save Canvas State to History
  const saveHistory = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL();
    setHistory((prev) => [...prev, imgData]);
    setRedoHistory([]);
  };
  
  // Undo Action
  const undo = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const lastState = newHistory.pop();
    setHistory(newHistory);
    setRedoHistory((prev) => [...prev, lastState]);
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.src = newHistory[newHistory.length - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      if (showGrid) drawGrid(ctx, canvas.width, canvas.height);
    };
  };
  
  // Redo Action
  const redo = () => {
    if (redoHistory.length === 0) return;
    const newRedoHistory = [...redoHistory];
    const restoredState = newRedoHistory.pop();
    setRedoHistory(newRedoHistory);
    setHistory((prev) => [...prev, restoredState]);
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.src = restoredState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      if (showGrid) drawGrid(ctx, canvas.width, canvas.height);
    };
  };
  
  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = backgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (showGrid) drawGrid(ctx, canvas.width, canvas.height);
    saveHistory();
    setNotification({ message: "Canvas cleared!", type: "success" });
  };
  
  // Save Drawing as Image
  const saveImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    link.click();
    setNotification({ message: "Image saved!", type: "success" });
  };
  
  // Toggle Grid
  const toggleGrid = () => {
    setShowGrid((prev) => !prev);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    } else {
      // Redraw without grid
      const img = new Image();
      img.src = history[history.length - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };
  
  // Handle Touch Events for Mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  
  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  
  const handleTouchEnd = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveHistory();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <Card className="w-full max-w-3xl bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Drawing Pad</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Toolbar */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            {/* Brush Color Picker */}
            <div className="flex items-center mb-4 sm:mb-0">
              <Label htmlFor="brushColor" className="mr-2">
                Brush Color:
              </Label>
              <Input
                type="color"
                id="brushColor"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-12 h-12 p-0 border-none"
              />
            </div>
            {/* Brush Size Selector */}
            <div className="flex items-center mb-4 sm:mb-0">
              <Label htmlFor="brushSize" className="mr-2">
                Brush Size:
              </Label>
              <Select
                value={brushSize.toString()}
                onValueChange={(value) => setBrushSize(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder={brushSize} />
                </SelectTrigger>
                <SelectContent>
                  {[2, 5, 10, 15, 20].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Brush Mode Selector */}
            <div className="flex items-center mb-4 sm:mb-0">
              <Label htmlFor="brushMode" className="mr-2">
                Mode:
              </Label>
              <Select
                value={brushMode}
                onValueChange={(value) => setBrushMode(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder={brushMode} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draw">Draw</SelectItem>
                  <SelectItem value="erase">Erase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Background Color Picker */}
            <div className="flex items-center mb-4 sm:mb-0">
              <Label htmlFor="backgroundColor" className="mr-2">
                Background:
              </Label>
              <Input
                type="color"
                id="backgroundColor"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-12 p-0 border-none"
              />
            </div>
            {/* Grid Toggle */}
            <Button onClick={toggleGrid} variant={showGrid ? "secondary" : "default"} className="mb-4 sm:mb-0">
              {showGrid ? "Hide Grid" : "Show Grid"}
            </Button>
          </div>
          {/* Canvas */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={finishDrawing}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full cursor-crosshair"
            />
          </div>
          {/* Toolbar Actions */}
          <div className="mt-4 flex flex-wrap justify-center space-x-2">
            <Button onClick={undo} disabled={history.length <= 1} className="flex items-center">
              Undo
            </Button>
            <Button onClick={redo} disabled={redoHistory.length === 0} className="flex items-center">
              Redo
            </Button>
            <Button onClick={clearCanvas} variant="destructive" className="flex items-center">
              Clear
            </Button>
            <Button onClick={saveImage} className="flex items-center">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Notifications */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}
