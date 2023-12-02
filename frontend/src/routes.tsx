import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Books from "./views/Book";
import ErrorPage from "./views/ErrorPage";
import Dashboard from "./views/Dashboard";
import Users from "./views/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/books",
    element: <Books />,
  },
  {
    path: "/users",
    element: <Users />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
