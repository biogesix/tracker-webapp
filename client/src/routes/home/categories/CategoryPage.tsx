import ExpenseBox from "@/components/ExpenseBox";
import { Category, Expense } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category_id } = useParams();

  const [sortHighLow, setsortHighLow] = useState(false);
  const [sortLowHigh, setsortLowHigh] = useState(false);

  const [descending, setdescending] = useState<Expense[]>([]);
  const [ascending, setascending] = useState<Expense[]>([]);

  const { data: category } = useQuery<Category>({
    queryKey: ["category", category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category_id}`
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }

      const { data } = await response.json();
      return data;
    },
  });

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["category", category_id, "expenses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category_id}/expenses`
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }

      const { data } = await response.json();
      return data;
    },
  });

  const calculatePercentages = (
    budget: number,
    amountSaved: number,
    amountSpent: number
  ) => {
    if (budget === 0) {
      return { savedPercentage: 0, spentPercentage: 0 };
    }
    const savedPercentage = (amountSaved / budget) * 100;
    const spentPercentage = (amountSpent / budget) * 100;
    return { savedPercentage, spentPercentage };
  };

  const descendingSorted = () => {
    if (expenses) {
      console.log(expenses);
      const sortedExpenses = [...expenses].sort((a, b) =>
        a.total > b.total ? -1 : 1
      );
      console.log(sortedExpenses);
      setdescending(sortedExpenses);
    }
  };

  const ascendingSorted = () => {
    if (expenses) {
      const sortedExpenses = [...expenses].sort((a, b) =>
        a.total < b.total ? -1 : 1
      );
      setascending(sortedExpenses);
    }
  };

  useEffect(() => {
    if (category) {
      const { savedPercentage, spentPercentage } = calculatePercentages(
        category.budget,
        category.amount_left,
        category.amount_spent
      );
      setCategoryPercentages({
        savedPercentage,
        spentPercentage,
      });
    }
  }, [category]);

  const [{ savedPercentage, spentPercentage }, setCategoryPercentages] =
    useState<{
      savedPercentage: number;
      spentPercentage: number;
    }>({
      savedPercentage: 0,
      spentPercentage: 0,
    });

  const refreshData = () => {};

  if (!category || !expenses)
    return (
      <p className="flex h-full items-center justify-center">Please wait...</p>
    );
  return (
    <div
      className={`relative mt-12 flex min-h-full flex-col justify-center px-16`}
    >
      <h1 className="text-center text-8xl font-bold text-black">
        {category.category_name}
      </h1>
      <button onClick={refreshData}></button>
      <div className="flex w-full justify-center gap-2">
        <div className="flex w-1/3 flex-col items-center justify-center">
          {" "}
          <div className="mb-8 min-h-56 w-96 rounded-3xl bg-white drop-shadow-lg">
            <div
              className="mb-4 flex h-12 w-full items-center rounded-t-2xl px-6 font-bold text-white"
              style={{
                backgroundColor: category.category_color,
              }}
            >
              <text>Description</text>
            </div>
            <text className="ml-6">{category.description}</text>
          </div>
        </div>
        <div className="flex h-96 w-1/3 flex-col items-center">
          <div
            className="mb-8 mt-20 h-16 w-96 rounded-3xl bg-white p-4 text-center text-white drop-shadow-lg"
            style={{
              backgroundColor: category.category_color,
            }}
          >
            <text>Total Budget: </text>
            <text className="text-2xl font-bold">₱{category.budget}</text>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex size-52 flex-col items-center py-8 text-center">
              <text>Total Saved</text>
              <text className="text-6xl font-bold">
                {savedPercentage.toFixed(0)}%
              </text>
              <text className="font-bold">₱{category.amount_left}</text>
            </div>
            <div className="flex size-52 flex-col items-center py-8 text-center">
              <text>Total Spent</text>
              <text className="text-6xl font-bold">
                {spentPercentage.toFixed(0)}%
              </text>
              <text className="font-bold">₱{category.amount_spent}</text>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 px-10">
        <Link to={"expense/add"}>
          <div
            className="h-16 w-96 rounded-3xl bg-white p-4 text-center text-white drop-shadow-lg"
            style={{
              backgroundColor: category.category_color,
            }}
          >
            Add Expense
          </div>
        </Link>

        {/* toggle buttons */}
        <div className="flex flex-row">
          <div
            className="mx-2 items-center justify-center align-middle"
            onClick={() => {
              // if (sortLowHigh === false)
              setsortHighLow(!sortHighLow);
              setsortLowHigh(false);

              descendingSorted();
            }}
          >
            <button
              className={
                sortHighLow === true
                  ? "bg-green border-green rounded-full border-2 text-white"
                  : "border-green rounded-full border-2 bg-none"
              }
            >
              {" "}
              Sort By: Descending Expense
            </button>
          </div>

          <div
            className="mx-2 items-center justify-center align-middle"
            onClick={() => {
              // if (sortHighLow == false)
              setsortLowHigh(!sortLowHigh);
              setsortHighLow(false);
              ascendingSorted();
            }}
          >
            <button
              className={
                sortLowHigh === true
                  ? "bg-green border-green rounded-full border-2 text-white"
                  : "border-green rounded-full border-2 bg-none"
              }
            >
              {" "}
              Sort By: Ascending Expense
            </button>
          </div>
        </div>

        {expenses &&
          sortHighLow === false &&
          sortLowHigh === false &&
          expenses.map((expense: Expense) => (
            <ExpenseBox
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
              date={expense.date}
            />
          ))}

        {descending &&
          sortHighLow === true &&
          descending.map((expense: Expense) => (
            <ExpenseBox
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
              date={expense.date}
            />
          ))}

        {ascending &&
          sortLowHigh === true &&
          ascending.map((expense: Expense) => (
            <ExpenseBox
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
              date={expense.date}
            />
          ))}
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CategoryPage;
