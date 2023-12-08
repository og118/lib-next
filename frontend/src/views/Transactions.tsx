import { Box, Stack, Button, Table, Typography } from "@mui/joy";
import { useState, useContext } from "react";
import DashboardContainer from "../components/DashboardContainer";
import LoadingScreen from "../components/LoadingScreen";
import { updateTransaction } from "../api/transaction";
import { Status } from "../models/transaction";
import CreateTransactionModal from "../components/Transaction/CreateTransactionModal";
import { AppContext, TAppContext } from "../context/AppContext";
import { handleFetchAllTransactions } from "../utils/helper/fetchAllResources";
import { errorToast } from "../utils/helper/snackBars";

const TransactionPage = () => {
  const { users, books, transactions, setTransactions } =
    useContext<TAppContext>(AppContext);
  const [loading, setLoading] = useState<boolean>(false);

  const [openCreateTransactionDialog, setOpenCreateTransactionDialog] =
    useState<boolean>(false);

  const handleUpdateTransaction = async (id: number, status: Status) => {
    setLoading(true);
    const data = await updateTransaction(id, status);
    if (!data) {
      errorToast("Something went wrong. Please try again later")
    }
    await handleFetchAllTransactions(setLoading, setTransactions);
    setLoading(false);
  };

  return (
    <DashboardContainer>
      <LoadingScreen loading={loading} />
      <Typography level="h2" sx={{ marginY: "25px" }}>
        Transactions
      </Typography>
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
            <th>Name</th>
            <th style={{ width: "40%" }}>Title</th>
            <th>Status</th>
            <th></th>
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
          handleFetchAllTransactions(setLoading, setTransactions);
        }}
        books={books}
        users={users}
      />
    </DashboardContainer>
  );
};

export default TransactionPage;
