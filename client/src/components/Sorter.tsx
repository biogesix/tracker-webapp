import { useState } from "react";
import { Category } from "@/utils/types";

interface CategorySorterProps {
  categories: Category[] | undefined;
  onSort: (sortedCategories: Category[] | undefined) => void;
}

const CategorySorter = ({ categories, onSort }: CategorySorterProps) => {
  const [sortOrder, setSortOrder] = useState("budget");
  const [isAscending, setIsAscending] = useState(false);

  const handleSort = (sortBy: string) => {
    setSortOrder(sortBy);
    setIsAscending(sortBy === sortOrder ? !isAscending : false);

    const sortedCategories = categories?.slice().sort((a, b) => {
      if (sortOrder === "budget") {
        return isAscending ? a.budget - b.budget : b.budget - a.budget;
      } else if (sortOrder === "spent") {
        return isAscending
          ? a.amount_spent - b.amount_spent
          : b.amount_spent - a.amount_spent;
      }
      return 0;
    });

    onSort(sortedCategories);
  };

  return (
    <div className="mb-4 flex justify-between">
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => handleSort("budget")}
      >
        Sort by Budget (Highest to Lowest)
      </button>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => handleSort("budget")}
      >
        Sort by Budget (Lowest to Highest)
      </button>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => handleSort("spent")}
      >
        Sort by Spent (Highest to Lowest)
      </button>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => handleSort("spent")}
      >
        Sort by Spent (Lowest to Highest)
      </button>
    </div>
  );
};

export default CategorySorter;
