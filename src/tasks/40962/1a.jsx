// App.jsx
import React, { useReducer, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import Settings from './components/Settings';
import Notification from './components/Notification';

const initialState = {
  tasks: [],
  currentTaskIndex: -1,
  timeLeft: 1500, // 25 minutes in seconds
  isRunning: false,
  isBreak: false,
  breakCount: 0
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_TIMER': return { ...state, isRunning: true };
    case 'PAUSE_TIMER': return { ...state, isRunning: false };
    case 'UPDATE_TIME': return { ...state, timeLeft: action.payload };
    case 'NEXT_TASK':
      if (state.currentTaskIndex + 1 < state.tasks.length) {
        return { ...state, currentTaskIndex: state.currentTaskIndex + 1, timeLeft: state.isBreak ? 300 : 1500, breakCount: state.isBreak ? 0 : state.breakCount + 1, isBreak: !state.isBreak };
      }
      return state; // or reset to initial state if no more tasks
    // Add more actions as needed
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState({ message: '', show: false });
  
  const showNotification = (msg) => {
    setNotification({ message: msg, show: true });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-2">
      <Card className="w-full max-w-2xl p-4 sm:p-8">
        <CardContent>
          <h1 className="text-2xl mb-4">Pomodoro Timer</h1>
          <Notification message={notification.message} show={notification.show} />
          <Timer state={state} dispatch={dispatch} showNotification={showNotification} />
          <TaskList tasks={state.tasks} dispatch={dispatch} currentTaskIndex={state.currentTaskIndex} />
          <button onClick={() => setShowSettings(true)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Set Durations
          </button>
        </CardContent>
      </Card>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// Additional components like Timer, TaskList, TaskItem, Settings, and Notification would follow here with their respective implementations.