import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
  const titles = ['Lunch', 'Taxi', 'Movie Ticket', 'Groceries', 'Coffee', 'Book'];
  
  const generateRandomExpense = () => {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomAmount = (Math.random() * 100 + 1).toFixed(2);
    const randomDate = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      title: randomTitle,
      amount: parseFloat(randomAmount),
      date: randomDate,
      category: randomCategory,
    };
  };
  
  const addRandomExpense = () => {
    const newExpense = generateRandomExpense();
    setExpenses([...expenses, newExpense]);
    showNotification('Expense added successfully!', 'success');
  };
  
  const clearExpenses = () => {
    setExpenses([]);
    setShowAllExpenses(false);
    showNotification('All expenses cleared!', 'info');
  };
  
  const getTotalExpense = () => {
    return expenses
      .reduce((total, expense) => total + expense.amount, 0)
      .toFixed(2);
  };
  
  const getAverageExpense = () => {
    if (expenses.length === 0) return '0.00';
    const average =
      expenses.reduce((total, expense) => total + expense.amount, 0) /
      expenses.length;
    return average.toFixed(2);
  };
  
  const addToWishlist = (item) => {
    setWishlist([...wishlist, item]);
    showNotification(`${item.title} added to wishlist!`, 'success');
  };
  
  const removeFromWishlist = (index) => {
    const removedItem = wishlist[index];
    const updatedWishlist = [...wishlist];
    updatedWishlist.splice(index, 1);
    setWishlist(updatedWishlist);
    showNotification(`${removedItem.title} removed from wishlist!`, 'info');
  };
  
  const removeExpense = (index) => {
    const removedExpense = expenses[index];
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
    showNotification(`${removedExpense.title} removed from expenses!`, 'info');
  };
  
  const displayedExpenses = showAllExpenses ? expenses : expenses.slice(0, 5);
  
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}>
          {notification.message}
        </div>
      )}
      
      <Card className="w-full max-w-md mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-indigo-600 text-2xl">
            Expense Manager
          </CardTitle>
          <CardDescription className="text-center">
            Automatically generate expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button className="w-full" onClick={addRandomExpense}>
              Add Expense
            </Button>
            <Button variant="destructive" onClick={clearExpenses}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for navigation */}
      <Tabs defaultValue="expenses" className="w-full max-w-md">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="wishlist">
            Must-buy Items
            {wishlist.length > 0 && (
              <Badge variant="dot" className="ml-2">
                {wishlist.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card className="w-full mb-6 shadow-md">
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>
                Total: ${getTotalExpense()} | Average: ${getAverageExpense()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <ul className="space-y-3">
                  {displayedExpenses.map((expense, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 border rounded bg-white"
                    >
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {expense.title}
                        </h3>
                        <p className="text-sm text-gray-500">{expense.date}</p>
                        <p className="text-sm text-gray-500">
                          {expense.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <p className="font-semibold text-indigo-600">
                          ${expense.amount.toFixed(2)}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => addToWishlist(expense)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Add to Wishlist
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeExpense(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No expenses yet.</p>
              )}
              {/* Show "See More" button if expenses exceed 5 */}
              {expenses.length > 5 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllExpenses(!showAllExpenses)}
                  >
                    {showAllExpenses ? 'Show Less' : 'See More'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card className="w-full mb-6 shadow-md">
            <CardHeader>
              <CardTitle>Must-buy Items</CardTitle>
            </CardHeader>
            <CardContent>
              {wishlist.length > 0 ? (
                <ul className="space-y-3">
                  {wishlist.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 border rounded bg-white"
                    >
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">{item.date}</p>
                        <p className="text-sm text-gray-500">
                          {item.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <p className="font-semibold text-indigo-600">
                          ${item.amount.toFixed(2)}
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromWishlist(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">
                  No items in your wishlist.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseManager;
