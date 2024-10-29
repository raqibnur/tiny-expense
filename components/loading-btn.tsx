"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function Button14({
  addExpense,
}: {
  addExpense: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      await addExpense(); // Call the addExpense function
    } catch (err) {
      setError("Failed to add expense. Please try again."); // Set error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      data-loading={isLoading}
      className="group relative disabled:opacity-100"
    >
      <span className="group-data-[loading=true]:text-transparent">
        Add Expense
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle
            className="animate-spin"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      )}
    </Button>
  );
}
