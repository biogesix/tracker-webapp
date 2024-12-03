import React, { useState, FormEvent, useEffect } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";

import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/utils/types";
import getUser from "@/utils/fetchuser";

const AddCategory: React.FC = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  const [categoryName, setCategoryName] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [categoryNameError, setCategoryNameError] = useState<string | null>(
    null
  );
  // const [description, setDescription] = useState<string>("");
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const nav = useNavigate();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      let hasEmptyField = false;

      if (!categoryName) {
        setCategoryNameError("Category name is required.");
        hasEmptyField = true;
      } else {
        setCategoryNameError(null);
      }

      if (!budget || budget <= 0) {
        setBudgetError("Enter valid budget.");
        hasEmptyField = true;
      } else {
        setBudgetError(null);
      }

      if (hasEmptyField) throw Error("Some fields are empty.");

      const category: Category = {
        budget: budget || 0,
        category_color: backgroundColor,
        category_name: categoryName,
        description: description || "",
        user_id: user!.user_id!,
        amount_left: budget || 0,
        amount_spent: 0,
      };
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add category");
      }
    },
    onSuccess: () => {
      toast({
        description: "Added category!",
      });
      closeForm();
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const closeForm = () => {
    nav(-1);
  };

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center">
      <form
        onSubmit={mutate}
        className="z-10 flex h-max w-full max-w-lg flex-col gap-2 rounded-md bg-white p-5"
      >
        <h1 className="text-center text-2xl font-bold text-black">
          Add Category
        </h1>

        <div>
          <label
            htmlFor="categoryName"
            className="text-sm font-medium text-gray-700"
          >
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className={`w-full rounded-lg border p-3 shadow-sm ${
              categoryNameError ? "border-red-600" : "border-gray-300"
            }`}
            placeholder="Enter category name"
          />
          {categoryNameError && (
            <p className="mt-1 text-xs text-red-600">{categoryNameError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full border p-2 ${
              categoryNameError ? "border-red-600" : "border-gray-300"
            }`}
            placeholder="Enter category description"
          />
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-medium text-gray-700">
            Budget:
          </label>
          <input
            type="number"
            id="budget"
            step={0.01}
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value) || budget)}
            className={`w-full rounded-lg border p-3 shadow-sm ${
              budgetError ? "border-red-600" : "border-gray-300"
            }`}
            placeholder="Enter budget"
          />
          {budgetError && (
            <p className="mt-1 text-xs text-red-600">{budgetError}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select Background Color:
          </label>
          <div className="mt-1 flex space-x-2">
            {CATEGORY_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`h-10 w-10 cursor-pointer rounded-full border-2 ${
                  backgroundColor === color
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-teal-800 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
