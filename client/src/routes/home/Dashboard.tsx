import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BackendResponse } from "@/interfaces/BackendResponse";
import { Category } from "@/utils/types";
import CategoryView from "@/components/CategoryView";
import { useQuery } from "@tanstack/react-query";
import getUser from "@/utils/getUser";

const Dashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!user) {
        throw Error("No user provided");
      }
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user.user_id!}/categories`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } = (await response.json()) as BackendResponse<Category[]>;
      console.log(data);
      return data;
    },
  });
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalNotSpent, settotalNotSpent] = useState(0);
  const [sortOrder, setSortOrder] = useState("budget");
  const [isAscending, setIsAscending] = useState(false);

  useEffect(() => {
    if (categories) {
      console.log(categories);
      setTotalBudget(() => {
        return categories.reduce((acc, cat) => acc + cat.budget, 0);
      });
      setTotalSpent(() => {
        return categories.reduce(
          (acc, category) => acc + category.amount_spent,
          0
        );
      });
      settotalNotSpent(() => {
        return categories.reduce(
          (acc, category) => acc + category.amount_left,
          0
        );
      });
    }
  }, [categories]);

  const handleSort = (sortBy: string) => {
    setSortOrder(sortBy);
    setIsAscending(!isAscending);
  };

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

  return !categories ? (
    <div className="min-h-full">
      <h1 className="">Please wait</h1>{" "}
    </div>
  ) : (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome, {user?.username} <span className="wave">👋</span>
        </h1>
      </header>
      {/* Summary Part */}
      <div className="grid grid-cols-4 gap-6">
        {/* Placeholder for Summary Graph */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow md:col-span-2">
          <h2 className="mb-4 text-lg font-medium text-black">Summary</h2>
          <div className="flex items-center justify-around">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-3 rounded bg-teal-400"
                  style={{ height: `${(index + 1) * 20}px` }}
                />
                <p className="mt-1 text-xs">Day {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Money Left */}
        <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-center text-lg font-medium text-black">
            Money Left
          </h2>
          <p className="text-center text-4xl font-bold text-black">
            {totalNotSpent}
          </p>
        </div>

        {/* Budget and Expenses */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-center text-sm font-medium text-black">
              {" "}
              Current Budget
            </h2>
            <p className="text-center text-3xl font-bold text-black">
              {totalBudget}
            </p>
          </div>

          {/* Total Expenses */}
          <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-center text-sm font-medium text-black">
              Total Expenses
            </h2>
            <p className="text-center text-3xl font-bold text-black">
              {totalSpent}
            </p>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-black">Categories</h2>
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
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {/* Add New Category */}
          <Link
            className="mx-5 my-5 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-500 shadow-lg hover:bg-gray-200"
            to="category/add"
          >
            <span className="text-4xl">+</span>
          </Link>

          {sortedCategories &&
            sortedCategories.map((category) => (
              <CategoryView category={category} key={category.category_id} />
            ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
