"use client";

import ExpenseChart from "@/components/expense-chart";
import ExpenseForm from "@/components/expense-form";
import ExpenseList from "@/components/expense-list";
import IncomeDisplay from "@/components/income-display";
import MonthSelector from "@/components/month-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useExpenses from "@/hooks/use-expenses";
import useIncome from "@/hooks/use-income";
import { useEffect, useState } from "react";
const ExpenseTracker = () => {
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
  }, [selectedMonth]);

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
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card className="shadow-none shadowBox">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Family Expense Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            selectedMonth={selectedMonth}
            fetchExpenses={fetchExpenses}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <Card className="shadow-none shadowBox">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                Expenses for{" "}
                {new Date(selectedMonth).toLocaleString("default", {
                  month: "short",
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

        <div>
          <Card className="shadow-none shadowBox">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  Expense Distribution{" "}
                  {new Date(selectedMonth).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <IncomeDisplay
                  isEditingIncome={isEditingIncome}
                  handleIncomeEdit={handleIncomeEdit}
                  handleIncomeSubmit={handleIncomeSubmit}
                  monthlyIncome={monthlyIncome}
                  setMonthlyIncome={setMonthlyIncome}
                  totalExpenses={totalExpenses}
                  displayType="button"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart categoryTotals={categoryTotals} />
            </CardContent>
          </Card>
          <IncomeDisplay
            isEditingIncome={isEditingIncome}
            handleIncomeEdit={handleIncomeEdit}
            handleIncomeSubmit={handleIncomeSubmit}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            totalExpenses={totalExpenses}
            displayType="chart"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
