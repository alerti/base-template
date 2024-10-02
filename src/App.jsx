import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const fonts = ['Arial', 'Helvetica', 'Courier New', 'Times New Roman', 'Verdana', 'Georgia'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function extractLetters(text, max = 5) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  let letters = words.map(word => word[0]).join('').toUpperCase();
  if (letters.length > max) {
    let result = '';
    while (result.length < max) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      if (!result.includes(letters[randomIndex])) {
        result += letters[randomIndex];
      }
    }
    return result;
  }
  return letters;
}

function Icon({ letters, size, bgColor, textColor, font }) {
  const canvasRef = useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const isCircle = Math.random() < 0.5;
    const radius = size / 2;
    
    canvas.width = size;
    canvas.height = size;
    
    // Draw background
    ctx.fillStyle = bgColor;
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }
    
    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = `${size * 0.4}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letters, size / 2, size / 2);
  }, [letters, size, bgColor, textColor, font]);
  
  return <canvas ref={canvasRef} />;
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export default function App() {
  const [text, setText] = useState('');
  const [size, setSize] = useState('64');
  const [count, setCount] = useState(1);
  const [icons, setIcons] = useState([]);
  
  const sizes = {
    '32': '32x32',
    '64': '64x64',
    '128': '128x128'
  };
  
  const handleGenerate = () => {
    let newIcons = [];
    for(let i = 0; i < count; i++) {
      const letters = extractLetters(text);
      newIcons.push({
        letters,
        size: parseInt(size, 10),
        bgColor: generateRandomColor(),
        textColor: generateRandomColor(),
        font: randomChoice(fonts)
      });
    }
    setIcons(newIcons);
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter text for icon"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-2"
        />
        <Select value={size} onValueChange={setSize} className="mb-2">
          {Object.entries(sizes).map(([value, label]) =>
            <SelectItem key={value} value={value}>{label}</SelectItem>
          )}
        </Select>
        <Slider
          defaultValue={[1]}
          max={10}
          step={1}
          onValueChange={(value) => setCount(value[0])}
          className="mb-2"
        />
        <Button onClick={handleGenerate}>Generate Icons</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {icons.map((icon, index) => (
          <div key={index} className="flex flex-col items-center">
            <Icon {...icon} />
            <Button onClick={() => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = icon.size;
              canvas.height = icon.size;
              // Here we simulate drawing again for download
              ctx.fillStyle = icon.bgColor;
              ctx.fillRect(0, 0, icon.size, icon.size);
              ctx.fillStyle = icon.textColor;
              ctx.font = `${icon.size * 0.4}px ${icon.font}`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(icon.letters, icon.size / 2, icon.size / 2);
              downloadCanvas(canvas, `icon_${index}`);
            }}>Download</Button>
          </div>
        ))}
      </div>
    </div>
  );
}