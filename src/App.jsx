import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  CardFooter, Button, Input, Checkbox, Select, Option
} from "@/components/ui";

const exercises = [
  { name: "Push-ups", details: "Keep your back straight and lower yourself until your chest nearly touches the floor." },
  { name: "Squats", details: "Stand with feet hip-width apart, lower down as if sitting back into a chair." },
  //... other exercises
];

function WorkoutRoutineBuilder() {
  const [routine, setRoutine] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [customExercise, setCustomExercise] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [exerciseTime, setExerciseTime] = useState('');
  const [restTime, setRestTime] = useState('');
  
  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const addExercise = () => {
    if (selectedExercise || customExercise) {
      const newExercise = {
        name: selectedExercise || customExercise,
        sets: 1,
        reps: '',
        completed: false,
        exerciseTime: parseInt(exerciseTime) || 0,
        restTime: parseInt(restTime) || 0,
        details: exercises.find(ex => ex.name === selectedExercise)?.details || ''
      };
      setRoutine([...routine, newExercise]);
      setSelectedExercise('');
      setCustomExercise('');
      setExerciseTime('');
      setRestTime('');
    }
  };
  
  const moveExercise = (index, direction) => {
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < routine.length - 1)) {
      let newRoutine = [...routine];
      [newRoutine[index], newRoutine[index + (direction === 'up' ? -1 : 1)]] =
        [newRoutine[index + (direction === 'up' ? -1 : 1)], newRoutine[index]];
      setRoutine(newRoutine);
    }
  };
  
  const validateTime = (value) => /^\d+$/.test(value) && parseInt(value) > 0;
  
  return (
    <div className="container mx-auto p-4 space-y-4 dark:bg-gray-800 dark:text-white">
      <Card>
        <CardHeader>
          <CardTitle>Build Your Workout Routine</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Input placeholder="Search exercises" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
            <Option value="">Select an exercise</Option>
            {filteredExercises.map(ex => <Option key={ex.name} value={ex.name}>{ex.name}</Option>)}
          </Select>
          <Input placeholder="Or add custom exercise" value={customExercise} onChange={(e) => setCustomExercise(e.target.value)} />
          <div>
            <Input type="number" placeholder="Exercise Time (sec)" value={exerciseTime} onChange={(e) => setExerciseTime(e.target.value)} />
            <Input type="number" placeholder="Rest Time (sec)" value={restTime} onChange={(e) => setRestTime(e.target.value)} />
          </div>
          <Button disabled={!selectedExercise && !customExercise} onClick={addExercise}>Add to Routine</Button>
        </CardContent>
      </Card>
      
      {routine.map((ex, index) => (
        <Card key={index} className="mb-2">
          <CardContent>
            <h3>{ex.name}</h3>
            <Checkbox checked={ex.completed} onChange={() => {
              let newRoutine = [...routine];
              newRoutine[index].completed = !newRoutine[index].completed;
              setRoutine(newRoutine);
            }}>Completed</Checkbox>
            <Input type="number" placeholder="Sets" value={ex.sets} onChange={(e) => {
              let newRoutine = [...routine];
              newRoutine[index].sets = e.target.value;
              setRoutine(newRoutine);
            }} />
            <Input placeholder="Reps" value={ex.reps} onChange={(e) => {
              let newRoutine = [...routine];
              newRoutine[index].reps = e.target.value;
              setRoutine(newRoutine);
            }} />
            {ex.details && <Button onClick={() => alert(ex.details)}>Show Details</Button>}
            <div className="mt-2">
              <Button disabled={index === 0} onClick={() => moveExercise(index, 'up')}>Move Up</Button>
              <Button disabled={index === routine.length - 1} onClick={() => moveExercise(index, 'down')}>Move Down</Button>
              <Button onClick={() => setRoutine(routine.filter((_, i) => i !== index))}>Remove</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  return <WorkoutRoutineBuilder />;
}