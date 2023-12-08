import {
  Button,
  Container,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { User } from "../../models/user";
import { fetchTransactionsByUserId } from "../../api/transaction";
import { Status, Transaction } from "../../models/transaction";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

const UserModal = (props: UserModalProps) => {
  const [dueAmount, setDueAmount] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (props.user) {
        setLoading(true);
        const response = await fetchTransactionsByUserId(props.user.id);
        setDueAmount(response["total_due"]);
        setTransactions(response["transactions"]);
        setLoading(false);
      }
    })();
  }, [props.user]);

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={handleClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Container>
          <Typography level="h2">User Details</Typography>
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
              <Typography>Name: {props.user?.name}</Typography>
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
              <Typography>Email: {props.user?.email}</Typography>
            </Stack>
          </Stack>
          <Stack
            spacing={2}
            sx={{
              marginTop: 3,
            }}
          >
            <Typography>
              Books borrowed:{" "}
              {transactions.filter((el) => el.status === Status.Pending).length}
            </Typography>
            <Typography>Amount due: {dueAmount}</Typography>
          </Stack>
        </Container>
      </ModalDialog>
    </Modal>
  );
};

export default UserModal;
