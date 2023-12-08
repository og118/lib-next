import {
  Button,
  Modal,
  Typography,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { deleteUser } from "../../api/user";
import { User } from "../../models/user";
import { errorToast, successToast } from "../../utils/helper/snackBars";

interface Props {
  user: User;
  open: boolean;
  onClose: () => void;
}

const DeleteUserModal = ({ user, open, onClose }: Props) => {
  const handleDeleteUser = async () => {
    const data = await deleteUser(user.id);
    if (!data) {
      errorToast("Something went wrong. Please try again later");
      return;
    }
    successToast("User deleted successfully");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Typography level="h2">Delete User</Typography>
        <Typography>
          Are you sure you want to delete this user titled: {user.name} with
          email {user.email}?
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button>Cancel</Button>
          <Button onClick={handleDeleteUser} color="danger">
            Delete
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default DeleteUserModal;
