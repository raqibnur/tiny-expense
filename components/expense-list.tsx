import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

const ExpenseList = ({
  expenses,
  fetchExpenses,
}: {
  expenses: any[];
  fetchExpenses: () => void;
}) => {
  const deleteExpense = async (id: number) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <div
      className="space-y-4 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses recorded yet</p>
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
                ৳{expense.amount.toFixed(2)}
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
  );
};

export default ExpenseList;
