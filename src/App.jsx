import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'General' });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categories = ['General', 'Food', 'Transport', 'Entertainment'];
  
  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({ name: '', amount: '', category: 'General' });
    }
  };
  
  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  const moveToWishlist = (expense) => {
    setWishlist([...wishlist, expense]);
    removeExpense(expense.id);
  };
  
  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (isExpanded || expenses.indexOf(expense) < 5)
  );
  
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const average = expenses.length ? (total / expenses.length).toFixed(2) : 0;
  
  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Expense Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search expenses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-4 space-y-2">
            {filteredExpenses.map((expense, index) => (
              <div key={expense.id} className="flex justify-between items-center">
                <span>{expense.name} - ${expense.amount}</span>
                <div>
                  <Button size="sm" onClick={() => moveToWishlist(expense)}>To Wishlist</Button>
                  <Button size="sm" variant="destructive" onClick={() => removeExpense(expense.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {!isExpanded && expenses.length > 5 &&
              <Button onClick={() => setIsExpanded(true)}>See More</Button>
            }
          </div>
          <div className="mt-4">
            <Input
              placeholder="Expense Name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="mt-2 p-2 border rounded w-full"
            >
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <Button className="mt-2 w-full" onClick={addExpense}>Add Expense</Button>
          </div>
          <div className="mt-4">
            <p>Total: ${total.toFixed(2)}</p>
            <p>Average: ${average}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setExpenses([])} variant="destructive">Clear All</Button>
        </CardFooter>
      </Card>
      
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Must-Buy Wishlist <Badge>{wishlist.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {wishlist.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <Checkbox />
              <span>{item.name} - ${item.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;