// App.jsx
import React, { useState, useMemo } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  CardFooter, Button, Input, Badge,
  Dialog, DialogContent, DialogTrigger
} from "@/components/ui";
import { Plus, Trash, Edit, X } from 'lucide-react';

const categories = ['Food', 'Travel', 'Entertainment', 'Utilities', 'Other'];

function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };
  
  const removeExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const moveToWishlist = (expense) => {
    setWishlist([...wishlist, expense]);
    removeExpense(expense.id);
  };
  
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp =>
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || exp.category === filterCategory)
    );
  }, [expenses, searchTerm, filterCategory]);
  
  const totalExpenses = useMemo(() => filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0), [filteredExpenses]);
  const averageExpense = useMemo(() => totalExpenses / filteredExpenses.length || 0, [totalExpenses, filteredExpenses.length]);
  
  const openEdit = (expense) => {
    setEditItem(expense);
    setIsDialogOpen(true);
  };
  
  const saveEdit = (updatedExpense) => {
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Expense Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSubmit={addExpense} />
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Input placeholder="Search expenses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded">
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExpenseList
          expenses={filteredExpenses.slice(0, 5)}
          onDelete={removeExpense}
          onEdit={openEdit}
          onMoveToWishlist={moveToWishlist}
          total={totalExpenses}
          average={averageExpense}
        />
        {filteredExpenses.length > 5 &&
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <ExpenseList expenses={filteredExpenses} onDelete={removeExpense} onEdit={openEdit} onMoveToWishlist={moveToWishlist} />
            </DialogContent>
          </Dialog>
        }
        <WishList items={wishlist} />
      </div>
      
      <Button className="mt-4 w-full" onClick={() => setExpenses([])}>Clear All</Button>
    </div>
  );
}

function ExpenseForm({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount) {
      onSubmit({ description, amount: parseFloat(amount), category });
      setDescription(''); setAmount(''); setCategory(categories[0]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <Button type="submit" className="mt-2">Add Expense</Button>
    </form>
  );
}

function ExpenseList({ expenses, onDelete, onEdit, onMoveToWishlist, total, average }) {
  return (
    <Card>
      <CardContent>
        {expenses.map(exp => (
          <div key={exp.id} className="flex justify-between items-center mb-2">
            <span>{exp.description} - ${exp.amount} ({exp.category})</span>
            <div>
              <Button variant="ghost" size="icon" onClick={() => onEdit(exp)}><Edit /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(exp.id)}><Trash /></Button>
              <Button variant="ghost" size="icon" onClick={() => onMoveToWishlist(exp)}><Plus /></Button>
            </div>
          </div>
        ))}
        {expenses.length > 5 && <DialogTrigger asChild><Button>See More</Button></DialogTrigger>}
        <p>Total: ${total.toFixed(2)}</p>
        <p>Average: ${average.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}

function WishList({ items }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Must-Buy List <Badge>{items.length}</Badge></CardTitle>
      </CardHeader>
      <CardContent>
        {items.map(item => <p key={item.id}>{item.description}</p>)}
      </CardContent>
    </Card>
  );
}

export default function App() {
  return <ExpenseManager />;
}