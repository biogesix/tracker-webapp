import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "@/hooks/use-toast";
import { Expense } from "@/utils/types";

const AddExpense = () => {
  const queryClient = useQueryClient();
  const { category_id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(1.0);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [timeDate, setTimeDate] = useState("");

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        throw Error("Name is required.");
      }

      if (price <= 0) {
        throw Error("Price must be greater than zero.");
      }

      if (quantity <= 0) {
        throw Error("Quantity must be greater than zero.");
      }

      if (!timeDate) {
        throw Error("Please Select date and time");
      }

      const expense: Expense = {
        expense_name: name,
        price: price,
        quantity: quantity,
        total: total,
        category_id: Number(category_id),
        date: new Date(timeDate),
      };
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
      console.log(timeDate);
      console.log(new Date(timeDate));
      toast({
        description: "Expense Added!",
      });
      closeForm();
      queryClient.invalidateQueries({
        queryKey: ["category", category_id, "expenses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category_id],
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
      ></div>{" "}
      <div className="relative">
        <form
          onSubmit={mutate}
          className="z-10 flex h-max max-w-[350px] flex-col gap-2 rounded-md bg-neutral-500 p-5 px-12 sm:w-full"
        >
          <h2>Add an Expense</h2>
          <p>
            Label a name, individual price, and the quantity of the expense. The
            total will be calculated for you.
          </p>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price === 0 ? "" : price}
            step="0.01"
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          />

          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          />

          <label htmlFor="total">Total</label>
          <input
            type="text"
            id="total"
            name="quantity"
            value={total ? total : 0}
            disabled
          />
          <label htmlFor="date">Select Date and Time:</label>
          <input
            type="date"
            id="datetime"
            name="timeDate"
            value={timeDate}
            onChange={(e) => setTimeDate(e.target.value)}
            required
          />
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

export default AddExpense;
