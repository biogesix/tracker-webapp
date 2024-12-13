import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/toaster";

export const queryClient = new QueryClient();
const _Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
      <Outlet />
    </QueryClientProvider>
  );
};

export default _Root;
