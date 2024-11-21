import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import router from "./routes/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
