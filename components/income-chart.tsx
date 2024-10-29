"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import React from "react";
import { Areachart } from "./area-chart";

type IncomeChartProps = {
  monthlyIncome: number;
  totalExpenses: number;
};

export default function IncomeChart({
  monthlyIncome,
  totalExpenses,
}: IncomeChartProps) {
  const remaining = monthlyIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    return value < 0 ? `-৳${absValue}` : `৳${absValue}`;
  };

  return (
    <Card className="max-w-xl shadow-none shadowBox  mt-5">
      <CardContent>
        <Areachart
          monthlyIncome={monthlyIncome}
          totalExpenses={totalExpenses}
        />
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4 -mt-20">
        <div className="flex w-full items-center gap-2">
          {[
            { label: "Income", value: monthlyIncome },
            { label: "Expense", value: totalExpenses },
            { label: "Remaining", value: remaining },
          ].map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 && (
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              )}
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
                <div
                  className={`flex items-baseline gap-1 text-md font-bold tabular-nums leading-none ${
                    item.value < 0 ? "text-red-500" : ""
                  }`}
                >
                  {formatCurrency(item.value)}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
