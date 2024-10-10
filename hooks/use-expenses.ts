"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

const useExpenses = (selectedMonth: string) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .order("created_at", { ascending: true });

      if (error) throw error;

      setExpenses(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error in fetchExpenses:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    expenses,
    fetchExpenses,
    isLoading,
    error,
    totalExpenses,
    categoryTotals,
  };
};

export default useExpenses;
