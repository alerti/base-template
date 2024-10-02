import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Modal Component for Confirmations
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative flex flex-col items-center group">
    {children}
    <span className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded py-1 px-2 pointer-events-none">
      {text}
    </span>
  </div>
);

// Pixel Component with Animation
const Pixel = React.memo(({ color, onClick, onMouseDown, onMouseEnter, isDragging }) => (
  <div
    className={`w-6 h-6 sm:w-8 sm:h-8 border cursor-pointer transition-transform duration-150 ${
      isDragging ? "transform scale-110" : ""
    }`}
    style={{ backgroundColor: color }}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseEnter={onMouseEnter}
  />
));

// PixelGrid Component with Drag to Paint
const PixelGrid = ({ gridSize, pixels, onPixelClick, onMouseDown, onMouseEnter, isDragging, previewMode }) => {
  return (
    <div
      className={`grid gap-0.5 ${
        previewMode ? "border-none" : "border"
      }`}
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {pixels.map((pixelColor, index) => (
        <Pixel
          key={index}
          color={pixelColor}
          onClick={() => onPixelClick(index)}
          onMouseDown={() => onMouseDown(index)}
          onMouseEnter={() => onMouseEnter(index)}
          isDragging={isDragging}
        />
      ))}
    </div>
  );
};

