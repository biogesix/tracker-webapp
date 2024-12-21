import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Drawer from "../../components/Sidebar";
import { useEffect } from "react";
import { supabase } from "../../utils/UserContext";
import { useQuery } from "@tanstack/react-query";
import { User, WeeklySummary } from "@/utils/types";
import getUser from "@/utils/getUser";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getLastSunday from "@/utils/getLastSunday";
import { bouncy } from "ldrs";

bouncy.register();

const LayoutPage = () => {
  const nav = useNavigate();
  const path = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: wrapUpInfo, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["weeklySummary"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user!.user_id}/recent`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } =
        (await response.json()) as BackendResponse<WeeklySummary>;
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
    if (wrapUpInfo && !path.pathname.startsWith("/wrapup")) {
      const lastSunday = new Date(getLastSunday()).getDate();
      const recentSummaryStart = new Date(wrapUpInfo.date_start).getDate();

      if (lastSunday !== recentSummaryStart) {
        nav("/wrapup/1");
      }
    }
  }, [wrapUpInfo, path.pathname]);

  //  hide the sidebar on wrapup pages
  const hideSidebarRoutes = ["/wrapup/1", "/wrapup/2"];
  const shouldHideSidebar = hideSidebarRoutes.includes(path.pathname);

  return (
    <div className="flex h-screen flex-col">
      {!shouldHideSidebar && <Drawer />}

      <div className="h-full">
        {isLoading || !wrapUpInfo ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <l-bouncy size="77" speed="1.75" color="black"></l-bouncy>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default LayoutPage;
