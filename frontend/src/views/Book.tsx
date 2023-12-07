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

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);

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
      <h1>Books</h1>
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
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Book Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Stock</th>
            <th></th>
          </tr>
          {books.map((book) => (
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
        </thead>
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
                    onChange={(_, val) => val !== null && setRowsPerPage(val)}
                    value={rowsPerPage}
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                {/* <Typography textAlign="center" sx={{ minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: rows.length === -1 ? -1 : rows.length,
                  })}
                </Typography> */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    // disabled={page === 0}
                    // onClick={() => handleChangePage(page - 1)}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    // disabled={
                    //   rows.length !== -1
                    //     ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                    //     : false
                    // }
                    // onClick={() => handleChangePage(page + 1)}
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
