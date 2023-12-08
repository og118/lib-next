import { enqueueSnackbar } from "notistack";
import { Dispatch, SetStateAction } from "react";
import { fetchAllBooks } from "../../api/book";
import { fetchAllTransactions } from "../../api/transaction";
import { fetchAllUsers } from "../../api/user";
import { Book } from "../../models/book";
import { Transaction } from "../../models/transaction";
import { User } from "../../models/user";

export const handleFetchAllData = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setBooks: Dispatch<SetStateAction<Array<Book>>>,
  setUsers: Dispatch<SetStateAction<Array<User>>>,
  setTransactions: Dispatch<SetStateAction<Array<Transaction>>>
) => {
  setLoading(true);
  await handleFetchAllUsers(setLoading, setUsers);
  await handleFetchAllBooks(setLoading, setBooks);
  await handleFetchAllTransactions(setLoading, setTransactions);
  setLoading(false);
};

export const handleFetchAllUsers = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUsers: Dispatch<SetStateAction<Array<User>>>
) => {
  setLoading(true);
  const data = await fetchAllUsers();
  if (!data) {
    enqueueSnackbar("Something went wrong. Please try again later", {
      variant: "error",
      preventDuplicate: true,
    });
  }
  setUsers(data ?? []);
  setLoading(false);
};

export const handleFetchAllBooks = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setBooks: Dispatch<SetStateAction<Array<Book>>>
) => {
  setLoading(true);
  const data = await fetchAllBooks();
  if (!data) {
    enqueueSnackbar("Something went wrong. Please try again later", {
      variant: "error",
      preventDuplicate: true,
    });
  }
  setBooks(data ?? []);
  setLoading(false);
};

export const handleFetchAllTransactions = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setTransactions: Dispatch<SetStateAction<Array<Transaction>>>
) => {
  setLoading(true);
  const data = await fetchAllTransactions();
  if (!data) {
    enqueueSnackbar("Something went wrong. Please try again later", {
      variant: "error",
      preventDuplicate: true,
    });
  }
  setTransactions(data ?? []);
  setLoading(false);
};
