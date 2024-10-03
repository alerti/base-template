// src/App.jsx
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

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
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow`}>
      {message}
    </div>
  );
}

function TextDisplay({ text, userInput }) {
  const renderText = () => {
    const correctText = text.slice(0, userInput.length);
    const remainingText = text.slice(userInput.length);
    
    return (
      <>
        <span className="text-green-500">
          {correctText.split("").map((char, index) =>
            userInput[index] === char ? (
              <span key={index}>{char}</span>
            ) : (
              <span key={index} className="bg-red-200">
                {char}
              </span>
            )
          )}
        </span>
        <span>{remainingText}</span>
      </>
    );
  };
  
  return (
    <Card className="w-full p-4 bg-gray-50">
      <CardContent>
        <div className="text-lg leading-relaxed">{renderText()}</div>
      </CardContent>
    </Card>
  );
}

function TimerDisplay({ timeLeft }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  
  return <div className="text-center mb-4 text-4xl font-bold animate-pulse">{formatTime(timeLeft)}</div>;
}

function ResultsDisplay({ wpm, accuracy, onRestart }) {
  return (
    <Card className="w-full  bg-gray-50">
      <CardContent className="text-center">
        <CardTitle className="mb-6 animate-fadeIn">Results</CardTitle>
        <CardDescription>
          <p className="text-xl mb-4">WPM: {wpm}</p>
          <p className="text-xl mb-4">Accuracy: {accuracy}%</p>
        </CardDescription>
        <Button onClick={onRestart} className="mt-4">
          Restart Test
        </Button>
      </CardContent>
    </Card>
  );
}

function ProgressDisplay({ progress }) {
  return (
    <Progress value={progress} className="w-full h-4 rounded-full bg-gray-300 transition-all duration-500 ease-out" />
  );
}

export default function App() {
  const PASSAGE =
    "Historically, Barbara Blackburn holds the official Guinness World Record for the fastest typing speed on a traditional keyboard," +
    " reaching 212 WPM. She was recognized for her ability to maintain high speeds consistently over longer periods34." +
    " Other notable records include Sean Wrona, who reached 256 WPM during the Ultimate Typing Championship, " +
    "although this record is unofficial13.\n" +
    "Additionally, Stella Pajunas set a record of 216 WPM in 1946 using ";
  const TIME_LIMIT = 60;
  
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [hasError, setHasError] = useState(false);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  
  useEffect(() => {
    audioRef.current = new Audio(
      "https://cdn.pixabay.com/audio/2022/03/17/audio_bc9b676777.mp3"
    );
    audioRef.current.onerror = () => console.error("Failed to load notification sound.");
  }, []);
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      finishTest();
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);
  
  const startTest = () => {
    setIsActive(true);
    setNotification({ message: "Test started!", type: "success" });
    inputRef.current.focus();
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    
    if (!isActive) startTest();
    if (value.length < userInput.length || value.length > PASSAGE.length) return;
    
    const currentChar = PASSAGE[userInput.length];
    setUserInput(value);
    if (value[userInput.length] !== currentChar) setHasError(true);
    
    if (value === PASSAGE || userInput.length >= PASSAGE.length) finishTest();
  };
  
  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    setTimeLeft(0);
    calculateResults();
    setNotification({ message: "Test completed!", type: "success" });
    audioRef.current.play().catch((error) => console.error("Audio playback failed:", error));
  };
  
  const calculateResults = () => {
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const minutes = (TIME_LIMIT - timeLeft) / 60;
    const calculatedWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : wordsTyped;
    setWpm(calculatedWpm);
    
    let correctChars = userInput.split("").filter((char, index) => char === PASSAGE[index]).length;
    setAccuracy(Math.round((correctChars / userInput.length) * 100));
  };
  
  const restartTest = () => {
    setUserInput("");
    setTimeLeft(TIME_LIMIT);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(0);
    setNotification({ message: "", type: "" });
    setHasError(false);
    inputRef.current.focus();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <h1 className="text-3xl font-bold mb-8 animate-fadeInUp">Typing Speed Test</h1>
      
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      
      <div className="w-full max-w-xl space-y-6">
        <TextDisplay text={PASSAGE} userInput={userInput} />
        {!isFinished && (
          <>
            <TimerDisplay timeLeft={timeLeft} />
            <ProgressDisplay progress={(userInput.length / PASSAGE.length) * 100} />
          </>
        )}
        
        {!isFinished && (
          <Card className="p-4 bg-white border border-gray-300 shadow-lg rounded-lg relative transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
            <CardContent>
              <Label htmlFor="typingInput" className="block text-sm font-medium text-gray-700">
                Start typing below:
              </Label>
              <Input
                id="typingInput"
                type="text"
                value={userInput}
                onChange={handleChange}
                disabled={isFinished}
                ref={inputRef}
                className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out ${
                  hasError ? "border-red-500" : ""
                }`}
                placeholder="Start typing here..."
              />
              {hasError && (
                <p className="mt-2 text-sm text-red-600">Incorrect character detected.</p>
              )}
            </CardContent>
            <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 rounded-lg animate-pulse"></div>
          </Card>
        )}
        
        {isFinished && <ResultsDisplay wpm={wpm} accuracy={accuracy} onRestart={restartTest} />}
        
        {!isFinished && userInput.length > 0 && (
          <Button onClick={restartTest} className="w-full">
            Reset Test
          </Button>
        )}
      </div>
    </div>
  );
}
