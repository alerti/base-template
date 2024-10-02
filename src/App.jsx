import React, { useState, useRef } from 'react';
import { Button, Input, Select, SelectItem, NumberInput } from "@/components/ui";
import { cn } from "@/lib/utils";

const fonts = ['Arial', 'Helvetica', 'Courier New', 'Times New Roman', 'Verdana', 'Georgia'];
const sizes = { '32x32': 32, '64x64': 64, '128x128': 128 };

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractLetters(text, max = 5) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  let letters = words.map(word => word[0].toUpperCase()).join('');
  if (letters.length > max) {
    let result = '';
    while (result.length < max) {
      const index = Math.floor(Math.random() * letters.length);
      if (!result.includes(letters[index])) {
        result += letters[index];
      }
    }
    return result;
  }
  return letters;
}

function IconCanvas({ size, text, bgColor, textColor, shape, font }) {
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
    ctx.font = `bold ${s * 0.5}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, s / 2, s / 2);
    
  }, [size, text, bgColor, textColor, shape, font]);
  
  return <canvas ref={canvasRef} width={size} height={size} />;
}

function IconGenerator() {
  const [text, setText] = useState('');
  const [iconSize, setIconSize] = useState('64x64');
  const [count, setCount] = useState(1);
  const [icons, setIcons] = useState([]);
  
  const generateIcons = () => {
    const generatedIcons = Array.from({ length: count }, () => {
      const letters = extractLetters(text);
      const shape = Math.random() < 0.5 ? 'circle' : 'rectangle';
      const bgColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const textColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const font = getRandomElement(fonts);
      
      return { letters, shape, bgColor, textColor, font };
    });
    setIcons(generatedIcons);
  };
  
  const downloadIcon = (icon) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = sizes[iconSize];
    const ctx = canvas.getContext('2d');
    // Here you would replicate the drawing logic from IconCanvas
    // This is simplified for brevity
    new IconCanvas({...icon, size: sizes[iconSize]}).props.children.ref.current = canvas;
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${icon.letters}.png`;
      a.click();
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text for icons" />
      <Select value={iconSize} onValueChange={setIconSize}>
        {Object.keys(sizes).map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
      </Select>
      <NumberInput value={count} onChange={setCount} min={1} max={10} />
      <Button onClick={generateIcons}>Generate Icons</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {icons.map((icon, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <IconCanvas {...icon} size={sizes[iconSize]} />
            <Button onClick={() => downloadIcon(icon)} className="mt-2">Download</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return <IconGenerator />;
}