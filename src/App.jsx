import React, { useState, useRef } from 'react';
import { Button, Input, Select, SelectItem, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

const fonts = ['Arial', 'Helvetica', 'Courier New', 'Times New Roman', 'Verdana', 'Georgia'];

const sizes = {
  '32x32': 32,
  '64x64': 64,
  '128x128': 128,
};

function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function extractLetters(text, max = 5) {
  const words = text.split(/\s+/).filter(Boolean);
  let letters = words.map(word => word[0]).join('').toUpperCase();
  if (letters.length > max) {
    letters = Array.from({length: max}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  }
  return letters;
}

function Icon({ letters, size, shape }) {
  const canvasRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  const drawIcon = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const s = size;
    canvas.width = canvas.height = s;
    
    // Draw background
    ctx.fillStyle = generateRandomColor();
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(s/2, s/2, s/2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, s, s);
    }
    
    // Draw text
    ctx.fillStyle = generateRandomColor();
    ctx.font = `${Math.min(s * 0.6 / letters.length, s * 0.4)}px ${fonts[Math.floor(Math.random() * fonts.length)]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letters, s/2, s/2);
  };
  
  const handleDownload = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setDownloadUrl(dataUrl);
  };
  
  return (
    <div>
      <canvas ref={canvasRef} style={{display: 'none'}} onLoad={drawIcon}></canvas>
      <img src={downloadUrl || canvasRef.current.toDataURL("image/png")} alt="Generated Icon" className="mb-2"/>
      <Button onClick={handleDownload}>Download</Button>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState('');
  const [iconSize, setIconSize] = useState('64x64');
  const [iconCount, setIconCount] = useState(1);
  const [icons, setIcons] = useState([]);
  
  const generateIcons = () => {
    const newIcons = Array.from({length: iconCount}, () => ({
      letters: extractLetters(text),
      size: sizes[iconSize],
      shape: Math.random() > 0.5 ? 'circle' : 'rectangle',
    }));
    setIcons(newIcons);
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" />
          <Select value={iconSize} onValueChange={setIconSize}>
            {Object.keys(sizes).map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
          </Select>
          <Input type="number" value={iconCount} onChange={(e) => setIconCount(Math.max(1, Math.min(10, Number(e.target.value))))} />
          <Button onClick={generateIcons}>Generate Icons</Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {icons.map((icon, idx) => (
          <Card key={idx} className="flex flex-col items-center">
            <CardContent className="p-2">
              <Icon {...icon} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}