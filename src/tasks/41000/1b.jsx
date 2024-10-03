import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const passage = "Historically, Barbara Blackburn holds the official Guinness World Record for the fastest typing speed on a traditional keyboard, reaching 212 WPM. She was recognized for her ability to maintain high speeds consistently over longer periods. Other notable records include Sean Wrona, who reached 256 WPM during the Ultimate Typing Championship, although this record is unofficial. Additionally, Stella Pajunas set a record of 216 WPM in 1946.";

function Timer({ onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);
  
  return <div>{`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}</div>;
}

function TypingTest() {
  const [input, setInput] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const inputRef = useRef(null);
  
  const handleTyping = (e) => {
    if (!isTestActive) return;
    const lastChar = e.target.value.slice(-1);
    if (lastChar === passage[input.length] || (lastChar === ' ' && passage[input.length] === ' ')) {
      setInput(e.target.value);
    } else if (e.target.value.length <= passage.length) {
      setNotification({ type: 'error', message: 'Typing error!' });
      setTimeout(() => setNotification(null), 1000);
    }
  };
  
  const startTest = () => {
    setInput('');
    setIsTestActive(true);
    setNotification({ type: 'start', message: 'Test started!' });
    setTimeout(() => setNotification(null), 1000);
  };
  
  const finishTest = () => {
    setIsTestActive(false);
  };
  
  useEffect(() => {
    if (isTestActive && input.length === passage.length) {
      finishTest();
    }
  }, [input, isTestActive]);
  
  // Prevent backspace and cursor movement
  useEffect(() => {
    const el = inputRef.current;
    const preventBackspace = (e) => {
      if (e.keyCode === 8) e.preventDefault();
    };
    el.addEventListener('keydown', preventBackspace);
    return () => el.removeEventListener('keydown', preventBackspace);
  }, []);
  
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl mb-4">Typing Speed Test</h2>
        {notification && <div className={`mb-2 ${notification.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{notification.message}</div>}
        <p className="mb-4">
          {passage.split('').map((char, index) => (
            <span key={index} className={index < input.length ? (input[index] === char ? 'text-green-500' : 'text-red-500') : ''}>
              {char}
            </span>
          ))}
        </p>
        <input
          ref={inputRef}
          value={input}
          onChange={handleTyping}
          disabled={!isTestActive}
          className="w-full p-2 border rounded"
          maxLength={passage.length}
        />
        <Timer onTimeUp={finishTest} />
        <Button onClick={startTest} disabled={isTestActive} className="mt-2">Start Test</Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <TypingTest />
    </div>
  );
}