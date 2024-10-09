import { Input } from "@/components/ui/input";

const MonthSelector = ({
  selectedMonth,
  setSelectedMonth,
}: {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}) => {
  return (
    <Input
      type="month"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="w-40"
    />
  );
};

export default MonthSelector;
