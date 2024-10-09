import ExpenseForm from "@/components/expense-form";
import ExpenseTrackerClient from "@/components/expense-tracker-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpenseTracker() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Family Expense Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
        </CardContent>
      </Card>

      <ExpenseTrackerClient />
    </div>
  );
}
