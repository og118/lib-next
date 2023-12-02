import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Books } from "./views/Book";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
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