// Gallery Component with Fade-in/Fade-out
const Gallery = ({ gallery, gridSize, deleteFromGallery, viewArt }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {gallery.map((art, index) => (
        <div key={index} className="border p-2 bg-white dark:bg-gray-700 rounded shadow animate-fadeIn">
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {art.pixels.map((pixelColor, pixelIndex) => (
              <div
                key={pixelIndex}
                className="w-4 h-4 sm:w-6 sm:h-6 border transition-transform duration-150 hover:scale-110"
                style={{ backgroundColor: pixelColor }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => viewArt(index)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
            >
              View
            </button>
            <button
              onClick={() => deleteFromGallery(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [gridSize, setGridSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [pixels, setPixels] = useState(Array(gridSize * gridSize).fill("#ffffff"));
  const [gallery, setGallery] = useState([]);
  const [history, setHistory] = useState([pixels]);
  const [historyStep, setHistoryStep] = useState(0);
  const [multiColorMode, setMultiColorMode] = useState(false);
  const [selectedColors, setSelectedColors] = useState([color]);
  const [previewMode, setPreviewMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const fileInputRef = useRef(null);
  
  // Update grid size and reset pixels
  const updateGridSize = (size) => {
    if (size >= 4 && size <= 64) {
      setGridSize(size);
      const newPixels = Array(size * size).fill("#ffffff");
      setPixels(newPixels);
      setHistory([newPixels]);
      setHistoryStep(0);
    }
  };
  
  // Handle pixel coloring with drag support
  const handlePixelClick = (index) => {
    const newPixels = [...pixels];
    const newColor = multiColorMode
      ? selectedColors[historyStep % selectedColors.length]
      : color;
    newPixels[index] = newColor;
    setPixels(newPixels);
    const newHistory = [...history.slice(0, historyStep + 1), newPixels];
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };
  
  const handleMouseDown = (index) => {
    setIsDragging(true);
    handlePixelClick(index);
  };
  
  const handleMouseEnter = (index) => {
    if (isDragging) {
      handlePixelClick(index);
    }
  };
  
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  // Randomize grid with animation
  const randomizeGrid = () => {
    const newPixels = pixels.map(
      () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    );
    setPixels(newPixels);
    const newHistory = [...history.slice(0, historyStep + 1), newPixels];
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };
  
  // Clear the grid with confirmation modal
  const clearGrid = () => {
    setModal({
      isOpen: true,
      title: "Clear Grid",
      message: "Are you sure you want to clear the grid?",
      onConfirm: () => {
        const clearedPixels = Array(gridSize * gridSize).fill("#ffffff");
        setPixels(clearedPixels);
        const newHistory = [...history.slice(0, historyStep + 1), clearedPixels];
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
        setModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };
  
  // Save to gallery with name prompt
  const saveToGallery = () => {
    const name = prompt("Enter a name for your pixel art:");
    if (name) {
      setGallery([...gallery, { name, pixels }]);
    }
  };
  
  // Delete from gallery with confirmation
  const deleteFromGallery = (index) => {
    setModal({
      isOpen: true,
      title: "Delete Art",
      message: "Are you sure you want to delete this art?",
      onConfirm: () => {
        const newGallery = gallery.filter((_, i) => i !== index);
        setGallery(newGallery);
        setModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };
  
  // View art in full screen
  const viewArt = (index) => {
    const art = gallery[index];
    alert(`Viewing: ${art.name}\n\nPixel Data: ${JSON.stringify(art.pixels)}`);
    // For a real application, you might implement a modal to display the art.
  };
  
  // Undo and Redo functionality
  const undo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setPixels(history[prevStep]);
      setHistoryStep(prevStep);
    }
  };
  
  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setPixels(history[nextStep]);
      setHistoryStep(nextStep);
    }
  };
  
  // Export and Import art data
  const exportArtData = () => {
    const dataStr = JSON.stringify(pixels);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "pixel-art.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const importArtData = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const importedPixels = JSON.parse(event.target.result);
        if (Array.isArray(importedPixels) && importedPixels.length === gridSize * gridSize) {
          setPixels(importedPixels);
          const newHistory = [...history.slice(0, historyStep + 1), importedPixels];
          setHistory(newHistory);
          setHistoryStep(newHistory.length - 1);
        } else {
          alert("Invalid file format.");
        }
      } catch (error) {
        alert("Error reading file.");
      }
    };
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0]);
    }
  };
  
  // Toggle multi-color mode
  const toggleMultiColorMode = () => {
    setMultiColorMode(!multiColorMode);
  };
  
  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  // Zoom In and Out
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };
  
  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };
  
  // Toggle Dark Mode
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-2 sm:p-4 transition-colors duration-300">
      {/* Confirmation Modal */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ isOpen: false, title: "", message: "", onConfirm: null })}
      />
      
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      
      {/* Main Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl">Pixel Drawing App</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            {/* Grid Size */}
            <div className="flex items-center space-x-2">
              <label htmlFor="gridSize" className="font-medium text-gray-700 dark:text-gray-200">
                Grid Size:
              </label>
              <input
                id="gridSize"
                type="number"
                value={gridSize}
                onChange={(e) => updateGridSize(Number(e.target.value))}
                className="border rounded p-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                min="4"
                max="64"
              />
            </div>
            
            {/* Color Picker */}
            <div className="flex items-center space-x-2">
              <label htmlFor="colorPicker" className="font-medium text-gray-700 dark:text-gray-200">
                Pick Color:
              </label>
              <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border rounded p-1 w-12 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            
            {/* Multi-color Mode */}
            <Tooltip text="Toggle Multi-color Mode">
              <button
                onClick={toggleMultiColorMode}
                className={`px-3 py-1 rounded text-white ${
                  multiColorMode ? "bg-gray-500 hover:bg-gray-600" : "bg-purple-500 hover:bg-purple-600"
                } transition transform hover:scale-105`}
              >
                {multiColorMode ? "Disable Multi-color" : "Enable Multi-color"}
              </button>
            </Tooltip>
          </div>
          
          {/* Pixel Grid */}
          <div
            className={`flex justify-center mb-4 transition-transform duration-300`}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <PixelGrid
              gridSize={gridSize}
              pixels={pixels}
              onPixelClick={handlePixelClick}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              isDragging={isDragging}
              previewMode={previewMode}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            <Tooltip text="Undo your last action">
              <button
                onClick={undo}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition disabled:bg-gray-300"
                disabled={historyStep === 0}
              >
                Undo
              </button>
            </Tooltip>
            <Tooltip text="Redo your last undone action">
              <button
                onClick={redo}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition disabled:bg-gray-300"
                disabled={historyStep === history.length - 1}
              >
                Redo
              </button>
            </Tooltip>
            <Tooltip text="Fill the grid with random colors">
              <button
                onClick={randomizeGrid}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Randomize
              </button>
            </Tooltip>
            <Tooltip text="Clear the entire grid">
              <button
                onClick={clearGrid}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Clear
              </button>
            </Tooltip>
            <Tooltip text="Save your current pixel art to the gallery">
              <button
                onClick={saveToGallery}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                Save to Gallery
              </button>
            </Tooltip>
            <Tooltip text="Export your pixel art as JSON">
              <button
                onClick={exportArtData}
                className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition"
              >
                Export JSON
              </button>
            </Tooltip>
            <Tooltip text="Import pixel art from a JSON file">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Import JSON
              </button>
            </Tooltip>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={importArtData}
              className="hidden"
            />
            <Tooltip text="Toggle preview mode to see your art without grid lines">
              <button
                onClick={togglePreviewMode}
                className={`px-3 py-1 rounded text-white ${
                  previewMode ? "bg-indigo-500 hover:bg-indigo-600" : "bg-purple-500 hover:bg-purple-600"
                } transition`}
              >
                {previewMode ? "Exit Preview" : "Preview Mode"}
              </button>
            </Tooltip>
            <Tooltip text="Zoom in for a closer look">
              <button
                onClick={zoomIn}
                className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
              >
                Zoom In
              </button>
            </Tooltip>
            <Tooltip text="Zoom out for a broader view">
              <button
                onClick={zoomOut}
                className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
              >
                Zoom Out
              </button>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
      
      {/* Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {gallery.length === 0 ? (
            <p className="text-center text-gray-700 dark:text-gray-300">No art saved yet.</p>
          ) : (
            <Gallery
              gallery={gallery}
              gridSize={gridSize}
              deleteFromGallery={deleteFromGallery}
              viewArt={viewArt}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
