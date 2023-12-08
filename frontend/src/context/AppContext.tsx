import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import { Book } from "../models/book";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { useStickyState } from "../utils/hooks/useStickyState";

type TProps = {
  children: ReactNode;
};

export type TAppContext = {
  users: Array<User>;
  setUsers: Dispatch<SetStateAction<Array<User>>>;
  books: Array<Book>;
  setBooks: Dispatch<SetStateAction<Array<Book>>>;
  transactions: Array<Transaction>;
  setTransactions: Dispatch<SetStateAction<Array<Transaction>>>;
};

const initialContext: TAppContext = {
  users: [],
  books: [],
  transactions: [],
  setUsers: () => {},
  setBooks: () => {},
  setTransactions: () => {},
};

export const AppContext = createContext<TAppContext>(initialContext);

export const AppContextProvider = ({ children }: TProps): JSX.Element => {
  const [users, setUsers] = useStickyState<Array<User>>([], "users");
  const [books, setBooks] = useStickyState<Array<Book>>([], "books");
  const [transactions, setTransactions] = useStickyState<Array<Transaction>>(
    [],
    "transactions"
  );

  return (
    <AppContext.Provider
      value={{
        books,
        setBooks,
        users,
        setUsers,
        transactions,
        setTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
