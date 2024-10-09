"use client";

import { supabase } from "@/app/lib/supabase";

import { useState, useEffect, useRef } from "react";
import { PlusCircle, Trash2, DollarSign, PieChart, Edit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart as ReChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Define types inline
type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  created_at: string;
  user_id: string;
};

type NewExpense = {
  description: string;
  amount: number;
  category: string;
};

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // Default to current month

  const categories = [
    "Groceries",
    "Utilities",
    "Transportation",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other",
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
  ];

  const [quickExpense, setQuickExpense] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [currentIncomeId, setCurrentIncomeId] = useState<number | null>(null);
  const incomeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExpenses();
    const subscription = supabase
      .channel("expenses")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        fetchExpenses
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  useEffect(() => {
    fetchIncome();
  }, [selectedMonth]);

  const fetchExpenses = async () => {
    try {
      const startOfMonth = new Date(selectedMonth + "-01");
      const endOfMonth = new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth() + 1,
        0
      );

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .gte("created_at", startOfMonth.toISOString())
        .lt("created_at", endOfMonth.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched expenses:", data);
      setExpenses(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error in fetchExpenses:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const fetchIncome = async () => {
    try {
      const startOfMonth = new Date(selectedMonth + "-01");
      const endOfMonth = new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth() + 1,
        0
      );

      const { data, error } = await supabase
        .from("income")
        .select("*")
        .gte("created_at", startOfMonth.toISOString())
        .lt("created_at", endOfMonth.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setMonthlyIncome(data[0].income);
        setCurrentIncomeId(data[0].id);
      } else {
        setMonthlyIncome(null);
        setCurrentIncomeId(null);
      }
    } catch (err) {
      console.error("Error fetching income:", err);
    }
  };

  const addExpense = async () => {
    if (!description || !amount || !category) return;

    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
      created_at: new Date(selectedMonth).toISOString(), // Use the first day of the selected month
    };

    try {
      const { error } = await supabase.from("expenses").insert(newExpense);

      if (error) throw error;

      // Handle successful insertion
      // console.log("Expense added:", data);
      fetchExpenses(); // Refresh the list of expenses
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err instanceof Error ? err.message : "Failed to add expense");
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      // Fetch updated expenses
      fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    }
  };

  const handleIncomeEdit = () => {
    setIsEditingIncome(true);
    setTimeout(() => incomeInputRef.current?.focus(), 0);
  };

  const handleIncomeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingIncome(false);

    if (monthlyIncome !== null) {
      try {
        const startOfMonth = new Date(selectedMonth + "-01").toISOString();

        if (currentIncomeId) {
          // Update existing entry
          const { error } = await supabase
            .from("income")
            .update({ income: monthlyIncome })
            .eq("id", currentIncomeId);

          if (error) throw error;
        } else {
          // Insert new entry
          const { data, error } = await supabase
            .from("income")
            .insert({ income: monthlyIncome, created_at: startOfMonth })
            .select();

          if (error) throw error;
          if (data) setCurrentIncomeId(data[0].id);
        }

        console.log("Income updated successfully");
      } catch (err) {
        console.error("Error updating income:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update income"
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Family Expense Tracker
          </CardTitle>
          <CardDescription>
            Keep track of your family's expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-32"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addExpense}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Expenses for{" "}
                {new Date(selectedMonth).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-40"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <p className="text-center text-gray-500">
                  No expenses recorded yet
                </p>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {expense.category} •{" "}
                        {new Date(expense.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {expense.amount.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Expense Distribution for{" "}
              {new Date(selectedMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {expenses.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Add expenses to see distribution
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </ReChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center">
                {isEditingIncome ? (
                  <form
                    onSubmit={handleIncomeSubmit}
                    className="flex items-center"
                  >
                    <Input
                      type="number"
                      ref={incomeInputRef}
                      value={monthlyIncome || ""}
                      onChange={(e) =>
                        setMonthlyIncome(parseFloat(e.target.value))
                      }
                      className="w-32 mr-2"
                      placeholder="Monthly Income"
                    />
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </form>
                ) : (
                  <>
                    <p className="text-lg font-semibold mr-2">
                      Monthly Income: ৳{monthlyIncome?.toFixed(2) || "0.00"}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleIncomeEdit}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-lg font-semibold mt-2">
                Total Expenses: ৳{totalExpenses.toFixed(2)}
              </p>
              {monthlyIncome !== null && (
                <p className="text-lg font-semibold mt-2">
                  Remaining: ৳{(monthlyIncome - totalExpenses).toFixed(2)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;
