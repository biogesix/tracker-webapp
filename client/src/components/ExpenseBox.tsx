// import { useState } from "react";
import { Expense } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router";

const ExpenseBox = ({
  expense_id,
  expense_name,
  price,
  quantity,
  total,
  category_id,
  date,
}: Expense) => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: handleDeleteExpense, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/expense/${expense_id}`,
        {
          method: "DELETE",
        }
      );
      console.log("Expense ID:", expense_id);
      console.log("Response status:", response.status);
      console.log(date);

      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse.message);
        throw new Error(errorResponse.message);
      } else {
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        description: "Expense successfully deleted",
      });
      queryClient.refetchQueries({
        queryKey: ["category", category_id, "expenses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category_id],
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: `expense unsuccessfully deleted: ${error.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });
  const handleEditExpense = () => {
    if (!isPending) {
      nav(`expense/${expense_id}/edit`);
    }
  };

  const monthString = new Date(date!).toLocaleString("default", {
    month: "long",
  });
  const dateString = new Date(date!).getDate();
  const yearString = new Date(date!).getFullYear();

  return (
    <div className="flex h-auto flex-row flex-nowrap justify-between border-b-2 border-b-black p-3">
      <div className="flex flex-col">
        <h2 className="flex truncate text-wrap font-bold"> {expense_name} </h2>
        <h6 className="flex">
          {" "}
          {price} x {quantity}{" "}
        </h6>

        <div className="mt-7">
          <h2>
            {total} PHP {monthString} {dateString}, {yearString}
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <button className="" onClick={handleEditExpense}>
          <PiNotePencil size={30} className="wx-32" />
        </button>

        <Drawer>
          <DrawerTrigger>
            <PiTrash size={30} className="m-0 mt-5 flex p-0" />
          </DrawerTrigger>
          <DrawerContent className="mx-auto items-center justify-center rounded-lg bg-white shadow-lg sm:max-w-[425px]">
            <DrawerHeader>
              <DrawerTitle>
                Are you sure you want to delete this expense? Expense name:{" "}
                {expense_name}
              </DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flext flex-row justify-center">
              <button onClick={() => handleDeleteExpense()}>
                <Button variant="outline"> Yes </Button>
              </button>
              <DrawerClose>
                <button>
                  <Button variant="outline"> No </Button>
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ExpenseBox;
