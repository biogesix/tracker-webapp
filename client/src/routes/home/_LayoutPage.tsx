import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Drawer from "../../components/Sidebar";
import { useEffect } from "react";
import { supabase } from "../../utils/UserContext";
import { useQuery } from "@tanstack/react-query";
import { User, WeeklySummary } from "@/utils/types";
import getUser from "@/utils/getUser";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getLastSunday from "@/utils/getLastSunday";

const LayoutPage = () => {
  const nav = useNavigate();
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const path = useLocation();
  const { data: wrapUpInfo, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["wrapUpInfo"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user!.user_id}/recent`
      );

      console.log(response);
      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } =
        (await response.json()) as BackendResponse<WeeklySummary>;
      console.log(data);
      return data;
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      if (!res.data.session) {
        nav("/auth");
      }
    });
  }, [nav]);

  useEffect(() => {
    console.log(path);
    if (wrapUpInfo && !path.pathname.startsWith("/wrapup")) {
      const lastSunday = new Date(getLastSunday()).getDate();
      const recentSummaryStart = new Date(wrapUpInfo.date_start).getDate();
      console.log(lastSunday);
      console.log(recentSummaryStart);

      if (lastSunday != recentSummaryStart) {
        nav("/wrapup/1");
      }
    }
  }, [wrapUpInfo, path.pathname]);

  return (
    <div className="flex h-screen flex-col">
      <Drawer />
      <div className="h-full">
        {isLoading ? <h1>Loading weekly summary</h1> : <Outlet />}
      </div>
    </div>
  );
};

export default LayoutPage;
