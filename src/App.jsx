import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Utility functions for randomization
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
const fonts = ["Arial", "Helvetica", "Courier New", "Times New Roman", "Verdana", "Georgia"];

// Helper function to extract up to 5 random letters from a sentence or long name
const getRandomLetters = (text) => {
  const words = text.split(" ");
  const allLetters = words.map((word) => word[0]).join(""); // Collect first letter of each word
  const letters = allLetters.length > 5 ? allLetters.slice(0, 5) : allLetters;
  
  // Randomly shuffle letters
  return letters
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// Generate a random, aesthetically-pleasing icon
const generateIcon = (text, size) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  
  // Randomize icon characteristics
  const letters = getRandomLetters(text);
  const bgColor = getRandomColor(); // Random background color
  const textColor = getRandomColor(); // Random text color
  const font = fonts[Math.floor(Math.random() * fonts.length)]; // Random font
  const shape = Math.random() > 0.5 ? "circle" : "rectangle"; // Randomly choose shape
  
  // Draw background based on chosen shape
  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = bgColor;
    ctx.fill();
  } else {
    // Draw rectangle
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
  }
  
  // Set text style dynamically based on length
  const fontSize = size / Math.max(letters.length, 2) * 1.5;
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Draw the text in the center of the icon
  ctx.fillText(letters, size / 2, size / 2);
  
  return canvas.toDataURL(); // Return the image data URL
};

export default function IconGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(64); // Default icon size
  const [iconCount, setIconCount] = useState(3); // Number of icons to generate
  const [generatedIcons, setGeneratedIcons] = useState([]);
  
  // Generate icons based on user input
  const generateIcons = () => {
    const newIcons = [];
    for (let i = 0; i < iconCount; i++) {
      newIcons.push(generateIcon(text, size));
    }
    setGeneratedIcons(newIcons);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      {/* Main Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl"> Icon Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form for user input */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            {/* Input text for the icon */}
            <div className="flex flex-col">
              <label htmlFor="iconText" className="font-medium text-gray-700 dark:text-gray-200">
                Enter Text for Icon:
              </label>
              <input
                id="iconText"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border rounded p-2 w-full sm:w-64"
                placeholder="Enter a name or sentence"
              />
            </div>
            
            {/* Icon size */}
            <div className="flex flex-col">
              <label htmlFor="iconSize" className="font-medium text-gray-700 dark:text-gray-200">
                Select Icon Size:
              </label>
              <select
                id="iconSize"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="border rounded p-2 w-full sm:w-48"
              >
                <option value={32}>32x32</option>
                <option value={64}>64x64</option>
                <option value={128}>128x128</option>
              </select>
            </div>
            
            {/* Number of icons */}
            <div className="flex flex-col">
              <label htmlFor="iconCount" className="font-medium text-gray-700 dark:text-gray-200">
                Number of Icons:
              </label>
              <input
                id="iconCount"
                type="number"
                value={iconCount}
                onChange={(e) => setIconCount(Number(e.target.value))}
                min={1}
                max={10}
                className="border rounded p-2 w-full sm:w-32"
              />
            </div>
          </div>
          
          {/* Generate button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={generateIcons}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Generate Icons
            </button>
          </div>
          
          {/* Display generated icons */}
          {generatedIcons.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              {generatedIcons.map((iconData, index) => (
                <div key={index} className="border rounded shadow p-2 text-center">
                  <img src={iconData} alt={`Generated Icon ${index + 1}`} className="mx-auto" />
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.download = `icon-${index + 1}.png`;
                      link.href = iconData;
                      link.click();
                    }}
                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Download Icon
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
