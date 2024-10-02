import React, { useState, useEffect } from "react";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue,} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

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

// Utility functions for randomization
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

const fonts = ["Arial", "Helvetica", "Courier New", "Times New Roman", "Verdana", "Georgia",];

// Helper function to extract up to 5 random letters from the input text
const getRandomLetters = (text, max = 5) => {
  const cleanedText = text.replace(/\s+/g, "").toUpperCase();
  if (cleanedText.length <= max) return cleanedText;
  let result = "";
  while (result.length < max) {
    const randomIndex = Math.floor(Math.random() * cleanedText.length);
    const char = cleanedText[randomIndex];
    if (!result.includes(char)) {
      result += char;
    }
  }
  return result;
};

// ExerciseSelector Component
function ExerciseSelector({ onAddExercise }) {
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
    } else if (customExercise.trim()) {
      onAddExercise({ name: customExercise.trim(), details: "" });
      setCustomExercise("");
      setSearchTerm("");
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
            <Input  type="text" placeholder="Search exercises" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Select Predefined Exercise */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Select Exercise
            </Label>
            <Select value={selectedExercise} onValueChange={(value) => setSelectedExercise(value)}
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
            <Input type="text" placeholder="Custom exercise" value={customExercise} onChange={(e) => setCustomExercise(e.target.value)}
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
                       index,
                       onUpdateExercise,
                       onRemoveExercise,
                       onMoveUp,
                       onMoveDown,
                       totalExercises,
                     }) {
  const [sets, setSets] = useState(exercise.sets || "");
  const [reps, setReps] = useState(exercise.reps || "");
  const [completed, setCompleted] = useState(exercise.completed || false);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleSetsChange = (e) => {
    const value = e.target.value;
    setSets(value);
    onUpdateExercise(index, { ...exercise, sets: value });
  };
  
  const handleRepsChange = (e) => {
    const value = e.target.value;
    setReps(value);
    onUpdateExercise(index, { ...exercise, reps: value });
  };
  
  const handleCompletedChange = () => {
    const value = !completed;
    setCompleted(value);
    onUpdateExercise(index, { ...exercise, completed: value });
  };
  
  return (
    <div className="flex flex-col p-2 border rounded-md mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={completed}
            onCheckedChange={handleCompletedChange}
          />
          <span
            className={`text-lg ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {exercise.name}
          </span>
          {exercise.details && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={handleSetsChange}
            className="w-16"
            min={1}
          />
          <Input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={handleRepsChange}
            className="w-16"
            min={1}
          />
          <Button
            variant="ghost"
            onClick={() => onRemoveExercise(index)}
            className="text-red-500"
          >
            🗑️
          </Button>
        </div>
      </div>
      {showDetails && (
        <div className="mt-2 text-sm text-gray-700">{exercise.details}</div>
      )}
      <div className="flex justify-end space-x-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
        >
          ↑ Move Up
        </Button>
        <Button
          variant="outline" size="sm" onClick={() => onMoveDown(index)} disabled={index === totalExercises - 1}
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
  
  useEffect(() => {
    const savedRoutine = localStorage.getItem("routine");
    if (savedRoutine) {
      setRoutine(JSON.parse(savedRoutine));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("routine", JSON.stringify(routine));
  }, [routine]);
  
  const handleAddExercise = (exercise) => {
    setRoutine([
      ...routine,
      { ...exercise, sets: "", reps: "", completed: false },
    ]);
  };
  
  const handleUpdateExercise = (index, updatedExercise) => {
    const newRoutine = [...routine];
    newRoutine[index] = updatedExercise;
    setRoutine(newRoutine);
  };
  
  const handleRemoveExercise = (index) => {
    const newRoutine = [...routine];
    newRoutine.splice(index, 1);
    setRoutine(newRoutine);
  };
  
  const handleClearRoutine = () => {
    setRoutine([]);
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setTimer(0);
    setRestTimer(0);
    setProgress(0);
  };
  
  const handleMoveUp = (index) => {
    if (index > 0) {
      const newRoutine = [...routine];
      [newRoutine[index - 1], newRoutine[index]] = [
        newRoutine[index],
        newRoutine[index - 1],
      ];
      setRoutine(newRoutine);
    }
  };
  
  const handleMoveDown = (index) => {
    if (index < routine.length - 1) {
      const newRoutine = [...routine];
      [newRoutine[index], newRoutine[index + 1]] = [
        newRoutine[index + 1],
        newRoutine[index],
      ];
      setRoutine(newRoutine);
    }
  };
  
  const startWorkout = () => {
    if (routine.length === 0) return;
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
    setProgress(0);
    setTimer(60);
  };
  
  useEffect(() => {
    let exerciseInterval = null;
    if (workoutStarted && timer > 0 && restTimer === 0) {
      exerciseInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (workoutStarted && timer === 0 && restTimer === 0) {
      if (currentExerciseIndex < routine.length - 1) {
        setRestTimer(30); // Set rest duration (in seconds)
      } else {
        setWorkoutStarted(false);
        alert("Workout Complete!");
      }
    }
    return () => clearInterval(exerciseInterval);
  }, [workoutStarted, timer, restTimer, currentExerciseIndex, routine.length]);
  
  useEffect(() => {
    let restInterval = null;
    if (workoutStarted && restTimer > 0) {
      restInterval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (workoutStarted && restTimer === 0 && timer === 0) {
      if (currentExerciseIndex < routine.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setTimer(60); // Set next exercise duration
        setProgress(((currentExerciseIndex + 1) / routine.length) * 100);
      } else {
        setWorkoutStarted(false);
        alert("Workout Complete!");
      }
    }
    return () => clearInterval(restInterval);
  }, [workoutStarted, restTimer, timer, currentExerciseIndex, routine.length]);
  
  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-xl mx-auto">
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
        
        {!workoutStarted ? (
          <>
            <ExerciseSelector onAddExercise={handleAddExercise} />
            
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
                      <RoutineItem key={index} exercise={exercise} index={index} onUpdateExercise={handleUpdateExercise} onRemoveExercise={handleRemoveExercise}
                        onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} totalExercises={routine.length}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClearRoutine} className="bg-red-500 hover:bg-green-600">
                Clear Routine
              </Button>
              <Button
                onClick={startWorkout}
                disabled={routine.length === 0}
                className={`${
                  routine.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
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
                <div className="p-4 border rounded-md">
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
                  <div className="p-4 border rounded-md">
                    <p className="text-2xl font-bold">
                      Rest for {restTimer} seconds
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between ">
              <Button variant="outline" onClick={handleClearRoutine} className= "bg-gray-400">
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
