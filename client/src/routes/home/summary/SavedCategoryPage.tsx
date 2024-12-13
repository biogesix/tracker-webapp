import ExpenseBox from "@/components/ExpenseBox";
import { BackendResponse } from "@/interfaces/BackendResponse";
import calculatePercentages from "@/utils/calculateCategoryPercentages";
import { Expense, SavedCategories } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, Link } from "react-router";

const SavedCategoryPage = () => {
  const category = useLoaderData<SavedCategories>();

  const { data: savedCategoryExpenses } = useQuery<Expense[]>({
    queryKey: ["savedCategory", category.saved_category_id, "expenses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/savedCategories/${category.saved_category_id}/expenses`
      );
      if (!response.ok) {
        const { message } = (await response.json()) as { message: string };
        throw Error(message);
      }

      const { data } = (await response.json()) as BackendResponse<Expense[]>;
      return data;
    },
  });

  const [sortHighLow, setsortHighLow] = useState(false);
  const [sortLowHigh, setsortLowHigh] = useState(false);
  const [ascending, setAscending] = useState<Expense[] | null>(null);
  const [descending, setDescending] = useState<Expense[] | null>(null);

  const ascendingSorted = () => {
    const sorted = [...(savedCategoryExpenses || [])].sort(
      (a, b) => a.price - b.price
    );
    setAscending(sorted);
  };

  const descendingSorted = () => {
    const sorted = [...(savedCategoryExpenses || [])].sort(
      (a, b) => b.price - a.price
    );
    setDescending(sorted);
  };

  const [{ savedPercentage, spentPercentage }, setCategoryPercentages] =
    useState<{
      savedPercentage: number;
      spentPercentage: number;
    }>({
      savedPercentage: 0,
      spentPercentage: 0,
    });

  useEffect(() => {
    if (category) {
      const { savedPercentage, spentPercentage } = calculatePercentages(
        category.budget,
        category.amount_spent,
        category.amount_left
      );

      setCategoryPercentages({
        savedPercentage,
        spentPercentage,
      });
    }
  }, [category]);

  return (
    <div
      className={`relative mt-12 flex min-h-full flex-col justify-center px-16`}
    >
      <h1 className="text-center text-8xl font-bold text-black">
        {category.category_name}
      </h1>
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

      <div className="my-4 flex flex-row justify-start gap-4 px-16">
        <div
          className="mx-2 items-center justify-center align-middle"
          onClick={() => {
            setsortHighLow(!sortHighLow);
            setsortLowHigh(false);
            descendingSorted();
          }}
        >
          <button
            className={
              sortHighLow
                ? "rounded-full border-2 px-4 py-2 text-sm text-white"
                : "rounded-full border-2 px-4 py-2 text-sm"
            }
            style={{
              borderColor: category.category_color,
              backgroundColor: sortHighLow ? category.category_color : "white",
              color: sortHighLow ? "white" : category.category_color,
            }}
            onMouseEnter={(e) => {
              if (!sortHighLow) {
                e.currentTarget.style.backgroundColor = category.category_color;
                e.currentTarget.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              if (!sortHighLow) {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = category.category_color;
              }
            }}
          >
            Sort By: Descending Expense
          </button>
        </div>

        <div
          className="mx-2 items-center justify-center align-middle"
          onClick={() => {
            setsortLowHigh(!sortLowHigh);
            setsortHighLow(false);
            ascendingSorted();
          }}
        >
          <button
            className={
              sortLowHigh
                ? "rounded-full border-2 px-4 py-2 text-sm text-white"
                : "rounded-full border-2 px-4 py-2 text-sm"
            }
            style={{
              borderColor: category.category_color,
              backgroundColor: sortLowHigh ? category.category_color : "white",
              color: sortLowHigh ? "white" : category.category_color,
            }}
            onMouseEnter={(e) => {
              if (!sortLowHigh) {
                e.currentTarget.style.backgroundColor = category.category_color;
                e.currentTarget.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              if (!sortLowHigh) {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = category.category_color;
              }
            }}
          >
            Sort By: Ascending Expense
          </button>
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

        {sortHighLow &&
          descending?.map((expense) => (
            <ExpenseBox
              date={expense.date}
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
            />
          ))}

        {sortLowHigh &&
          ascending?.map((expense) => (
            <ExpenseBox
              date={expense.date}
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
            />
          ))}

        {!sortHighLow &&
          !sortLowHigh &&
          savedCategoryExpenses?.map((expense) => (
            <ExpenseBox
              date={expense.date}
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
            />
          ))}
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default SavedCategoryPage;
