import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

// Notification Component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
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
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow z-40`}>
      {message}
    </div>
  );
}

const predefinedExercises = [
  {
    name: "Push-ups",
    details:
      "Keep your back straight and lower yourself until your chest nearly touches the floor.",
  },
  {
    name: "Squats",
    details:
      "Stand with feet hip-width apart, lower down as if sitting back into a chair.",
  },
  {
    name: "Lunges",
    details:
      "Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.",
  },
  {
    name: "Sit-ups",
    details: "Lie on your back with knees bent and feet flat on the floor.",
  },
  {
    name: "Burpees",
    details:
      "Begin in a standing position, move into a squat with hands on the ground, kick feet back into a push-up position, return to squat, and leap up.",
  },
  {
    name: "Plank",
    details:
      "Hold your body in a straight line from head to heels, supporting yourself on your forearms and toes.",
  },
  {
    name: "Jumping Jacks",
    details:
      "Jump to a position with legs spread and hands touching overhead, then return to the starting position.",
  },
  {
    name: "Pull-ups",
    details:
      "Hang from a bar with palms facing away, pull your body up until your chin is above the bar.",
  },
];

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// ExerciseSelector Component
function ExerciseSelector({ onAddExercise, showNotification }) {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredExercises = predefinedExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddExercise = () => {
    if (selectedExercise) {
      const exercise = predefinedExercises.find(
        (ex) => ex.name === selectedExercise
      );
      onAddExercise(exercise);
      setSelectedExercise("");
      setSearchTerm("");
      showNotification("Exercise added successfully!", "success");
    } else if (customExercise.trim()) {
      onAddExercise({ name: customExercise.trim(), details: "", id: generateUniqueId() });
      setCustomExercise("");
      setSearchTerm("");
      showNotification("Custom exercise added successfully!", "success");
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Search Exercises
            </Label>
            <Input
              type="text"
              placeholder="Search exercises"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Select Predefined Exercise */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Select Exercise
            </Label>
            <Select
              value={selectedExercise}
              onValueChange={(value) => setSelectedExercise(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an exercise" />
              </SelectTrigger>
              <SelectContent>
                {filteredExercises.map((exercise, index) => (
                  <SelectItem key={index} value={exercise.name}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Add Custom Exercise */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Or Add Custom Exercise
            </Label>
            <Input
              type="text"
              placeholder="Custom exercise"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
            />
          </div>
          
          {/* Add Button */}
          <Button
            onClick={handleAddExercise}
            className="w-full sm:w-auto"
            disabled={!selectedExercise && !customExercise.trim()}
          >
            Add to Routine
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// RoutineItem Component
function RoutineItem({
                       exercise,
                       onUpdateExercise,
                       onRemoveExercise,
                       onMoveUp,
                       onMoveDown,
                       isFirst,
                       isLast,
                     }) {
  const handleSetsChange = (e) => {
    const value = e.target.value;
    onUpdateExercise(exercise.id, { sets: value });
  };
  
  const handleRepsChange = (e) => {
    const value = e.target.value;
    onUpdateExercise(exercise.id, { reps: value });
  };
  
  const handleCompletedChange = () => {
    onUpdateExercise(exercise.id, { completed: !exercise.completed });
  };
  
  const toggleDetails = () => {
    onUpdateExercise(exercise.id, { showDetails: !exercise.showDetails });
  };
  
  return (
    <div className="flex flex-col p-2 border rounded-md mb-2 bg-white shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {/* Exercise Details */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={exercise.completed}
            onCheckedChange={handleCompletedChange}
          />
          <span
            className={`text-lg ${
              exercise.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {exercise.name}
          </span>
          {exercise.details && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDetails}
            >
              {exercise.showDetails ? "Hide Details" : "Show Details"}
            </Button>
          )}
        </div>
        
        {/* Sets and Reps Inputs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-2 sm:mt-0">
          <div>
            <Label htmlFor={`sets-${exercise.id}`} className="sr-only">
              Sets
            </Label>
            <Input
              id={`sets-${exercise.id}`}
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={handleSetsChange}
              className="w-20 mb-2"
              min={1}
            />
          </div>
          <div>
            <Label htmlFor={`reps-${exercise.id}`} className="sr-only">
              Reps
            </Label>
            <Input
              id={`reps-${exercise.id}`}
              type="number"
              placeholder="Reps"
              value={exercise.reps}
              onChange={handleRepsChange}
              className="w-20"
              min={1}
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => onRemoveExercise(exercise.id)}
            className="text-red-500 mt-2 bg-red-100 sm:mt-0"
          >
            Remove 🗑️
          </Button>
        </div>
      </div>
      
      {/* Exercise Details */}
      {exercise.showDetails && exercise.details && (
        <div className="mt-2 text-sm text-gray-700">
          {exercise.details}
        </div>
      )}
      
      {/* Move Up and Move Down Buttons */}
      <div className="flex justify-end space-x-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveUp(exercise.id)}
          disabled={isFirst}
        >
          ↑ Move Up
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveDown(exercise.id)}
          disabled={isLast}
        >
          ↓ Move Down
        </Button>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [routine, setRoutine] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [progress, setProgress] = useState(0);
  const [restDuration, setRestDuration] = useState(30); // Default rest duration in seconds
  const [customRestDuration, setCustomRestDuration] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  // Add Exercise to Routine
  const handleAddExercise = (exercise) => {
    const newExercise = {
      id: generateUniqueId(),
      name: exercise.name,
      details: exercise.details || "",
      sets: "",
      reps: "",
      completed: false,
      showDetails: false,
    };
    setRoutine([...routine, newExercise]);
    setNotification({ message: "Exercise added successfully!", type: "success" });
  };
  
  // Update Exercise in Routine
  const handleUpdateExercise = (id, updatedFields) => {
    const updatedRoutine = routine.map((exercise) =>
      exercise.id === id ? { ...exercise, ...updatedFields } : exercise
    );
    setRoutine(updatedRoutine);
  };
  
  // Remove Exercise from Routine
  const handleRemoveExercise = (id) => {
    setRoutine(routine.filter((exercise) => exercise.id !== id));
    setNotification({ message: "Exercise removed successfully!", type: "success" });
  };
  
  // Clear Entire Routine
  const handleClearRoutine = () => {
    setRoutine([]);
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setTimer(0);
    setRestTimer(0);
    setProgress(0);
    setNotification({ message: "Routine cleared!", type: "success" });
  };
  
  // Move Exercise Up
  const handleMoveUp = (id) => {
    const index = routine.findIndex((exercise) => exercise.id === id);
    if (index > 0) {
      const newRoutine = [...routine];
      [newRoutine[index - 1], newRoutine[index]] = [
        newRoutine[index],
        newRoutine[index - 1],
      ];
      setRoutine(newRoutine);
      setNotification({ message: "Exercise moved up!", type: "success" });
    }
  };
  
  // Move Exercise Down
  const handleMoveDown = (id) => {
    const index = routine.findIndex((exercise) => exercise.id === id);
    if (index < routine.length - 1) {
      const newRoutine = [...routine];
      [newRoutine[index + 1], newRoutine[index]] = [
        newRoutine[index],
        newRoutine[index + 1],
      ];
      setRoutine(newRoutine);
      setNotification({ message: "Exercise moved down!", type: "success" });
    }
  };
  
  // Start Workout
  const startWorkout = () => {
    if (routine.length === 0) return;
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
    setProgress(0);
    setTimer(60); // Default exercise duration in seconds
    setNotification({ message: "Workout started!", type: "success" });
  };
  
  // Workout Timer Logic
  useEffect(() => {
    let exerciseInterval = null;
    if (workoutStarted && timer > 0 && restTimer === 0) {
      exerciseInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (workoutStarted && timer === 0 && restTimer === 0) {
      if (currentExerciseIndex < routine.length - 1) {
        setRestTimer(restDuration);
        setNotification({ message: "Rest time!", type: "success" });
      } else {
        setWorkoutStarted(false);
        setNotification({ message: "Workout Complete!", type: "success" });
      }
    }
    return () => clearInterval(exerciseInterval);
  }, [
    workoutStarted,
    timer,
    restTimer,
    currentExerciseIndex,
    routine.length,
    restDuration,
  ]);
  
  useEffect(() => {
    let restInterval = null;
    if (workoutStarted && restTimer > 0) {
      restInterval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (workoutStarted && restTimer === 0 && timer === 0) {
      if (currentExerciseIndex < routine.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setTimer(60); // Next exercise duration
        setProgress(((currentExerciseIndex + 1) / routine.length) * 100);
        setNotification({ message: "Next exercise!", type: "success" });
      } else {
        setWorkoutStarted(false);
        setNotification({ message: "Workout Complete!", type: "success" });
      }
    }
    return () => clearInterval(restInterval);
  }, [
    workoutStarted,
    restTimer,
    timer,
    currentExerciseIndex,
    routine.length,
    restDuration,
  ]);
  
  // Handle Rest Duration Setting
  const handleSetRestDuration = () => {
    const duration = parseInt(customRestDuration);
    if (!isNaN(duration) && duration >= 10) {
      setRestDuration(duration);
      setCustomRestDuration("");
      setNotification({ message: "Rest duration set successfully!", type: "success" });
    } else {
      setNotification({ message: "Please enter a valid number (minimum 10).", type: "error" });
    }
  };
  
  // Close Notification
  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };
  
  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
      }`}
    >
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl">Workout Routine Builder</CardTitle>
          <div className="flex items-center space-x-2">
            <span>Dark Mode</span>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        {/* Main Content */}
        {!workoutStarted ? (
          <>
            {/* Exercise Selector */}
            <ExerciseSelector onAddExercise={handleAddExercise} showNotification={setNotification} />
            
            {/* Workout Settings */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-xl">Workout Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {/* Rest Duration Setting */}
                  <div>
                    <Label className="block text-sm font-medium mb-1">
                      Rest Duration (seconds)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter rest duration"
                      value={customRestDuration}
                      onChange={(e) => setCustomRestDuration(e.target.value)}
                      className="w-full"
                      min={10}
                    />
                    <Button
                      onClick={handleSetRestDuration}
                      className="mt-2"
                    >
                      Set Rest Duration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Your Routine */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-xl">Your Routine</CardTitle>
              </CardHeader>
              <CardContent>
                {routine.length === 0 ? (
                  <p className="text-gray-600">No exercises added yet.</p>
                ) : (
                  <div>
                    {routine.map((exercise, index) => (
                      <RoutineItem
                        key={exercise.id}
                        exercise={exercise}
                        onUpdateExercise={handleUpdateExercise}
                        onRemoveExercise={handleRemoveExercise}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        isFirst={index === 0}
                        isLast={index === routine.length - 1}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                onClick={handleClearRoutine}
                className="bg-red-500 hover:bg-red-600"
              >
                Clear Routine
              </Button>
              <Button
                onClick={startWorkout}
                disabled={routine.length === 0}
                className={`${
                  routine.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                Start Workout
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Current Exercise */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-xl">Current Exercise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-white shadow">
                  <h3 className="text-lg font-bold">
                    {routine[currentExerciseIndex]?.name}
                  </h3>
                  <p className="mt-2">
                    Sets: {routine[currentExerciseIndex]?.sets || "-"} | Reps:{" "}
                    {routine[currentExerciseIndex]?.reps || "-"}
                  </p>
                  {routine[currentExerciseIndex]?.details && (
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
                      {routine[currentExerciseIndex]?.details}
                    </p>
                  )}
                  <p className="mt-4 text-2xl font-bold">
                    Time Remaining: {timer} seconds
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Rest Timer */}
            {restTimer > 0 && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-xl">Rest Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-white shadow">
                    <p className="text-2xl font-bold">
                      Rest for {restTimer} seconds
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Progress Bar */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-xl">Workout Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-4 rounded-full" />
                <p className="mt-2 text-sm text-gray-500">
                  {Math.round(progress)}% completed
                </p>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleClearRoutine}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Stop Workout
              </Button>
              <Button
                disabled
                className="bg-gray-400 text-white cursor-not-allowed"
              >
                Workout in Progress
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
