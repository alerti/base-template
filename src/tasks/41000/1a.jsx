import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const passage = "Historically, Barbara Blackburn holds the official Guinness World Record for the fastest typing speed on a traditional keyboard, reaching 212 WPM. She was recognized for her ability to maintain high speeds consistently over longer periods. Other notable records include Sean Wrona, who reached 256 WPM during the Ultimate Typing Championship, although this record is unofficial. Additionally, Stella Pajunas set a record of 216 WPM in 1946.";

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [notification, setNotification] = useState(null);
  const inputRef = useRef(null);
  
  useEffect(() => {
    let timer;
    if (isTestRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 || userInput.length === passage.length) {
      setIsTestRunning(false);
      showNotification('Test completed!', 'success');
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTestRunning, userInput]);
  
  const startTest = () => {
    setUserInput('');
    setTimeLeft(60);
    setIsTestRunning(true);
    setNotification('Test started!');
    setTimeout(() => setNotification(null), 2000);
    if (inputRef.current) inputRef.current.focus();
  };
  
  const handleInputChange = (e) => {
    if (!isTestRunning) return;
    const inputText = e.target.value;
    if (inputText.length <= passage.length && passage.startsWith(inputText)) {
      setUserInput(inputText);
    }
  };
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const calculateWPM = () => {
    const words = userInput.trim().split(/\s+/).length;
    const minutes = (60 - timeLeft) / 60;
    return Math.round(words / minutes);
  };
  
  const calculateAccuracy = () => {
    const correctChars = userInput.split('').filter((char, i) => char === passage[i]).length;
    return ((correctChars / passage.length) * 100).toFixed(2);
  };
  
  const renderText = () => {
    return passage.split('').map((char, idx) => {
      let style = 'text-inherit';
      if (idx < userInput.length) {
        style = char === userInput[idx] ? 'text-green-500' : 'text-red-500';
      }
      return <span key={idx} className={style}>{char}</span>;
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Typing Speed Test</CardTitle>
        </CardHeader>
        <CardContent>
          {notification && (
            <div className={`mb-4 p-2 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notification.message}
            </div>
          )}
          <div className="mb-4 text-lg">
            {renderText()}
          </div>
          <input
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
            }}
            disabled={!isTestRunning}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start typing here..."
          />
          <div className="mb-4 text-center">
            Time Left: <span className="font-bold">{Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</span>
          </div>
          {!isTestRunning && userInput.length > 0 && (
            <div>
              <p>WPM: {calculateWPM()}</p>
              <p>Accuracy: {calculateAccuracy()}%</p>
            </div>
          )}
        </CardContent>
        <Button onClick={startTest} className="mt-4">
          {isTestRunning ? 'Typing...' : 'Start/Reset Test'}
        </Button>
      </Card>
    </div>
  );
}