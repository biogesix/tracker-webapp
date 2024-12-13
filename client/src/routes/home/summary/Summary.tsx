import { CategoryGraph } from "@/components/PieChart";
import SavedCategoryCard from "@/components/SaveCategoryCard";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getUser from "@/utils/getUser";
import { SavedCategories, User } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Outlet, useParams } from "react-router";

const Summary = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { weeklysummary_id } = useParams();

  const { data: weeklySummaryCategories } = useQuery({
    queryKey: ["weeklySummary", weeklysummary_id, "categories"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/${weeklysummary_id}/savedcategories`
      );

      if (!response.ok) {
        const { message: errorMessage } = (await response.json()) as {
          message: string;
        };
        throw Error(errorMessage);
      }

      const { data } = (await response.json()) as BackendResponse<
        SavedCategories[]
      >;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="pl-5 pr-5 pt-5">
      <h1 className="pb-2 font-bold">*Insert Date*</h1>
      <hr className="border-t-2 border-slate-900 pl-2 pr-2 pt-2" />
      <div>
        {/*graphs */}
        <div className="mt-6 flex gap-20">
          {weeklySummaryCategories ? (
            <div>
              <CategoryGraph categories={weeklySummaryCategories} />
            </div>
          ) : (
            <div>Loading...</div>
          )}

          <div className="w-80">
            <WeeklyChart week={null} />
          </div>
        </div>
      </div>

      {/* Categories section */}
      <div className="mt-4">
        <h4 className="text-lg font-medium">Categories</h4>
        <div>Insert Categories</div>
        <div className="grid md:grid-cols-3">
          {weeklySummaryCategories?.map((weeklyCategory) => (
            <SavedCategoryCard
              category={weeklyCategory}
              key={weeklyCategory.weekly_summary_id}
            />
          ))}
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Summary;
