import { Box, Stack, Button, Table } from "@mui/joy";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { fetchAllUsers } from "../api/user";
import DashboardContainer from "../components/DashboardContainer";
import LoadingScreen from "../components/LoadingScreen";
import { User } from "../models/user";
import { Book } from "../models/book";
import { fetchAllBooks } from "../api/book";
import { fetchAllTransactions, updateTransaction } from "../api/transaction";
import { Status, Transaction } from "../models/transaction";
import CreateTransactionModal from "../components/Transaction/CreateTransactionModal";

const TransactionPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreateTransactionDialog, setOpenCreateTransactionDialog] =
    useState(false);

  const handleFetchAllUsers = async () => {
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

  const handleFetchAllBooks = async () => {
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

  const handleFetchAllTransactions = async () => {
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

  const handleFetchAllData = async () => {
    await handleFetchAllUsers();
    await handleFetchAllBooks();
    await handleFetchAllTransactions();
  };

  const handleUpdateTransaction = async (id: number, status: Status) => {
    setLoading(true);
    const data = await updateTransaction(id, status);
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    await handleFetchAllTransactions();
    setLoading(false);
  };

  useEffect(() => {
    handleFetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContainer>
      <LoadingScreen loading={loading} />
      <h1>Transactions</h1>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenCreateTransactionDialog(true)}>
            Checkout a book
          </Button>
        </Stack>
      </Box>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Name</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{users.filter((u) => u.id === t.user_id)[0].name ?? ""}</td>
              <td>{books.filter((u) => u.id === t.book_id)[0].title ?? ""}</td>
              <td>{t.status.charAt(0) + t.status.slice(1).toLowerCase()}</td>
              <td>
                <Button
                  onClick={() =>
                    handleUpdateTransaction(
                      t.id,
                      t.status === Status.Pending
                        ? Status.Completed
                        : Status.Pending
                    )
                  }
                >
                  {t.status === Status.Pending ? "Return" : "Borrow"}
                </Button>
              </td>
            </tr>
          ))}
        </thead>
      </Table>
      <CreateTransactionModal
        open={openCreateTransactionDialog}
        onClose={() => {
          setOpenCreateTransactionDialog(false);
          handleFetchAllTransactions();
        }}
        books={books}
        users={users}
      />
    </DashboardContainer>
  );
};

export default TransactionPage;
