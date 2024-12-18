import { useState } from "react";
import { Category } from "@/utils/types";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ListFilter,
} from "lucide-react";

interface CategorySorterProps {
  categories: Category[] | undefined;
  onSort: (sortedCategories: Category[]) => void;
}

const CategorySorter = ({ categories, onSort }: CategorySorterProps) => {
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    handleSort();
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(event.target.value);
    handleSort();
  };

  const handleSort = () => {
    if (sortBy === "none") {
      onSort(categories || []);
      return;
    }
    const isAscending = sortOrder === "asc";

    const sortedCategories = categories?.slice().sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "budget":
          comparison = a.budget - b.budget;
          break;
        case "spent":
          comparison = a.amount_spent - b.amount_spent;
          break;
        case "left":
          comparison = a.amount_left - b.amount_left;
          break;
      }
      return isAscending ? comparison : -comparison;
    });
    onSort(sortedCategories || []);
  };

  const isDefault = sortBy === "none";

  return (
    <form className="mb-4 flex">
      <div className="flex items-center gap-2">
        <ListFilter />
        <label htmlFor="sortBySelect" className="mr-2 font-bold">
          Sort By
        </label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={handleSortChange}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold text-white`}
          style={{ backgroundColor: "#729688" }}
        >
          <option value="none" className="bg-white text-black">
            None
          </option>
          <option value="budget" className="bg-white text-black">
            Budget
          </option>
          <option value="spent" className="bg-white text-black">
            Money Spent
          </option>
          <option value="left" className="bg-white text-black">
            Money Left
          </option>
        </select>
        <div className={`${isDefault ? "text-gray-500" : ""} flex`}>
          <label className="ml-4 mr-4 flex items-center">
            <input
              type="radio"
              value="asc"
              checked={sortOrder === "asc"}
              onChange={handleOrderChange}
              disabled={isDefault}
            />
            <ArrowUpWideNarrow className="ml-2 mr-1 inline h-4 w-4" /> Ascending
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="desc"
              checked={sortOrder === "desc"}
              onChange={handleOrderChange}
              disabled={isDefault}
            />
            <ArrowDownWideNarrow className="ml-2 mr-1 inline h-4 w-4" />{" "}
            Descending
          </label>
        </div>
      </div>
    </form>
  );
};

export default CategorySorter;
