import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Select,
  Stack,
  Table,
  Typography,
  Option,
} from "@mui/joy";
import DashboardContainer from "../components/DashboardContainer";
import { useEffect, useState } from "react";
import { fetchAllBooks } from "../api/book";
import { useSnackbar } from "notistack";
import { Book } from "../models/book";
import CreateBookModal from "../components/Books/CreateBookModal";
import LoadingScreen from "../components/LoadingScreen";
import DeleteBookModal from "../components/Books/DeleteBookModal";
import ImportBookModal from "../components/Books/ImportBookModal";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const BooksPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreateBookDialog, setOpenCreateBookDialog] =
    useState<boolean>(false);
  const [openImportBookDialog, setOpenImportBookDialog] =
    useState<boolean>(false);
  const [openEditBookDialog, setOpenEditBookDialog] = useState<boolean>(false);
  const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);
  const [openDeleteBookDialog, setOpenDeleteBookDialog] =
    useState<boolean>(false);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleSetRowsPerPage = (newRowsPerPage: number) => {
    const start = (pageNumber-1)*rowsPerPage+1
    const newPageNumber = Math.ceil(start/newRowsPerPage)
    setRowsPerPage(newRowsPerPage);
    setPageNumber(newPageNumber)
  }

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

  useEffect(() => {
    handleFetchBooks();
  }, []);

  return (
    <DashboardContainer>
      <LoadingScreen loading={loading} />
      <Typography level="h2" sx={{ marginY: "25px" }}>
        Library
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenCreateBookDialog(true)}>
            Create Book
          </Button>
          <Button onClick={() => setOpenImportBookDialog(true)}>
            Import Book
          </Button>
        </Stack>
      </Box>
      <Table sx={{ width: "auto" }}>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Book Title</th>
            <th style={{ width: "30%" }}>Author</th>
            <th style={{ width: "15%" }}>Publisher</th>
            <th style={{ width: "3%" }}>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books
            .slice(
              (pageNumber - 1) * rowsPerPage,
              (pageNumber - 1) * rowsPerPage + rowsPerPage
            )
            .map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.authors.join(", ")}</td>
                <td>{book.publisher}</td>
                <td>{book.stock_quantity}</td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={() => {
                        setBookToEdit(book);
                        setOpenEditBookDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => {
                        setBookToEdit(book);
                        setOpenDeleteBookDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select
                    onChange={(_, val: number | null) => val !== null && handleSetRowsPerPage(val)}
                    value={rowsPerPage}
                  >
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </FormControl>
                <Typography textAlign="center" sx={{ minWidth: 80 }}>
                  {(pageNumber - 1) * rowsPerPage + 1}-
                  {(pageNumber - 1) * rowsPerPage + 1 + rowsPerPage - 1 >
                  books.length
                    ? books.length
                    : (pageNumber - 1) * rowsPerPage + 1 + rowsPerPage - 1}{" "}
                  of {books.length}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={
                      pageNumber === Math.ceil(books.length / rowsPerPage)
                    }
                    onClick={() => {
                      setPageNumber(pageNumber + 1);
                    }}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
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
      <ImportBookModal
        open={openImportBookDialog}
        onClose={() => {
          handleFetchBooks();
          setOpenImportBookDialog(false);
        }}
      />
      {bookToEdit && (
        <DeleteBookModal
          open={openDeleteBookDialog}
          onClose={() => {
            handleFetchBooks();
            setOpenDeleteBookDialog(false);
          }}
          book={bookToEdit}
        />
      )}
    </DashboardContainer>
  );
};

export default BooksPage;
