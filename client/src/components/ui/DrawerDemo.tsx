import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import getUser from "@/utils/getUser";
import { User } from "@/utils/types";
import { toast } from "@/hooks/use-toast";

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
      await queryClient.invalidateQueries({
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
