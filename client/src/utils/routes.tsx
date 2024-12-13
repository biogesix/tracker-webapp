import { createBrowserRouter } from "react-router";
import _Root from "../_Root";
import Landing from "../routes/Landing";
import About from "../routes/About";
import Register from "../routes/auth/AuthPage";
import NotLoggedIn from "../routes/NotLoggedIn";
import LayoutPage from "../routes/home/_LayoutPage";
import Dashboard from "../routes/home/Dashboard";
import AddCategory from "../routes/home/categories/AddCategory";
import CategoryPage from "../routes/home/categories/CategoryPage";
// import Expense from "../routes/home/expense/Expense";
import AddExpense from "../routes/home/expense/AddExpense";
import Profile from "../routes/home/Profile";
import Summaries from "../routes/home/summary/Summaries";
import Summary from "../routes/home/summary/Summary";
import WrapupEditCategory from "@/routes/home/wrapup/WrapupEditCategory";
import EditCategory from "../routes/home/categories/EditCategory";
import EditExpense from "../routes/home/expense/EditExpense";
import {
  getCategory,
  getExpense,
  getPreviousWeekCategories,
  getSavedCategory,
} from "./loaders";
import ErrorPage from "../ErrorPage";
import { queryClient } from "../_Root";
import WrapupInfoPage from "@/routes/home/wrapup/WrapupInfoPage";
import SavedCategoryPage from "@/routes/home/summary/SavedCategoryPage";
import EditSavedCategory from "@/routes/home/summary/EditSavedCategory";
import AddSavedExpense from "@/routes/home/summary/AddSavedExpense";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <_Root />,
      children: [
        {
          path: "/",
          element: <Landing />,
        },
        {
          path: "auth",
          element: <Register />,
        },
        {
          path: "not-logged-in",
          element: <NotLoggedIn />,
        },
        {
          element: <LayoutPage />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
              children: [
                {
                  path: "category",
                  children: [
                    {
                      path: "add",
                      element: <AddCategory />,
                    },
                    {
                      path: ":category_id/edit",
                      element: <EditCategory />,
                      loader: getCategory(queryClient),
                    },
                  ],
                },
              ],
            },
            {
              path: "category",
              children: [
                {
                  path: ":category_id",
                  loader: getCategory(queryClient),
                  element: <CategoryPage />,
                  children: [
                    {
                      path: "edit",
                      element: <EditCategory />,
                      loader: getCategory(queryClient),
                    },
                    {
                      path: "expense",
                      children: [
                        {
                          path: "add",
                          element: <AddExpense />,
                        },
                        {
                          path: ":expense_id/edit",
                          element: <EditExpense />,
                          loader: getExpense(queryClient),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "wrapup",
              children: [
                {
                  path: "1",
                  element: <WrapupInfoPage />,
                },
                {
                  path: "2",
                  element: <WrapupEditCategory />,
                  loader: getPreviousWeekCategories(queryClient),
                },
              ],
            },
            {
              path: "weeklysummaries",
              element: <Summaries />,
            },
            {
              path: "weeklysummary/:weeklysummary_id",
              element: <Summary />,
              children: [
                {
                  path: "savedcategory/:saved_category_id/edit",
                  element: <EditSavedCategory />, // edit saved category
                  loader: getSavedCategory(queryClient),
                },
              ],
            },
            {
              path: "savedcategory/:saved_category_id",
              element: <SavedCategoryPage />,
              loader: getSavedCategory(queryClient),
              children: [
                {
                  path: "expense",
                  children: [
                    {
                      path: ":expense_id/edit",
                      element: <EditExpense />,
                      loader: getExpense(queryClient),
                    },
                    {
                      path: "add",
                      element: <AddSavedExpense />,
                    },
                  ],
                },
              ],
            },
            {
              path: "/about",
              element: <About />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
export default router;
