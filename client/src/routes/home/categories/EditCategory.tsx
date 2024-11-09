import React, { useState, useRef } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";
import { Link, useLoaderData } from "react-router-dom";
import { Category } from "../../../interfaces/Category";
import { BackendResponse } from "../../../interfaces/response";
import { useMutation } from "@tanstack/react-query";

const AddCategory = () => {
  const { data: category } = useLoaderData() as BackendResponse<Category>;

  const [categoryName, setCategoryName] = useState<string>(
    category.category_name
  );
  const [budget, setBudget] = useState<number | 0>(category.budget);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    category.category_color
  );
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    // category.background_image_url ?? null
    category.background_image_url ?? null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate } = useMutation({
    mutationFn: (category: Category) =>
      fetch(`http://localhost:3000/category/${category.category_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }),
  });

  const handleReset = () => {
    setCategoryName(category.category_name);
    setBudget(category.budget);
    setBackgroundColor(category.category_color);
    setBackgroundImage(null);
    setImagePreviewUrl(category.background_image_url ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      category_id: category.category_id,
      category_name: categoryName,
      budget: budget,
      category_color: backgroundColor,
      background_image_url: imagePreviewUrl ?? category.background_image_url,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full flex flex-col gap-2"
      >
        <h1 className="text-2xl text-black font-bold text-center">
          Edit Category
        </h1>

        <div>
          <label
            htmlFor="categoryName"
            className="text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            placeholder="Enter budget"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select Background Color
          </label>
          <div className="flex space-x-2 mt-1">
            {CATEGORY_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`w-10 h-10 cursor-pointer rounded-full border-2 ${
                  backgroundColor === color
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Background Image
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="backgroundImage"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 bg-teal-800 text-white font-bold py-2 px-4 rounded-md"
            >
              Choose File
            </button>
          </div>
        </div>

        {imagePreviewUrl && (
          <div className="relative mb-4">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-gray-200 text-black rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition duration-200"
            >
              X
            </button>
          </div>
        )}
        <button
          className="w-full bg-neutral-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          type="button"
        >
          <Link to={`/category/${category.category_id}`}>Cancel</Link>
        </button>
        <button
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          type="submit"
          className="w-full bg-teal-800 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Edit Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
