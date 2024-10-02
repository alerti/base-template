import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Code Plan:
// 1. Define state for expenses, wishlist, and modal visibility.
// 2. Create functions for adding, editing, removing expenses and moving to wishlist.
// 3. Implement filtering and searching functionality.
// 4. Use a dialog for adding/editing expenses to keep the modal open for multiple entries.
// 5. Render expense list with expand functionality and wishlist with badge.
// 6. Ensure mobile responsiveness with Tailwind classes.

function App() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'Other' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];
  
  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses(prev => [...prev, { ...newExpense, id: Date.now() }]);
      setNewExpense({ name: '', amount: '', category: 'Other' });
    }
  };
  
  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  const editExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp));
  };
  
  const moveToWishlist = (id) => {
    const item = expenses.find(exp => exp.id === id);
    if (item) {
      setWishlist(prev => [...prev, item]);
      removeExpense(id);
    }
  };
  
  const clearAll = () => {
    setExpenses([]);
    setWishlist([]);
  };
  
  const totalExpenses = expenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);
  const avgExpense = expenses.length ? (totalExpenses / expenses.length).toFixed(2) : '0.00';
  
  const filteredExpenses = expenses.filter(exp =>
    (filterCategory === 'All' || exp.category === filterCategory) &&
    (exp.name.toLowerCase().includes(searchTerm.toLowerCase()) || exp.amount.toString().includes(searchTerm))
  );
  
  const visibleExpenses = filteredExpenses.slice(0, 5);
  
  return (
    <div className="p-4 sm:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input w-full sm:w-1/4"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <Button onClick={() => setIsModalOpen(true)}>Add Expense</Button>
          </div>
          
          <ScrollArea className="h-64">
            {visibleExpenses.map(exp => (
              <div key={exp.id} className="flex justify-between items-center border-b p-2">
                <span>{exp.name} - ${exp.amount} ({exp.category})</span>
                <div>
                  <Button size="sm" onClick={() => moveToWishlist(exp.id)}>To Wishlist</Button>
                  <Button size="sm" onClick={() => editExpense(exp.id, {name: 'Updated', amount: '0'})}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => removeExpense(exp.id)}>Remove</Button>
                </div>
              </div>
            ))}
            {filteredExpenses.length > 5 &&
              <Button className="mt-2" onClick={() => alert('Show all expenses')}>See More</Button>
            }
          </ScrollArea>
          
          <div className="flex justify-between">
            <span>Total: ${totalExpenses.toFixed(2)}</span>
            <span>Avg: ${avgExpense}</span>
          </div>
          
          <Button onClick={clearAll} variant="destructive">Clear All</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Must-Buy Wishlist <Badge>{wishlist.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {wishlist.map(item => (
            <div key={item.id} className="flex justify-between p-2 border-b">
              <span>{item.name}</span>
              <span>${item.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="expenseName">Name</Label>
            <Input id="expenseName" value={newExpense.name} onChange={e => setNewExpense(prev => ({...prev, name: e.target.value}))} />
            <Label htmlFor="expenseAmount">Amount</Label>
            <Input id="expenseAmount" type="number" value={newExpense.amount} onChange={e => setNewExpense(prev => ({...prev, amount: e.target.value}))} />
            <Label htmlFor="expenseCategory">Category</Label>
            <select
              id="expenseCategory"
              value={newExpense.category}
              onChange={e => setNewExpense(prev => ({...prev, category: e.target.value}))}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <Button onClick={addExpense}>Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;