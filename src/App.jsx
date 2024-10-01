import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

function generateRandomExpense() {
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Misc'];
  return {
    id: Date.now() + Math.random(),
    title: `Expense ${Math.floor(Math.random() * 1000)}`,
    amount: Math.floor(Math.random() * 1000) + 1,
    category: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(Date.now() - Math.random() * (1e+12)).toISOString().split('T')[0],
  };
}

function ExpenseList({ expenses, onRemove, onMoveToWishlist }) {
  const [visibleCount, setVisibleCount] = useState(5);
  const showMore = expenses.length > 5;
  
  return (
    <div className="space-y-4">
      {expenses.slice(0, visibleCount).map(expense => (
        <Card key={expense.id}>
          <CardHeader>
            <CardTitle>{expense.title}</CardTitle>
            <CardDescription>{expense.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Amount: ${expense.amount}</p>
            <p>Category: {expense.category}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => onRemove(expense.id)}>Remove</Button>
            <Button onClick={() => onMoveToWishlist(expense)} variant="outline">Add to Wishlist</Button>
          </CardFooter>
        </Card>
      ))}
      {showMore &&
        <Button onClick={() => setVisibleCount(prev => prev === 5 ? expenses.length : 5)}>
          {visibleCount === 5 ? 'See More' : 'See Less'}
        </Button>
      }
    </div>
  );
}

function Wishlist({ items, onRemove }) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <p>${item.amount}</p>
            <Button onClick={() => onRemove(item.id)}>Remove</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [tab, setTab] = useState('expenses');
  
  useEffect(() => {
    if (expenses.length === 0) {
      const initialExpenses = Array.from({length: 10}, generateRandomExpense);
      setExpenses(initialExpenses);
    }
  }, []);
  
  const addRandomExpense = () => {
    setExpenses(prev => [...prev, generateRandomExpense()]);
  };
  
  const clearAll = () => {
    setExpenses([]);
    setWishlist([]);
  };
  
  const moveToWishlist = (expense) => {
    setWishlist(prev => [...prev, expense]);
    setExpenses(prev => prev.filter(e => e.id !== expense.id));
  };
  
  const removeFromList = (id, fromWishlist = false) => {
    if (fromWishlist) {
      setWishlist(prev => prev.filter(item => item.id !== id));
    } else {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }
  };
  
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenses.length ? (totalExpense / expenses.length).toFixed(2) : 0;
  
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="wishlist">
            Must-buy Items
            {wishlist.length > 0 && <Badge className="ml-2">{wishlist.length}</Badge>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={addRandomExpense}>Add Random Expense</Button>
                <Button onClick={clearAll} variant="destructive" className="ml-2">Clear All</Button>
              </div>
              <ExpenseList expenses={expenses} onRemove={removeFromList} onMoveToWishlist={moveToWishlist} />
              <div className="mt-4">
                <p>Total Expenses: ${totalExpense}</p>
                <p>Average Expense: ${averageExpense}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wishlist">
          <Wishlist items={wishlist} onRemove={item => removeFromList(item.id, true)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}