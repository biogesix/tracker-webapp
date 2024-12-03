import React, { useState, FormEvent, useEffect, useRef } from "react";
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
  const [budget, setBudget] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [categoryNameError, setCategoryNameError] = useState<string | null>(
    null
  );
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

      if (!budget || parseFloat(budget) <= 0) {
        setBudgetError("Enter valid budget.");
        hasEmptyField = true;
      } else {
        setBudgetError(null);
      }

      if (hasEmptyField) throw Error("Some fields are empty.");

      const category: Category = {
        budget: parseFloat(budget) || 0,
        category_color: backgroundColor,
        category_name: categoryName,
        description: description || "",
        user_id: user!.user_id!,
        amount_left: parseFloat(budget) || 0,
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

  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      overlayRef.current &&
      !overlayRef.current.contains(event.target as Node)
    ) {
      closeForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      ref={overlayRef}
    >
      <div className="relative w-11/12 max-w-md rounded-lg bg-white p-5 shadow-lg">
        <form onSubmit={mutate} className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-bold text-black">
            Add Category
          </h1>

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
            <label
              htmlFor="budget"
              className="text-sm font-medium text-gray-700"
            >
              Budget:
            </label>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`w-full rounded-lg border p-3 shadow-sm ${
                budgetError ? "border-red-600" : "border-gray-300"
              }`}
              placeholder="Enter budget"
            />
            {budgetError && (
              <p className="mt-1 text-xs text-red-600">{budgetError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
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
                      ? "border-gray-950"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              type="button"
              onClick={closeForm}
              className="w-full rounded-md bg-gray-300 py-2 font-semibold text-gray-700 transition duration-200 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-md bg-teal-800 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
