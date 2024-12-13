import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { Expense } from "@/utils/types";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EditExpense = () => {
  const expense = useLoaderData<Expense>();

  const { category_id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(expense.expense_name);
  const [price, setPrice] = useState<number | null>(expense.price);
  const [quantity, setQuantity] = useState(expense.quantity);
  const [total, setTotal] = useState(expense.total);
  const [timeDate, setTimeDate] = useState<Date>(new Date(expense.date || ""));

  useEffect(() => {
    const final_price = price ?? 0;
    setTotal(final_price * quantity);
  }, [price, quantity]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      const final_price = price ?? 0;
      console.log("date: ", timeDate);

      // handle form logic
      const newExpense: Expense = {
        expense_id: expense.expense_id,
        expense_name: name,
        price: final_price,
        quantity,
        total,
        category_id: expense.category_id,
        date: new Date(timeDate),
        saved_category_id: expense.saved_category_id,
      };

      console.log(newExpense);

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
        const { error } = await response.json();
        throw Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["expense", expense.expense_id],
      });
      closeForm();
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

  const closeForm = () => {
    nav(-1);
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        onClick={closeForm}
        className="absolute h-full w-full bg-black opacity-60"
      ></div>
      <form
        onSubmit={mutate}
        className="z-10 flex h-max w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg bg-neutral-600 px-2 py-10 text-white"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price ?? ""}
            step="0.01"
            onChange={(e) => setPrice(parseFloat(e.target.value) || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="datetime">Select Date and Time:</label>
          <input
            type="date"
            id="datetime"
            name="timeDate"
            value={timeDate?.toISOString().split("T")[0] ?? ""}
            onChange={(e) => setTimeDate(new Date(e.target.value))}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="total">Total</label>
          <input
            type="text"
            id="total"
            name="quantity"
            value={total ? total.toFixed(2) : 0}
            disabled
          />
        </div>
        <button type="submit" disabled={isPending}>
          Edit Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
