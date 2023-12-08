import { Dashboard } from "@mui/icons-material";
import { useState, useContext, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  TAppContext,
  AppContext,
  AppContextProvider,
} from "./context/AppContext";
import ErrorPage from "./views/ErrorPage";
import Transaction from "./views/Transactions";
import Users from "./views/Users";
import Book from "./views/Books";
import { handleFetchAllData } from "./utils/helper/fetchAllResources";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/books",
    element: <Book />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/checkout",
    element: <Transaction />,
  },
]);

export const AppRouter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setUsers, setBooks, setTransactions } =
    useContext<TAppContext>(AppContext);

  useEffect(() => {
    console.log("Fetcching Everything");
    handleFetchAllData(setLoading, setBooks, setUsers, setTransactions);
  }, []);
  return (
    <>
      <LoadingScreen loading={loading} />
      <Header />
      <RouterProvider router={router} />;
    </>
  );
};
