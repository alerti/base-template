import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui";
import { SearchIcon } from "@/components/icons";

const exercises = [
  { name: "Push-ups", details: "Keep your back straight and lower yourself until your chest nearly touches the floor." },
  { name: "Squats", details: "Stand with feet hip-width apart, lower down as if sitting back into a chair." },
  // ... other exercises as provided
];

function ExerciseItem({ exercise, onRemove, onMoveUp, onMoveDown, onChange, index }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Checkbox checked={exercise.completed} onCheckedChange={(checked) => onChange({...exercise, completed: checked})} />
          <label className="ml-2">Completed</label>
        </div>
        <Input type="number" placeholder="Sets" value={exercise.sets} onChange={(e) => onChange({...exercise, sets: e.target.value})} className="w-20 mr-2" />
        <Input type="number" placeholder="Reps" value={exercise.reps} onChange={(e) => onChange({...exercise, reps: e.target.value})} className="w-20" />
        {exercise.details && <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide' : 'Show'} Details</Button>}
        {showDetails && <p className="mt-2">{exercise.details}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button onClick={() => onMoveUp(index)} disabled={index === 0}>Move Up</Button>
          <Button onClick={() => onMoveDown(index)} className="ml-2" disabled={index === exercises.length - 1}>Move Down</Button>
        </div>
        <Button onClick={() => onRemove(index)} variant="destructive">Remove</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [routine, setRoutine] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [customExercise, setCustomExercise] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [restDuration, setRestDuration] = useState('');
  const [error, setError] = useState('');
  
  const addExercise = () => {
    if (selectedExercise || customExercise) {
      const newExercise = selectedExercise ? exercises.find(ex => ex.name === selectedExercise) : { name: customExercise };
      setRoutine([...routine, { ...newExercise, sets: '', reps: '', completed: false, duration: exerciseDuration, rest: restDuration }]);
      setSelectedExercise('');
      setCustomExercise('');
      setExerciseDuration('');
      setRestDuration('');
      setError('');
    }
  };
  
  const validateAndApplySettings = () => {
    if (!/^\d+$/.test(exerciseDuration) || !/^\d+$/.test(restDuration)) {
      setError('Durations must be positive numbers.');
      return;
    }
    setError('');
    // Here you would apply settings to all exercises in routine
  };
  
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Workout Routine Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search or Add Custom Exercise"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              className="mb-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Exercise</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Exercises</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exercises.map(ex => (
                  <DropdownMenuItem key={ex.name} onClick={() => setSelectedExercise(ex.name)}>{ex.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={addExercise} disabled={!selectedExercise && !customExercise}>Add to Routine</Button>
          <div className="mt-4">
            <Input
              type="number"
              placeholder="Exercise Duration (sec)"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(e.target.value)}
            />
            <Input
              type="number"
              className="mt-2"
              placeholder="Rest Duration (sec)"
              value={restDuration}
              onChange={(e) => setRestDuration(e.target.value)}
            />
            <Button onClick={validateAndApplySettings} className="mt-2">Apply Settings</Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>
      
      {routine.map((ex, idx) => (
        <ExerciseItem
          key={idx}
          index={idx}
          exercise={ex}
          onRemove={() => setRoutine(routine.filter((_, i) => i !== idx))}
          onMoveUp={() => {
            if (idx > 0) {
              const newRoutine = [...routine];
              [newRoutine[idx], newRoutine[idx - 1]] = [newRoutine[idx - 1], newRoutine[idx]];
              setRoutine(newRoutine);
            }
          }}
          onMoveDown={() => {
            if (idx < routine.length - 1) {
              const newRoutine = [...routine];
              [newRoutine[idx], newRoutine[idx + 1]] = [newRoutine[idx + 1], newRoutine[idx]];
              setRoutine(newRoutine);
            }
          }}
          onChange={(updatedEx) => {
            const newRoutine = [...routine];
            newRoutine[idx] = updatedEx;
            setRoutine(newRoutine);
          }}
        />
      ))}
    </div>
  );
}