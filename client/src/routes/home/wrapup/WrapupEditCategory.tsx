import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category, User } from "@/utils/types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getUser from "@/utils/getUser";
import { toast } from "@/hooks/use-toast";
import { BackendError } from "@/interfaces/ErrorResponse";
import { BackendResponse } from "@/interfaces/BackendResponse";

const WrapupEditCategory = () => {
  const categories = useLoaderData() as Category[];
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [budgets, setBudgets] = useState(
    categories.reduce(
      (acc, category) => {
        acc[category.category_id!] = category.budget;
        return acc;
      },
      {} as Record<number, number>
    )
  );

  const handleBudgetChange = (id: number, newBudget: number) => {
    setBudgets((prev) => ({
      ...prev,
      [id]: newBudget,
    }));
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      const changedBudgets = Object.entries(budgets).reduce(
        (acc, [id, budget]) => {
          const originalBudget = categories.find(
            (category) => category.category_id === parseInt(id, 10)
          )?.budget;
          if (originalBudget !== budget) {
            acc[parseInt(id, 10)] = budget;
          }
          return acc;
        },
        {} as Record<number, number>
      );

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user!.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newBudgets: changedBudgets }),
        }
      );

      if (!response.ok) {
        const { message } = (await response.json()) as BackendError;
        throw Error(message);
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast({
        description: "Success updating category budgets.",
      });

      categories.forEach(async (category) => {
        await queryClient.refetchQueries({
          queryKey: ["category", category.category_id],
          queryFn: async () => {
            const response = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/category/${category.category_id}`
            );

            if (!response.ok) {
              throw Error("Error Fetched");
            }

            const { data } =
              (await response.json()) as BackendResponse<Category>;
            return data;
          },
        });
      });
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      await queryClient.fetchQuery({
        queryKey: ["weeklySummary"],
      });

      // for each of the categories fetch the category9

      nav("/dashboard");
    },
    onError: () => {
      toast({
        description: "Error updating budgets",
      });
    },
  });

  return (
    <div className="relative z-10 flex h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Circle */}
      <div className="bg-blush absolute left-[-40%] top-[-20%] hidden h-[120%] w-[100%] rounded-full sm:left-[-30%] sm:top-[-10%] sm:block sm:h-[150%] sm:w-[80%] md:left-[-35%] md:h-[150%] md:w-[70%]"></div>

      <div className="relative z-20 flex w-full max-w-6xl flex-col items-center justify-center md:flex-row md:justify-between">
        {/* Text Inside the Circle */}
        <h1 className="mb-8 text-2xl font-bold text-gray-700 sm:mb-0 sm:text-3xl md:text-4xl lg:text-5xl">
          Edit your <br />
          Categories:
        </h1>

        <div className="relative flex w-full max-w-sm items-center sm:max-w-md">
          <Carousel className="relative w-full">
            <CarouselContent>
              {categories.map((category) => (
                <CarouselItem
                  key={category.category_id}
                  className="flex items-center justify-center"
                >
                  <Card className="w-full max-w-[250px] rounded-xl shadow-lg sm:max-w-[300px] md:max-w-[400px]">
                    <CardContent
                      className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
                      style={{ backgroundColor: category.category_color }}
                    >
                      <div className="mb-4 flex items-center">
                        <p className="mr-2 text-lg text-white sm:text-xl md:text-2xl">
                          ₱
                        </p>
                        <input
                          type="number"
                          value={budgets[category.category_id!] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleBudgetChange(
                              category.category_id!,
                              value === "" ? 0 : parseInt(value, 10) || 0
                            );
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              handleBudgetChange(category.category_id!, 0);
                            }
                          }}
                          className="w-[80px] rounded-md border border-gray-300 p-2 text-center text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-[100px] sm:text-xl md:w-[150px] md:text-2xl"
                        />
                      </div>

                      <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
                        {category.category_name}
                      </h3>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-[-1rem] top-1/2 z-10 -translate-y-1/2 sm:left-[-2rem]" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 z-10 -translate-y-1/2 sm:right-[-2rem]" />
          </Carousel>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => mutate()}
        className="bg-green fixed bottom-4 right-4 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:bottom-8 sm:right-8 sm:px-6 sm:py-3 sm:text-lg"
      >
        SAVE
      </button>
    </div>
  );
};

export default WrapupEditCategory;
