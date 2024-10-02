// App.jsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, Badge, Alert
} from "@/components/ui";
import { PlusIcon, TrashIcon, StarIcon } from "@/components/icons";

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '' });
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  
  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({ name: '', amount: '', category: '' });
    }
  };
  
  const removeExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const moveToWishlist = (expense) => {
    setWishlist([...wishlist, expense]);
    removeExpense(expense.id);
  };
  
  const filteredExpenses = expenses
    .filter(exp => exp.category.includes(filter) && exp.name.toLowerCase().includes(search.toLowerCase()));
  
  const total = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const average = total / (filteredExpenses.length || 1);
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={newExpense.name} onChange={(e) => setNewExpense({...newExpense, name: e.target.value})} placeholder="Expense Name" />
            <Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} placeholder="Amount" />
            <Input value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})} placeholder="Category" />
            <Button onClick={addExpense}><PlusIcon className="mr-2 h-4 w-4" /> Add Expense</Button>
          </div>
          <div className="mt-4">
            <Input placeholder="Search expenses" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Input placeholder="Filter by category" value={filter} onChange={(e) => setFilter(e.target.value)} className="mt-2" />
          </div>
          <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {filteredExpenses.slice(0, 5).map((exp, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{exp.name} - ${exp.amount} ({exp.category})</span>
                <div>
                  <Button variant="outline" size="icon" onClick={() => moveToWishlist(exp)}><StarIcon /></Button>
                  <Button variant="destructive" size="icon" onClick={() => removeExpense(exp.id)}><TrashIcon /></Button>
                </div>
              </li>
            ))}
            {filteredExpenses.length > 5 &&
              <Button className="w-full">See More</Button>}
          </ul>
          <div className="mt-4">
            <p>Total: ${total.toFixed(2)}</p>
            <p>Average: ${average.toFixed(2)}</p>
            <Button onClick={() => setExpenses([])} className="mt-2 bg-red-500 hover:bg-red-600">Clear All</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Must-Buy Wishlist <Badge>{wishlist.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {wishlist.map((item, idx) => <li key={idx}>{item.name} - ${item.amount}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseManager;