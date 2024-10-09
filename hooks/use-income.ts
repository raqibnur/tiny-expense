"use client";

import { useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";

const useIncome = (selectedMonth: string) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [currentIncomeId, setCurrentIncomeId] = useState<number | null>(null);

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

  const handleIncomeEdit = () => {
    setIsEditingIncome(true);
  };

  const handleIncomeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingIncome(false);

    if (monthlyIncome !== null) {
      try {
        const startOfMonth = new Date(selectedMonth + "-01").toISOString();

        if (currentIncomeId) {
          const { error } = await supabase
            .from("income")
            .update({ income: monthlyIncome })
            .eq("id", currentIncomeId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("income")
            .insert({ income: monthlyIncome, created_at: startOfMonth })
            .select();
          if (error) throw error;
          if (data) setCurrentIncomeId(data[0].id);
        }
      } catch (err) {
        console.error("Error updating income:", err);
      }
    }
  };

  return {
    monthlyIncome,
    fetchIncome,
    isEditingIncome,
    handleIncomeEdit,
    handleIncomeSubmit,
    setMonthlyIncome,
  };
};

export default useIncome;
