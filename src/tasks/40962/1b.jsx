import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [workDuration, setWorkDuration] = useState(1500);
  const [shortBreakDuration, setShortBreakDuration] = useState(300);
  const [longBreakDuration, setLongBreakDuration] = useState(900);
  const [showDurationDialog, setShowDurationDialog] = useState(false);
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      completeSession();
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);
  
  const completeSession = () => {
    const isLongBreak = cycles % 2 === 1;
    playSound();
    if (isBreak) {
      nextTaskOrBreak();
    } else {
      setCycles(cycles + 1);
      setIsBreak(true);
      setTimeLeft(isLongBreak ? longBreakDuration : shortBreakDuration);
      setNotification(`Take a ${isLongBreak ? 'long' : 'short'} break!`);
    }
  };
  
  const nextTaskOrBreak = () => {
    if (currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setTimeLeft(workDuration);
      setIsBreak(false);
      setNotification(`Starting next task: ${tasks[currentTaskIndex + 1].name}`);
    } else {
      setNotification('All tasks completed!');
      resetTimer();
    }
  };
  
  const startTimer = () => {
    if (!isRunning) setIsRunning(true);
  };
  
  const pauseTimer = () => {
    if (isRunning) setIsRunning(false);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workDuration);
    setIsBreak(false);
    setCycles(0);
    setCurrentTaskIndex(-1);
  };
  
  const skipSession = () => {
    if (isBreak) nextTaskOrBreak();
    else completeSession();
  };
  
  const addTask = (name, pomodoros) => {
    setTasks([...tasks, { name, pomodoros, completed: 0 }]);
    if (currentTaskIndex === -1) {
      setCurrentTaskIndex(0);
      setTimeLeft(workDuration);
    }
  };
  
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    if (index === currentTaskIndex) nextTaskOrBreak();
    if (index < currentTaskIndex) setCurrentTaskIndex(currentTaskIndex - 1);
  };
  
  const markComplete = (index) => {
    const updatedTasks = [...tasks];
    if (updatedTasks[index].completed < updatedTasks[index].pomodoros) {
      updatedTasks[index].completed += 1;
      setTasks(updatedTasks);
      if (updatedTasks[index].completed === updatedTasks[index].pomodoros) {
        setNotification(`Task completed: ${updatedTasks[index].name}`);
      }
    }
  };
  
  const playSound = () => {
    const audio = new Audio('/path/to/notification.mp3'); // Assume the sound file is in public folder
    audio.play();
  };
  
  const openDurationDialog = () => setShowDurationDialog(true);
  
  const setDurations = (work, short, long) => {
    setWorkDuration(work);
    setShortBreakDuration(short);
    setLongBreakDuration(long);
    setShowDurationDialog(false);
  };
  
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <TimerDisplay
            timeLeft={timeLeft}
            isBreak={isBreak}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            resetTimer={resetTimer}
            skipSession={skipSession}
            progress={(isBreak ? (isBreak === 'short' ? shortBreakDuration : longBreakDuration) : workDuration) - timeLeft}
            total={isBreak ? (isBreak === 'short' ? shortBreakDuration : longBreakDuration) : workDuration}
          />
        </CardContent>
      </Card>
      <TaskList
        tasks={tasks}
        addTask={addTask}
        removeTask={removeTask}
        markComplete={markComplete}
        currentTaskIndex={currentTaskIndex}
      />
      <Button onClick={openDurationDialog}>Set Durations</Button>
      <Dialog open={showDurationDialog} onOpenChange={setShowDurationDialog}>
        <SetDurations onSubmit={setDurations} />
      </Dialog>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
}

function TimerDisplay({ timeLeft, isBreak, startTimer, pauseTimer, resetTimer, skipSession, progress, total }) {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  return (
    <div className="text-center space-y-2">
      <h2 className="text-2xl">{isBreak ? "Break Time!" : "Work Time!"}</h2>
      <Progress value={progress} max={total} className="h-4 mb-4" />
      <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
      <div className="flex justify-center space-x-2">
        <Button onClick={isRunning ? pauseTimer : startTimer}>{isRunning ? 'Pause' : 'Start'}</Button>
        <Button onClick={resetTimer}>Reset</Button>
        <Button onClick={skipSession}>Skip</Button>
      </div>
    </div>
  );
}

function TaskList({ tasks, addTask, removeTask, markComplete, currentTaskIndex }) {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskName) {
      addTask(newTaskName, parseInt(newTaskPomodoros, 10));
      setNewTaskName('');
      setNewTaskPomodoros(1);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4">
          <Input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Task name"
            className="mr-2"
          />
          <Input
            type="number"
            value={newTaskPomodoros}
            onChange={(e) => setNewTaskPomodoros(e.target.value)}
            min="1"
            className="w-20 mr-2"
          />
          <Button type="submit">Add Task</Button>
        </form>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className={`flex items-center justify-between mb-2 ${index === currentTaskIndex ? 'font-bold' : ''}`}>
              <span>{task.name} - {task.completed}/{task.pomodoros}</span>
              <div>
                <Button onClick={() => markComplete(index)} className="mr-2">Complete</Button>
                <Button onClick={() => removeTask(index)} variant="destructive">Remove</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SetDurations({ onSubmit }) {
  const [work, setWork] = useState(1500);
  const [short, setShort] = useState(300);
  const [long, setLong] = useState(900);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(work, short, long);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Work Duration (seconds):</label>
        <Input type="number" value={work} onChange={(e) => setWork(Number(e.target.value))} />
      </div>
      <div>
        <label>Short Break Duration (seconds):</label>
        <Input type="number" value={short} onChange={(e) => setShort(Number(e.target.value))} />
      </div>
      <div>
        <label>Long Break Duration (seconds):</label>
        <Input type="number" value={long} onChange={(e) => setLong(Number(e.target.value))} />
      </div>
      <Button type="submit">Set</Button>
    </form>
  );
}

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed top-4 right-4 bg-primary text-primary-foreground p-4 rounded shadow-lg">
      {message}
    </div>
  );
}

export default App;