// App.jsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Dialog
} from "@/components/ui";
import { Plus, X, Trash, ListChecks, ShoppingCart } from "lucide-react";

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];

function ExpenseItem({ expense, onEdit, onDelete, onMoveToWishlist }) {
  return (
    <Card className="mb-2">
      <CardContent>
        <div className="flex justify-between">
          <span>{expense.name}</span>
          <span>${expense.amount}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>{expense.category}</span>
          <div>
            <Button variant="outline" size="icon" onClick={() => onEdit(expense)}>
              <Plus className="rotate-45" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDelete(expense.id)}>
              <Trash />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onMoveToWishlist(expense)}>
              <ShoppingCart />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({ name: '', amount: '', category: 'Food' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };
  
  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };
  
  const deleteExpense = (id) => setExpenses(expenses.filter(e => e.id !== id));
  
  const moveToWishlist = (expense) => {
    setWishlist([...wishlist, expense]);
    deleteExpense(expense.id);
  };
  
  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = expenses.length ? (totalExpenses / expenses.length).toFixed(2) : 0;
  
  return (
    <div className="container mx-auto p-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Card>
          <CardHeader>
            <CardTitle>Add/Edit Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={currentExpense.name} onChange={(e) => setCurrentExpense({...currentExpense, name: e.target.value})} placeholder="Item name" />
            <Input type="number" value={currentExpense.amount} onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})} placeholder="Amount" className="my-2" />
            <select value={currentExpense.category} onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})} className="p-2 border rounded w-full">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => {
              currentExpense.id ? updateExpense(currentExpense) : addExpense(currentExpense);
              setCurrentExpense({ name: '', amount: '', category: 'Food' });
            }}>Save</Button>
            <Button variant="destructive" onClick={() => setIsModalOpen(false)} className="ml-2">Close</Button>
          </CardFooter>
        </Card>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredExpenses.slice(0, 5).map(expense => (
                <ExpenseItem key={expense.id} expense={expense} onEdit={(exp) => { setIsModalOpen(true); setCurrentExpense(exp); }} onDelete={deleteExpense} onMoveToWishlist={moveToWishlist} />
              ))}
              {expenses.length > 5 && <Button onClick={() => alert('Show all expenses logic here')}>See More</Button>}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsModalOpen(true)}>Add Expense</Button>
              <Button variant="destructive" onClick={() => setExpenses([])}>Clear All</Button>
            </CardFooter>
          </Card>
          <div className="mt-4 text-center">
            <p>Total: ${totalExpenses.toFixed(2)}</p>
            <p>Average: ${averageExpense}</p>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Must-Buy Wishlist <Badge>{wishlist.length}</Badge></CardTitle>
            </CardHeader>
            <CardContent>
              {wishlist.map(item => <div key={item.id}>{item.name} - ${item.amount}</div>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;