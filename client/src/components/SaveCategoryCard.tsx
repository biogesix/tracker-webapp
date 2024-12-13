import { SavedCategories } from "@/utils/types";
import { Link } from "react-router";
import { PencilLine } from "lucide-react";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  // DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Button } from "./ui/button";

const SavedCategoryCard = (category: { category: SavedCategories }) => {
  const { saved_category_id, category_color, category_name, budget } =
    category.category;

  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-5 my-5 flex h-48 items-center justify-center rounded-lg shadow-lg">
      <Link
        to={`/savedcategory/${saved_category_id}`}
        className="relative flex h-full w-full flex-col justify-between rounded-lg p-4"
        style={{
          backgroundColor: category_color || "#f3f3f3",
        }}
      >
        <div className="top- relative">
          <h3 className="text-lg font-medium">{category_name}</h3>
          <p className="mt-1 text-sm">Total Budget: ₱{budget}</p>
        </div>
      </Link>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          asChild
          className="absolute right-2 top-2 rounded px-2 py-1 text-xs text-white hover:text-rose-600"
        >
          <PencilLine className="h-10 w-10" />
        </DrawerTrigger>
        <DrawerContent className="mx-auto text-center sm:max-w-[425px]">
          <DrawerTitle> Are you sure you want to edit?</DrawerTitle>
          <DrawerDescription>
            {" "}
            It is not advisable to edit your past data. Edit anyways?
          </DrawerDescription>
          <DrawerFooter className="flex gap-2">
            <Button
              className="bg-green w-full hover:bg-[#2f4f4f]"
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Link to={`savedcategory/${saved_category_id}/edit`}>
              <Button
                className="bg-green w-full hover:bg-[#2f4f4f]"
                onClick={() => setOpen(false)}
              >
                Yes
              </Button>
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SavedCategoryCard;
