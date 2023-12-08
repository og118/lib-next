import {
  Button,
  Modal,
  Typography,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useSnackbar } from "notistack";
import { deleteBook } from "../../api/book";
import { Book } from "../../models/book";
import { errorToast, successToast } from "../../utils/helper/snackBars";

interface Props {
  book: Book;
  open: boolean;
  onClose: () => void;
}

const DeleteBookModal = ({ book, open, onClose }: Props) => {

  const handleDeleteBook = async () => {
    const data = await deleteBook(book.id);
    if (data) {
      successToast("Book deleted successfully");
    }
    onClose();
    return;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Typography level="h2">Delete Book</Typography>
        <Typography>
          Are you sure you want to delete this book titled: {book.title} by{" "}
          {book.authors.join(",")}?
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
          <Button onClick={handleDeleteBook} color="danger">
            Delete
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default DeleteBookModal;
