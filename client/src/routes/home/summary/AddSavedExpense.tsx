import { toast } from "@/hooks/use-toast";
import { Expense } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const AddSavedExpense = () => {
  const { saved_category_id } = useParams();

  const queryClient = useQueryClient();
  const nav = useNavigate();

  const [expense, setExpense] = useState<Expense>({
    expense_name: "",
    price: 0,
    quantity: 1,
    total: 0,
    date: new Date(),
    saved_category_id: Number(saved_category_id),
  });

  useEffect(() => {
    setExpense((prev) => ({
      ...prev,
      total: expense.price * expense.quantity,
    }));
  }, [expense.price, expense.quantity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setExpense((prev) => {
      return {
        ...prev,
        [id]: id === "date" ? new Date(value) : value,
      };
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      if (!expense.expense_name.trim()) {
        throw Error("Name is required.");
      }

      if (expense.price <= 0) {
        throw Error("Price must be greater than zero.");
      }

      if (expense.quantity <= 0) {
        throw Error("Quantity must be greater than zero.");
      }

      if (!expense.date) {
        throw Error("Please Select date and time");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/expense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        }
      );
      if (!response.ok) {
        const errorMessage = (await response.json()) as {
          error: string;
          message: string;
        };
        throw Error(errorMessage.error);
      }
    },
    onSuccess: () => {
      toast({
        description: "Expense Added!",
      });
      closeForm();
      queryClient.invalidateQueries({
        queryKey: ["savedCategory", saved_category_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["savedCategory", saved_category_id, "expenses"],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
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
      <div className="relative">
        <form
          onSubmit={mutate}
          className="z-10 flex h-max max-w-[350px] flex-col gap-2 rounded-md bg-neutral-100 p-5 px-12 sm:w-full"
        >
          <h2>Add an Expense</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe.</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="expense_name">Name</label>
            <input
              type="text"
              id="expense_name"
              name="expense_name"
              value={expense.expense_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={expense.price}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={expense.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="total">Total</label>
            <input
              type="text"
              id="total"
              name="total"
              value={expense.total ?? 0}
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date">Select Date and Time</label>
            <input
              type="date"
              id="date"
              name="date"
              value={expense.date?.toISOString().split("T")[0]}
              required
              onChange={handleChange}
            />
          </div>
          <button type="button" className="cancel" onClick={closeForm}>
            Cancel
          </button>
          <button type="submit" disabled={isPending}>
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSavedExpense;
