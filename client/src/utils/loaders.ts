import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router";
import getUser from "./getUser";

export const getCategory = (queryClient: QueryClient) => {
  return async ({ params: { category_id } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["category", category_id],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/category/${category_id}`
        );

        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
          throw Error(errorMessage);
        }
        const { data } = await response.json();
        return data;
      },
    });
  };
};

export const getExpense = (queryClient: QueryClient) => {
  return async ({ params: { expense_id } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["expense", expense_id],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/expense/${expense_id}`
        );

        if (!response.ok) {
          const errorMessage = await response.json();
          throw Error(errorMessage);
        }
        const { data } = await response.json();
        return data;
      },
    });
  };
};

export const getPreviousWeekCategories = (queryClient: QueryClient) => {
  return async () => {
    return await queryClient.ensureQueryData({
      queryKey: ["previousWeekCategories"],
      queryFn: async () => {
        const { user_id } = await queryClient.ensureQueryData({
          queryKey: ["user"],
          queryFn: getUser,
        });
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/summary/user/${user_id}/categories`
        );
        if (!response.ok) {
          const errorMessage = await response.json();
          throw Error(errorMessage);
        }
        const { data } = await response.json();
        return data;
      },
    });
  };
};

export const getSavedCategory = (queryClient: QueryClient) => {
  return async ({ params: { saved_category_id } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["savedCategory", saved_category_id],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/savedCategories/${saved_category_id}`
        );

        if (!response.ok) {
          const errorMessage = await response.json();
          throw Error(errorMessage);
        }
        const { data } = await response.json();
        return data;
      },
    });
  };
};
