"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import React from "react";

type IncomeChartProps = {
  monthlyIncome: number;
  totalExpenses: number;
};

export default function IncomeChart({
  monthlyIncome,
  totalExpenses,
}: IncomeChartProps) {
  const remaining = monthlyIncome - totalExpenses;
  const maxValue = Math.max(
    Math.abs(monthlyIncome),
    Math.abs(totalExpenses),
    Math.abs(remaining)
  );

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    return value < 0 ? `-৳${absValue}` : `৳${absValue}`;
  };

  const data = [
    {
      activity: "Income",
      value: (Math.abs(monthlyIncome) / maxValue) * 100,
      label: `৳${monthlyIncome.toFixed(2)}`,
      fill: "hsl(var(--chart-1))",
    },
    {
      activity: "Expenses",
      value: (Math.abs(totalExpenses) / maxValue) * 100,
      label: `৳${totalExpenses.toFixed(2)}`,
      fill: "hsl(var(--chart-2))",
    },
    {
      activity: "Remaining",
      value: (Math.abs(remaining) / maxValue) * 100,
      label: `৳${remaining.toFixed(2)}`,
      fill: "hsl(var(--chart-4))",
    },
  ];

  return (
    <Card className="max-w-xl shadow-none  mt-5">
      <CardContent className="flex gap-4 p-4 pb-2">
        <ChartContainer
          config={{
            Income: { color: "hsl(var(--chart-1))" },
            Expenses: { color: "hsl(var(--chart-2))" },
            Remaining: { color: "hsl(var(--chart-4))" },
          }}
          className="h-[140px] w-full"
        >
          <BarChart
            data={data}
            layout="vertical"
            barSize={32}
            barGap={2}
            margin={{ left: 80, right: 0, top: 0, bottom: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="activity"
              type="category"
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="black"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4">
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
