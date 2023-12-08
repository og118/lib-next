import {
  Autocomplete,
  Button,
  Container,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { User } from "../../models/user";
import { useSnackbar } from "notistack";
import { Book } from "../../models/book";
import { TransactionInput } from "../../models/transaction";
import { createTransaction } from "../../api/transaction";
import { NumericFormatAdapter } from "../NumericFormatter";

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  books: Book[];
  users: User[];
}

const initialValues: TransactionInput = {
  book_id: -1,
  user_id: -1,
};

const CreateTransactionModal = (props: CreateTransactionModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [transaction, setTransaction] =
    useState<TransactionInput>(initialValues);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    setLoading(false);
    setQuantity(0);
    setTransaction(initialValues);
    props.onClose();
  };

  const handleValidateUser = () => {
    if (transaction.user_id === -1) {
      enqueueSnackbar("Please select a user", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (transaction.book_id === -1) {
      enqueueSnackbar("Please select a book", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (quantity <= 0) {
      enqueueSnackbar("Please select number of books issued", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    return true;
  };

  const handleCreateTransaction = async () => {
    setLoading(true);
    if (!handleValidateUser()) {
      setLoading(false);
      return;
    }
    let data = null
    for (let i = 0; i < quantity; i++) {
      data = await createTransaction(transaction);
      if (!data) {
        break;
      }
    }
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return
    }
    enqueueSnackbar("Issued the book successfully", {
      variant: "success",
      preventDuplicate: true,
    });
    handleClose();
  };

  return (
    <Modal open={props.open} onClose={handleClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Container>
          <Typography level="h2">Checkout a book</Typography>
          <Stack
            spacing={2}
            sx={{
              marginTop: 3,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>User</Typography>
              <Autocomplete
                options={props.users}
                getOptionLabel={(option) => option.name}
                value={props.users.find(
                  (user) => user.id === transaction.user_id
                )}
                onChange={(e, value) =>
                  setTransaction({
                    ...transaction,
                    user_id: value?.id ?? -1,
                  })
                }
              />
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>Book</Typography>
              <Autocomplete
                options={props.books}
                getOptionLabel={(option) => option.title}
                value={props.books.find(
                  (book) => book.id === transaction.book_id
                )}
                onChange={(e, value) =>
                  setTransaction({
                    ...transaction,
                    book_id: value?.id ?? -1,
                  })
                }
              />
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>Quantity</Typography>
              <Input
                placeholder="Quantity"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
              />
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              marginTop: 3,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreateTransaction} loading={loading}>
              Checkout
            </Button>
          </Stack>
        </Container>
      </ModalDialog>
    </Modal>
  );
};

export default CreateTransactionModal;
