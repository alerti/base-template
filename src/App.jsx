// App.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Code Plan:
// 1. Define state for expenses, wishlist, and filter/search functionalities.
// 2. Create components for ExpenseItem, WishlistItem, and main ExpenseManager.
// 3. Implement functions for adding, editing, deleting, and moving items between lists.
// 4. Use Tailwind for styling and ensure responsiveness.
// 5. Utilize Shadcn components for UI elements.

const ExpenseItem = ({ item, onEdit, onDelete, onMoveToWishlist }) => (
  <Card className="mb-2">
    <CardHeader>
      <CardTitle>{item.name}</CardTitle>
      <CardDescription>{item.category} - ${item.amount}</CardDescription>
    </CardHeader>
    <CardFooter className="flex justify-between">
      <Button onClick={() => onEdit(item)}>Edit</Button>
      <Button onClick={() => onDelete(item.id)} variant="destructive">Delete</Button>
      <Button onClick={() => onMoveToWishlist(item)}>Move to Wishlist</Button>
    </CardFooter>
  </Card>
);

const WishlistItem = ({ item, onRemove }) => (
  <Card className="mb-2">
    <CardContent className="flex justify-between items-center">
      <span>{item.name}</span>
      <Button onClick={() => onRemove(item.id)} variant="destructive">Remove</Button>
    </CardContent>
  </Card>
);

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({ name: '', amount: '', category: '' });
    }
  };
  
  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp));
  };
  
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const moveToWishlist = (item) => {
    setWishlist([...wishlist, item]);
    deleteExpense(item.id);
  };
  
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };
  
  const clearAllExpenses = () => {
    setExpenses([]);
  };
  
  const filteredExpenses = expenses.filter(exp =>
    (filterCategory === 'all' || exp.category === filterCategory) &&
    (exp.name.toLowerCase().includes(searchTerm.toLowerCase()) || exp.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const averageAmount = expenses.length ? (totalAmount / expenses.length).toFixed(2) : 0;
  
  return (
    <div className="container mx-auto px-4 py-8 sm:max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Expense Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              value={newExpense.name}
              onChange={e => setNewExpense({...newExpense, name: e.target.value})}
              placeholder="Expense Name"
              className="mb-2"
            />
            <Input
              value={newExpense.amount}
              onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
              placeholder="Amount"
              type="number"
              className="mb-2"
            />
            <Input
              value={newExpense.category}
              onChange={e => setNewExpense({...newExpense, category: e.target.value})}
              placeholder="Category"
            />
            <Button onClick={addExpense} className="mt-2 w-full">Add Expense</Button>
          </div>
          
          <div className="mb-4">
            <Input
              placeholder="Search expenses..."
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <select
              onChange={e => setFilterCategory(e.target.value)}
              value={filterCategory}
              className="p-2 border rounded w-full"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <ScrollArea className="h-64 mb-4">
            {filteredExpenses.slice(0, isExpanded ? undefined : 5).map(exp => (
              <ExpenseItem
                key={exp.id}
                item={exp}
                onEdit={updateExpense}
                onDelete={deleteExpense}
                onMoveToWishlist={moveToWishlist}
              />
            ))}
          </ScrollArea>
          
          {expenses.length > 5 && (
            <Button onClick={() => setIsExpanded(!isExpanded)} className="mb-4">
              {isExpanded ? "See Less" : "See More"}
            </Button>
          )}
          
          <div>
            <p>Total: ${totalAmount.toFixed(2)}</p>
            <p>Average: ${averageAmount}</p>
          </div>
          
          <Button onClick={clearAllExpenses} variant="destructive" className="mt-2">Clear All Expenses</Button>
        </CardContent>
      </Card>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Must-Buy Wishlist <Badge>{wishlist.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {wishlist.map(item => (
            <WishlistItem key={item.id} item={item} onRemove={removeFromWishlist} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}