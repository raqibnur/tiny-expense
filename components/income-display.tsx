import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { useRef } from "react";

const IncomeDisplay = ({
  isEditingIncome,
  handleIncomeEdit,
  handleIncomeSubmit,
  monthlyIncome,
  setMonthlyIncome,
  totalExpenses,
}: {
  isEditingIncome: boolean;
  handleIncomeEdit: () => void;
  handleIncomeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  monthlyIncome: number | null;
  setMonthlyIncome: (income: number) => void;
  totalExpenses: number;
}) => {
  const incomeInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-4 text-center">
      <div className="flex items-center justify-center">
        {isEditingIncome ? (
          <form onSubmit={handleIncomeSubmit} className="flex items-center">
            <Input
              type="number"
              ref={incomeInputRef}
              value={monthlyIncome || ""}
              onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
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
            <Button variant="ghost" size="sm" onClick={handleIncomeEdit}>
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
  );
};

export default IncomeDisplay;
