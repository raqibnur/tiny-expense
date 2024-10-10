import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilLine } from "lucide-react";
import { useRef } from "react";
import IncomeChart from "./income-chart";

const IncomeDisplay = ({
  isEditingIncome,
  handleIncomeEdit,
  handleIncomeSubmit,
  monthlyIncome,
  setMonthlyIncome,
  totalExpenses,
  displayType,
}: {
  isEditingIncome: boolean;
  handleIncomeEdit: () => void;
  handleIncomeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  monthlyIncome: number | null;
  setMonthlyIncome: (income: number) => void;
  totalExpenses: number;
  displayType: "button" | "chart";
}) => {
  const incomeInputRef = useRef<HTMLInputElement>(null);

  if (displayType === "button") {
    return (
      <div className="flex items-center">
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
          <Button variant="outline" size="sm" onClick={handleIncomeEdit}>
            Income: ৳{monthlyIncome?.toFixed(0) || "0.00"}
            <PencilLine className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {monthlyIncome !== null && (
        <IncomeChart
          monthlyIncome={monthlyIncome}
          totalExpenses={totalExpenses}
        />
      )}
    </div>
  );
};

export default IncomeDisplay;
