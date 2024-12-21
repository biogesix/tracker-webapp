import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getUser from "@/utils/getUser";
import { Category, User } from "@/utils/types";
import { toast } from "@/hooks/use-toast";
import { BackendResponse } from "@/interfaces/BackendResponse";

interface DrawerDemoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DrawerDemo({ open, setOpen }: DrawerDemoProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const nav = useNavigate();

  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        throw Error("No user provided");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user.user_id}/categories`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } = (await response.json()) as BackendResponse<Category[]>;
      return data;
    },
  });

  const { mutate: yesMutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user!.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newBudgets: {} }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }

      return await response.json();
    },

    onSuccess: async () => {
      toast({
        description: "Used the same categories from the previous week.",
      });

      categories?.forEach(async (category) => {
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
      nav("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="fixed mx-auto flex h-auto max-h-[30rem] w-auto max-w-[40rem] items-center justify-center">
        <DrawerHeader>
          <DrawerTitle>Same Budget?</DrawerTitle>
          <DrawerDescription>
            Do you want to use the same budget for each category this week?
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center gap-6 p-4">
          <Button variant="outline" onClick={() => nav("/wrapup/2")}>
            No
          </Button>
          <Button
            variant="outline"
            onClick={() => yesMutate()}
            disabled={isPending}
          >
            Yes
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
