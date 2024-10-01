// App.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories = ['Food', 'Travel', 'Entertainment', 'Utilities', 'Other'];

function generateRandomExpense() {
  return {
    title: `Expense ${Math.floor(Math.random() * 1000)}`,
    amount: (Math.random() * 1000).toFixed(2),
    category: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0]
  };
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAll, setShowAll] = useState(false);
  
  const addRandomExpense = () => {
    setExpenses(prev => [...prev, generateRandomExpense()]);
  };
  
  const clearAll = () => {
    setExpenses([]);
    setWishlist([]);
  };
  
  const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = expenses.length ? (totalExpense / expenses.length).toFixed(2) : 0;
  
  const moveToWishlist = (expense) => {
    setWishlist(prev => [...prev, expense]);
    setExpenses(prev => prev.filter(e => e !== expense));
  };
  
  const removeFromList = (item, listSetter) => {
    listSetter(prev => prev.filter(i => i !== item));
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6">
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
              <CardTitle>Generate Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={addRandomExpense}>Add Random Expense</Button>
              <Button className="ml-2" onClick={clearAll}>Clear All</Button>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-4">
            {(showAll ? expenses : expenses.slice(0, 5)).map((expense, idx) => (
              <ExpenseItem key={idx} expense={expense} onMove={moveToWishlist} onRemove={() => removeFromList(expense, setExpenses)} />
            ))}
            {expenses.length > 5 && (
              <Button onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show Less' : 'See More'}
              </Button>
            )}
            <div>
              <p>Total Expense: ${totalExpense.toFixed(2)}</p>
              <p>Average Expense: ${averageExpense}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="wishlist">
          <div className="space-y-4">
            {wishlist.map((item, idx) => (
              <WishlistItem key={idx} item={item} onRemove={() => removeFromList(item, setWishlist)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExpenseItem({ expense, onMove, onRemove }) {
  return (
    <Card>
      <CardContent>
        <h3>{expense.title}</h3>
        <p>Amount: ${expense.amount}</p>
        <p>Category: {expense.category}</p>
        <p>Date: {expense.date}</p>
        <Button size="sm" onClick={() => onMove(expense)}>Add to Wishlist</Button>
        <Button size="sm" variant="destructive" className="ml-2" onClick={onRemove}>Remove</Button>
      </CardContent>
    </Card>
  );
}

function WishlistItem({ item, onRemove }) {
  return (
    <Card>
      <CardContent>
        <h3>{item.title}</h3>
        <p>Amount: ${item.amount}</p>
        <Button size="sm" variant="destructive" onClick={onRemove}>Remove</Button>
      </CardContent>
    </Card>
  );
}