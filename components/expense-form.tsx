import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/app/lib/supabase";
import Button14 from "./loading-btn";

const ExpenseForm = ({
  selectedMonth,
  fetchExpenses,
}: {
  selectedMonth: string;
  fetchExpenses: () => void;
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "Groceries",
    "Utilities",
    "Transportation",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other",
  ];

  const addExpense = async () => {
    if (!description || !amount || !category) return;

    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
    };

    try {
      const { error } = await supabase.from("expenses").insert(newExpense);

      if (error) throw error;

      fetchExpenses();
      // Clear input fields
      setDescription("");
      setAmount("");
      setCategory("");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
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
      {/* <Button onClick={addExpense}>Add Expense</Button> */}
      <Button14 addExpense={addExpense} />
    </div>
  );
};

export default ExpenseForm;
