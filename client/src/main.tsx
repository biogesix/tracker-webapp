import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./utils/routes";
import { RouterProvider } from "react-router";
import "./index.css";
import UserProvider from "./utils/UserContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
