import { BackendResponse } from "@/interfaces/BackendResponse";
import { SavedCategories, WeeklySummary } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { CategoryGraph } from "./PieChart";

const WeeklySummaryCard = ({ summary }: { summary: WeeklySummary }) => {
  const { data: weeklySummaryCategories } = useQuery({
    queryKey: ["weeklySummary", summary.weekly_summary_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/${summary.weekly_summary_id}/savedcategories`
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
  });
  const startDate = new Date(summary.date_start);
  const endDate = new Date(summary.date_end);

  console.log(startDate);
  console.log(endDate);

  return (
    <Link to={`/weeklysummary/${summary.weekly_summary_id}`}>
      <div className="border-green hover:bg-green group relative mb-10 ml-14 mr-14 flex items-center rounded-xl border-2 bg-none p-6 transition-transform duration-300 ease-in-out hover:translate-y-[-5px] hover:text-white hover:shadow-xl">
        {/* Chart Container */}
        <div className="bg-green h-72 w-1/3 transition-colors duration-300 group-hover:bg-white">
          {weeklySummaryCategories && (
            <CategoryGraph categories={weeklySummaryCategories} />
          )}
        </div>
        {/* Start and End Date */}
        <div className="absolute left-[35%] top-[10%] font-bold">
          <p className="text-green text-3xl transition-colors duration-300 group-hover:text-white">
            {startDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {endDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Total Budget */}
        <div className="absolute bottom-6 left-[35%]">
          <p className="text-lg text-black transition-colors duration-300 group-hover:text-white">
            <span className="font-semibold">Total Budget: </span>$
            {summary.total_budget}
          </p>
        </div>

        {/* Saved Amount */}
        <div className="absolute bottom-6 right-6">
          <p className="text-sm transition-colors duration-300 group-hover:text-white">
            Saved:
          </p>
          <p className="text-2xl font-bold transition-colors duration-300 group-hover:text-white">
            ${summary.total_not_spent}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WeeklySummaryCard;
