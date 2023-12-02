import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Books } from "./views/Book";
import ErrorPage from "./views/ErrorPage";
import { Dashboard } from "./views/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/books",
    element: <Books/>,
  },
  {
    path: "/books/:id",
    element: <div>Book</div>,
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
