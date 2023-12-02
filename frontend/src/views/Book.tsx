import { Box, Button, Stack, Table } from "@mui/joy";
import DashboardContainer from "../components/DashboardContainer";
import { useEffect, useState } from "react";
import { deleteBook, fetchAllBooks, updateBook } from "../api/book";
import { useSnackbar } from "notistack";
import { Book, BookInput } from "../models/book";
import CreateBookModal from "../components/Books/CreateBookModal";
import LoadingScreen from "../components/LoadingScreen";
import DeleteBookModal from "../components/Books/DeleteBookModal";

export const Books = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreateBookDialog, setOpenCreateBookDialog] = useState(false);
  const [openEditBookDialog, setOpenEditBookDialog] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);
  const [openDeleteBookDialog, setOpenDeleteBookDialog] = useState(false);

  const handleFetchBooks = async () => {
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

  const handleDeleteBook = async (bookId: number) => {
    const data = await deleteBook(bookId);
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    handleFetchBooks();
  };

  const handleEditBook = async (bookId: number, book: BookInput) => {
    const data = await updateBook(bookId, book);
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    handleFetchBooks();
  };

  useEffect(() => {
    handleFetchBooks();
  }, []);

  return (
    <DashboardContainer>
      <LoadingScreen loading={loading}/>
      <h1>Books</h1>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenCreateBookDialog(true)}>Create Book</Button>
          <Button>Import Book</Button>
        </Stack>
      </Box>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Book Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Stock</th>
            <th></th>
            <th></th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.authors.join(", ")}</td>
              <td>{book.publisher}</td>
              <td>{book.stock_quantity}</td>
              <td>
                <Button onClick={() => {
                  setBookToEdit(book);
                  setOpenDeleteBookDialog(true);
                }}>Delete</Button>
              </td>
              <td>
                <Button onClick={() => {
                  setBookToEdit(book);
                  setOpenEditBookDialog(true);
                }}>Edit</Button>
              </td>
            </tr>
          ))}
        </thead>
      </Table>
      <CreateBookModal
        open={openCreateBookDialog || openEditBookDialog}
        isEditing={openEditBookDialog}
        onClose={() => {
          handleFetchBooks();
          setOpenCreateBookDialog(false);
          setOpenEditBookDialog(false);
        }}
        book={bookToEdit}
      />
      <DeleteBookModal
        open={openDeleteBookDialog}
        onClose={() => {
          handleFetchBooks();
          setOpenDeleteBookDialog(false);
        }}
        book={bookToEdit!}
      />
    </DashboardContainer>
  );
};
