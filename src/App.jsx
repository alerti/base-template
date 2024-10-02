import React, { useState, useRef } from 'react';
import { Button, Input, Select, SelectItem, Label, Slider } from "@/components/ui";
import { cn } from "@/lib/utils";

// List of fonts for random selection
const fonts = ['Arial', 'Helvetica', 'Courier New', 'Times New Roman', 'Verdana', 'Georgia'];

// Function to get random element from array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Function to generate a random color
const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

// Function to extract up to 5 letters from text
const extractLetters = (text, max = 5) => {
  const words = text.split(' ').filter(word => word.length > 0);
  let letters = words.map(word => word[0]).join('').toUpperCase();
  if (letters.length > max) {
    letters = Array.from(letters).sort(() => 0.5 - Math.random()).slice(0, max).join('');
  }
  return letters;
};

// Component for drawing the icon
const IconCanvas = ({ size, text, bgColor, textColor, shape, font }) => {
  const canvasRef = useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const s = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, s, s);
    
    // Draw shape
    ctx.fillStyle = bgColor;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(s/2, s/2, s/2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, s, s);
    }
    
    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = `${s * 0.5}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, s/2, s/2);
    
  }, [size, text, bgColor, textColor, shape, font]);
  
  return <canvas ref={canvasRef} width={size} height={size} />;
};

function IconGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState('64x64');
  const [count, setCount] = useState(1);
  const [icons, setIcons] = useState([]);
  
  const sizes = ['32x32', '64x64', '128x128'];
  
  const generateIcons = () => {
    let newIcons = [];
    for (let i = 0; i < count; i++) {
      const iconSize = parseInt(size.split('x')[0]);
      newIcons.push({
        text: extractLetters(text),
        bgColor: getRandomColor(),
        textColor: getRandomColor(),
        shape: Math.random() > 0.5 ? 'circle' : 'rectangle',
        font: getRandomElement(fonts),
        size: iconSize
      });
    }
    setIcons(newIcons);
  };
  
  const downloadIcon = (icon) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = icon.size;
    const ctx = canvas.getContext('2d');
    // Drawing logic similar to IconCanvas
    // ...
    
    canvas.toBlob(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `icon_${icon.text}.png`;
      link.click();
    });
  };
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" />
      <Select onValueChange={setSize}>
        <Label>Icon Size</Label>
        {sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
      </Select>
      <div>
        <Label>Number of Icons</Label>
        <Slider defaultValue={[1]} max={10} onValueChange={(v) => setCount(v[0])} />
      </div>
      <Button onClick={generateIcons}>Generate Icons</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {icons.map((icon, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <IconCanvas {...icon} />
            <Button className="mt-2" onClick={() => downloadIcon(icon)}>Download</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <IconGenerator />
    </div>
  );
}