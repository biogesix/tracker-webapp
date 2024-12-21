import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Expense, SavedCategories, WeeklySummary } from "@/utils/types";
import { BackendResponse } from "@/interfaces/BackendResponse";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/utils/types";
import { BackendError } from "@/interfaces/ErrorResponse";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getCurrentWeekRange = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { startOfWeek, endOfWeek };
};

const EditExpense = () => {
  const expense = useLoaderData() as Expense;

  const { category_id, saved_category_id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(expense.expense_name);
  const [price, setPrice] = useState<number | null>(expense.price);
  const [quantity, setQuantity] = useState(expense.quantity);
  const [total, setTotal] = useState(expense.total);
  const [timeDate, setTimeDate] = useState<Date>(new Date(expense.date!));

  const [{ startOfWeek, endOfWeek }, setDateRange] = useState<{
    startOfWeek: Date;
    endOfWeek: Date;
  }>(getCurrentWeekRange());

  const { data: savedCategory } = useQuery<SavedCategories>({
    enabled: !!saved_category_id,
    queryKey: ["savedCategory", saved_category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/savedCategories/${saved_category_id}`
      );

      if (!response.ok) {
        const { message } = (await response.json()) as { message: string };
        throw Error(message);
      }

      const { data } =
        (await response.json()) as BackendResponse<SavedCategories>;
      return data;
    },
  });
  const { data: weeklySummary } = useQuery<WeeklySummary>({
    enabled: !!saved_category_id && !!savedCategory,
    queryKey: ["weeklySummary", savedCategory?.weekly_summary_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/${savedCategory?.weekly_summary_id}`
      );

      if (!response.ok) {
        const { message } = (await response.json()) as BackendError;
        throw Error(message);
      }

      const { data } =
        (await response.json()) as BackendResponse<WeeklySummary>;
      // setStartDate(new Date(data.date_start));
      // setEndDate(new Date(data.date_end));
      return data;
    },
  });

  useEffect(() => {
    if (weeklySummary) {
      if (category_id) {
        setDateRange(getCurrentWeekRange());
      } else if (saved_category_id) {
        setDateRange({
          startOfWeek: new Date(weeklySummary.date_start),
          endOfWeek: new Date(weeklySummary.date_end),
        });
      }
    }
  }, [category_id, saved_category_id, weeklySummary]);
  useEffect(() => {
    const final_price = price ?? 0;
    setTotal(final_price * quantity);
  }, [price, quantity]);

  const queryClient = useQueryClient();

  const { data: category } = useQuery<Category>({
    queryKey: ["category", category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category_id}`
      );

      if (!response.ok) {
        const { message: errorMessage } = (await response.json()) as {
          message: string;
        };
        throw Error(errorMessage);
      }

      const { data } = (await response.json()) as BackendResponse<Category>;
      return data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      const final_price = price ?? 0;

      if (!savedCategory && !category) {
        throw Error("Category not found.");
      }

      const actualCategory = category ?? savedCategory;
      const money_left = actualCategory!.amount_left + expense.total;
      if (money_left < total) {
        throw Error("Your budget is lower than your amount spent.");
      }

      toast({
        description: "Adding Expense...",
      });

      if (!name.trim()) {
        throw Error("Name is required.");
      }

      if ((price ?? 0) <= 0) {
        throw Error("Price must be greater than zero.");
      }

      if (quantity <= 0) {
        throw Error("Quantity must be greater than zero.");
      }

      if (!timeDate) {
        throw Error("Please Select date and time");
      }
      const localeDate = new Date(timeDate);
      localeDate.toLocaleDateString();
      const newExpense: Expense = {
        expense_id: expense.expense_id,
        expense_name: name,
        price: final_price,
        quantity,
        total,
        category_id: expense.category_id,
        date: localeDate ? localeDate : new Date(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/expense/${expense.expense_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExpense),
        }
      );

      if (!response.ok) {
        const { message } = (await response.json()) as BackendError;
        throw Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category_id],
      });
      queryClient.refetchQueries({
        queryKey: ["expense", expense.expense_id],
      });
      nav(-1);
      toast({
        description: "Expense Edited!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Expense not edited",
        description: `Error: ${error.message}`,
      });
    },
  });

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const closeForm = () => {
    if (!isPending) {
      nav(-1);
    }
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        onClick={closeForm}
        className="absolute h-full w-full bg-black opacity-60"
      ></div>
      <form
        onSubmit={mutate}
        className="z-10 flex h-max flex-col items-center justify-center rounded-3xl bg-white px-20 py-10"
      >
        <div className="flex justify-center pb-4">
          <div className="flex flex-col items-center">
            <h1 className="text-darkCopper text-xl font-bold">Edit Expense</h1>
            <h3 className="text-lg">Money left: ₱{category?.amount_left}</h3>
          </div>
        </div>

        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
            <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
          </div>
        )}

        <div className="flex w-full justify-between gap-x-20 pb-6">
          <div className="flex flex-1 flex-col">
            <label htmlFor="name">Expense Name:</label>
            <input
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="datetime">Day Spent:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "focus:ring-green rounded-3xl border-2 border-black focus:ring",
                    !formatter.format(timeDate) && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatter.format(timeDate) ? (
                    formatter.format(timeDate)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={timeDate}
                  onSelect={(date: Date | undefined) =>
                    setTimeDate(date || new Date())
                  }
                  fromDate={startOfWeek}
                  toDate={endOfWeek}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex w-full justify-between gap-x-20 pb-6">
          <div className="flex flex-1 flex-col">
            <label htmlFor="price">Price:</label>
            <input
              className="focus:ring-green rounded-2xl border-2 border-black focus:ring"
              type="number"
              id="price"
              name="price"
              value={price ?? ""}
              step="0.01"
              onChange={(e) => setPrice(parseFloat(e.target.value) || null)}
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label htmlFor="quantity">Quantity:</label>
            <input
              className="focus:ring-green rounded-2xl border-2 border-black focus:ring"
              type="text"
              id="quantity"
              name="quantity"
              value={quantity === 0 ? "" : quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="total">Total:</label>
            <input
              className="rounded-2xl bg-[#eaffed]"
              type="text"
              id="total"
              name="quantity"
              value={total ? total.toFixed(2) : 0}
              disabled
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="text-darkCopper mt-auto rounded-full bg-[#487474] px-4 py-2 text-sm font-semibold transition duration-200"
          >
            Edit Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExpense;
