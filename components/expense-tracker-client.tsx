"use client";

import { useState, useEffect } from "react";
import ExpenseList from "@/components/expense-list";
import ExpenseChart from "@/components/expense-chart";
import IncomeDisplay from "@/components/income-display";
import MonthSelector from "@/components/month-selector";
import useExpenses from "@/hooks/use-expenses";
import useIncome from "@/hooks/use-income";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExpenseTrackerClient = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const {
    expenses,
    fetchExpenses,
    isLoading,
    error,
    totalExpenses,
    categoryTotals,
  } = useExpenses(selectedMonth);
  const {
    monthlyIncome,
    fetchIncome,
    isEditingIncome,
    handleIncomeEdit,
    handleIncomeSubmit,
    setMonthlyIncome,
  } = useIncome(selectedMonth);

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, [selectedMonth, fetchExpenses, fetchIncome]);

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

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              Expenses for{" "}
              {new Date(selectedMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <MonthSelector
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList expenses={expenses} fetchExpenses={fetchExpenses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Expense Distribution for{" "}
            {new Date(selectedMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseChart categoryTotals={categoryTotals} />
          <IncomeDisplay
            isEditingIncome={isEditingIncome}
            handleIncomeEdit={handleIncomeEdit}
            handleIncomeSubmit={handleIncomeSubmit}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            totalExpenses={totalExpenses}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTrackerClient;
