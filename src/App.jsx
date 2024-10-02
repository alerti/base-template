import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingIndex, setEditingIndex] = useState(null);
  
  const categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Other',
  ];
  
  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    date: '',
    category: 'Food',
    notes: '',
  });
  
  const resetExpenseForm = () => {
    setExpenseForm({
      title: '',
      amount: '',
      date: '',
      category: 'Food',
      notes: '',
    });
    setEditingIndex(null);
  };
  
  const addExpense = () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.date) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    const newExpense = {
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
    };
    
    if (editingIndex !== null) {
      // Editing existing expense
      const updatedExpenses = [...expenses];
      updatedExpenses[editingIndex] = newExpense;
      setExpenses(updatedExpenses);
      showNotification('Expense updated successfully!', 'success');
    } else {
      // Adding new expense
      setExpenses([...expenses, newExpense]);
      showNotification('Expense added successfully!', 'success');
    }
    
    resetExpenseForm();
  };
  
  const editExpense = (index) => {
    const expenseToEdit = expenses[index];
    setExpenseForm({
      title: expenseToEdit.title,
      amount: expenseToEdit.amount.toString(),
      date: expenseToEdit.date,
      category: expenseToEdit.category || 'Food',
      notes: expenseToEdit.notes || '',
    });
    setEditingIndex(index);
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
  
  const displayedExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const limitedExpenses = displayedExpenses.slice(0, 5);
  
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Calculate monthly expenses
  const getMonthlyExpenses = () => {
    const monthlyExpenses = {};
    
    expenses.forEach((expense) => {
      const month = expense.date.substring(0, 7); // YYYY-MM
      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = {
          total: 0,
          count: 0,
        };
      }
      monthlyExpenses[month].total += expense.amount;
      monthlyExpenses[month].count += 1;
    });
    
    return monthlyExpenses;
  };
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg text-white ${
            notification.type === 'success'
              ? 'bg-green-500'
              : notification.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      {/* Main Card */}
      <Card className="w-full max-w-md mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-indigo-600 text-2xl">
            Expense Manager
          </CardTitle>
          <CardDescription className="text-center">
            Keep track of your expenses.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Tabs for navigation */}
      <Tabs defaultValue="expenses" className="w-full max-w-md">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="wishlist">
            Must-buy Items
            {wishlist.length > 0 && (
              <Badge variant="dot" className="ml-2">
                {wishlist.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
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
              {/* Search and Filter */}
              <div className="flex space-x-2 mb-4">
                <Select
                  value={filterCategory}
                  onValueChange={(value) => setFilterCategory(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {displayedExpenses.length > 0 ? (
                <>
                  <div
                    className="space-y-3 overflow-y-auto"
                    style={{ maxHeight: showAllExpenses ? 'none' : '300px' }}
                  >
                    {(showAllExpenses ? displayedExpenses : limitedExpenses).map(
                      (expense, index) => (
                        <div
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
                            {expense.notes && (
                              <p className="text-sm text-gray-600">
                                {expense.notes}
                              </p>
                            )}
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
                                variant="outline"
                                onClick={() => editExpense(index)}
                              >
                                Edit
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
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Show More / Show Less Button */}
                  {displayedExpenses.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllExpenses(!showAllExpenses)}
                      >
                        {showAllExpenses ? 'Short list' : 'Long List'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500">No expenses yet.</p>
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
                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.date}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-600">{item.notes}</p>
                        )}
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
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card className="w-full mb-6 shadow-md">
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <ul className="space-y-3">
                  {Object.entries(getMonthlyExpenses()).map(
                    ([month, data], index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 border rounded bg-white"
                      >
                        <div>
                          <h3 className="font-bold text-gray-800">{month}</h3>
                          <p className="text-sm text-gray-500">
                            {data.count} expenses
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-indigo-600">
                            Total: ${data.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Average: ${(data.total / data.count).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-center text-gray-500">
                  No expenses to summarize.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Expense and Clear All Buttons */}
      <div className="w-full max-w-md mt-4 flex space-x-2">
        {/* Add Expense Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              {editingIndex !== null ? 'Edit Expense' : 'Add New Expense'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Edit Expense' : 'Add Expense'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Expense title"
                  value={expenseForm.title}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Amount"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={expenseForm.category}
                  onValueChange={(value) =>
                    setExpenseForm({ ...expenseForm, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category, idx) => (
                      <SelectItem key={idx} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes (optional)"
                  value={expenseForm.notes}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetExpenseForm}>
                  Cancel
                </Button>
                <Button onClick={addExpense}>
                  {editingIndex !== null ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Clear All Expenses Button */}
        <Button
          variant="destructive"
          onClick={clearExpenses}
          className="w-full"
        >
          Clear All Expenses
        </Button>
      </div>
    </div>
  );
};

export default ExpenseManager;
