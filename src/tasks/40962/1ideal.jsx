import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Notification Component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Notification disappears after 3 seconds
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

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export default function App() {
  // Timer States
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(1500);
  const [breakDuration, setBreakDuration] = useState(300);
  const [longBreakDuration, setLongBreakDuration] = useState(900); // 15 minutes
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(2); // Set to 2 for long break after 2 tasks
  const [currentCycle, setCurrentCycle] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Task Management States
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [activeTask, setActiveTask] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  
  // Notification State
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  // Refs
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  
  // Initialize audio for notifications
  useEffect(() => {
    // Place your notification.mp3 file in the public folder
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/17/audio_bc9b676777.mp3");
    // Handle audio loading errors
    audioRef.current.onerror = () => {
      console.error("Failed to load notification sound.");
    };
  }, []);
  
  // Set the active task based on currentTaskIndex
  useEffect(() => {
    if (tasks.length > 0 && currentTaskIndex < tasks.length) {
      setActiveTask(tasks[currentTaskIndex]);
      setTimeLeft(workDuration);
      setIsBreak(false);
      setIsActive(true); // Auto-start the timer for the next task
    } else {
      setActiveTask(null);
      setIsActive(false);
      setNotification({ message: "All tasks completed!", type: "success" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, currentTaskIndex]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  
  const handleTimerEnd = () => {
    audioRef.current.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });
    
    if (isBreak) {
      // End of break, start next work session
      setIsBreak(false);
      setTimeLeft(workDuration);
      setNotification({ message: "Break ended. Time to work!", type: "success" });
      setIsActive(true); // Auto-start work session
    } else {
      if (activeTask) {
        // Increment completed Pomodoros for the task
        const updatedTasks = tasks.map((task, index) =>
          index === currentTaskIndex
            ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
            : task
        );
        setTasks(updatedTasks);
        setCompletedPomodoros((prev) => prev + 1);
        
        // Check if the task is completed
        const task = updatedTasks[currentTaskIndex];
        if (task.completedPomodoros >= task.totalPomodoros) {
          setNotification({ message: `Task "${task.name}" completed!`, type: "success" });
          setCurrentTaskIndex((prev) => prev + 1); // Move to next task
        } else {
          // Start short break
          setIsBreak(true);
          setTimeLeft(breakDuration);
          setNotification({ message: "Work session ended. Take a break!", type: "success" });
          setIsActive(true); // Auto-start break
        }
      } else {
        // No active task, start break
        if (currentCycle + 1 === cyclesBeforeLongBreak) {
          setIsBreak(true);
          setTimeLeft(longBreakDuration);
          setNotification({ message: "Work session ended. Long break time!", type: "success" });
          setCurrentCycle(0);
        } else {
          setIsBreak(true);
          setTimeLeft(breakDuration);
          setNotification({ message: "Work session ended. Take a break!", type: "success" });
          setCurrentCycle((prev) => prev + 1);
        }
        setIsActive(true); // Auto-start break
      }
    }
  };
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerEnd();
    }
    
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);
  
  const handleStartPause = () => {
    if (!activeTask && tasks.length > 0) {
      setActiveTask(tasks[currentTaskIndex]);
      setIsActive(true);
      setNotification({ message: "Timer started.", type: "success" });
      return;
    }
    setIsActive((prev) => !prev);
    setNotification({ message: isActive ? "Timer paused." : "Timer started.", type: "success" });
  };
  
  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workDuration);
    setCurrentCycle(0);
    setCompletedPomodoros(0);
    setNotification({ message: "Timer reset.", type: "success" });
  };
  
  const handleSetDurations = () => {
    if (workDuration < 60 || breakDuration < 60 || longBreakDuration < 60) {
      setNotification({ message: "Durations must be at least 1 minute.", type: "error" });
      return;
    }
    if (!isActive) {
      setTimeLeft(isBreak ? breakDuration : workDuration);
      setNotification({ message: "Durations updated.", type: "success" });
    }
  };
  
  const handleSkip = () => {
    clearInterval(timerRef.current);
    handleTimerEnd();
    setNotification({ message: "Session skipped.", type: "success" });
  };
  
  const addTask = () => {
    if (taskInput.trim() === "") {
      setNotification({ message: "Task cannot be empty.", type: "error" });
      return;
    }
    const newTask = {
      id: generateUniqueId(),
      name: taskInput.trim(),
      completed: false,
      totalPomodoros: 1, // You can enhance this to allow setting custom Pomodoros per task
      completedPomodoros: 0,
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setNotification({ message: "Task added.", type: "success" });
    if (tasks.length === 0) {
      setActiveTask(newTask);
      setTimeLeft(workDuration);
      setIsActive(true); // Auto-start timer for the first task
    }
  };
  
  const completeTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    setNotification({ message: "Task updated.", type: "success" });
  };
  
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setNotification({ message: "Task removed.", type: "success" });
    
    if (currentTaskIndex >= updatedTasks.length) {
      setCurrentTaskIndex(updatedTasks.length - 1);
      if (updatedTasks.length > 0) {
        setActiveTask(updatedTasks[updatedTasks.length - 1]);
        setTimeLeft(workDuration);
        setIsActive(true); // Auto-start the previous task
      } else {
        setActiveTask(null);
      }
    }
  };
  
  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };
  
  return (
    <div className={`min-h-screen  sm:p-2 ${isActive ? "bg-gray-200" : "bg-gray-100"}`}>
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Pomodoro Timer Card */}
        <Card className="w-full max-w-md  shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Pomodoro Timer
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isBreak
                ? "Take a break!"
                : activeTask
                  ? `Task: ${activeTask.name}`
                  : "Focus on your work!"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            <div className="text-5xl font-mono">{formatTime(timeLeft)}</div>
            
            {/* Progress Bar */}
            <Progress
              value={
                isBreak
                  ? ((breakDuration - timeLeft) / breakDuration) * 100
                  : activeTask
                    ? ((activeTask.totalPomodoros * workDuration) - (activeTask.completedPomodoros * workDuration - timeLeft)) / (activeTask.totalPomodoros * workDuration) * 100
                    : 0
              }
              className="w-full mt-4"
            />
            
            {/* Control Buttons */}
            <div className="mt-4 flex space-x-2">
              <Button onClick={handleStartPause} variant={isActive ? "destructive" : "primary"}>
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
              <Button onClick={handleSkip} variant="ghost">
                Skip
              </Button>
            </div>
            
            {/* Duration Settings */}
            <div className="w-full mt-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="workDuration" className="text-sm">
                  Work Duration (minutes)
                </Label>
                <Input
                  id="workDuration"
                  type="number"
                  min={1}
                  value={workDuration / 60}
                  onChange={(e) => setWorkDuration(Number(e.target.value) * 60)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <Label htmlFor="breakDuration" className="text-sm">
                  Break Duration (minutes)
                </Label>
                <Input
                  id="breakDuration"
                  type="number"
                  min={1}
                  value={breakDuration / 60}
                  onChange={(e) => setBreakDuration(Number(e.target.value) * 60)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <Label htmlFor="longBreakDuration" className="text-sm">
                  Long Break Duration (minutes)
                </Label>
                <Input
                  id="longBreakDuration"
                  type="number"
                  min={1}
                  value={longBreakDuration / 60}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value) * 60)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <Label htmlFor="cyclesBeforeLongBreak" className="text-sm">
                  Cycles Before Long Break
                </Label>
                <Input
                  id="cyclesBeforeLongBreak"
                  type="number"
                  min={1}
                  value={cyclesBeforeLongBreak}
                  onChange={(e) => setCyclesBeforeLongBreak(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSetDurations} className="w-full mt-4">
                Set Durations
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <span className="text-sm text-gray-500">
              Session: {isBreak ? "Break" : activeTask ? "Work" : "Idle"}
            </span>
            <span className="text-sm text-gray-500">
              Status: {isActive ? "Running" : "Paused"}
            </span>
            <span className="text-sm text-gray-500">
              Completed Pomodoros: {completedPomodoros}
            </span>
          </CardFooter>
        </Card>
        
        {/* Task List Card */}
        <Card className="w-full max-w-md mt-8 p-6 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="New Task"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addTask} variant="primary">
                Add
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {tasks.map((task, index) => (
                <li key={task.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => completeTask(task.id)}
                  />
                  <span
                    className={`flex-1 ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.name} ({task.completedPomodoros}/{task.totalPomodoros})
                  </span>
                  <Button
                    onClick={() => removeTask(task.id)}
                    variant="ghost"
                    className="text-red-500"
                  >
                    🗑️
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
