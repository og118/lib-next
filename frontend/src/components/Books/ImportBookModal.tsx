import {
  Button,
  Checkbox,
  Chip,
  Container,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { Book, BookInput } from "../../models/book";
import { createBook, fetchBookFromFrappeApi, updateBook } from "../../api/book";
import { useSnackbar } from "notistack";
import { NumericFormatAdapter } from "../NumericFormatter";

interface ImportBookModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportBookModal = (props: ImportBookModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [limit, setLimit] = useState(10);

  const [importedBooks, setImportedBooks] = useState<Array<Book>>([]);
  const [selectedBookIndices, setSelectedBookIndices] = useState<
    Map<number, boolean>
  >(new Map());

  const handleValidateBook = (book: Book) => {
    if (book.authors.length === 0) {
      enqueueSnackbar("Please add at least one author", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (book.stock_quantity <= 0) {
      enqueueSnackbar("Stock quantity must be greater than 0", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (book.num_pages <= 0) {
      enqueueSnackbar("Page count must be greater than 0", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (book.title === "") {
      enqueueSnackbar("Title cannot be empty", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (book.publisher === "") {
      enqueueSnackbar("Publisher cannot be empty", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    return true;
  };

  // const handleCreateBook = async () => {
  //   setLoading(true);
  //   if (!handleValidateBook()) {
  //     setLoading(false);
  //     return;
  //   }
  //   let data = null;
  //   if (props.isEditing) {
  //     if (!props.book) {
  //       return;
  //     }
  //     data = await updateBook(props.book.id, book);
  //   } else data = await createBook(book);
  //   if (!data) {
  //     enqueueSnackbar("Something went wrong. Please try again later", {
  //       variant: "error",
  //       preventDuplicate: true,
  //     });
  //     setLoading(false);
  //     return;
  //   }
  //   enqueueSnackbar(
  //     `Book ${props.isEditing ? "updated" : "created"} successfully`,
  //     {
  //       variant: "success",
  //       preventDuplicate: true,
  //     }
  //   );
  //   setLoading(false);
  //   setBook(initialValues);
  //   props.onClose();
  // }; // const handleCreateBook = async () => {
  //   setLoading(true);
  //   if (!handleValidateBook()) {
  //     setLoading(false);
  //     return;
  //   }
  //   let data = null;
  //   if (props.isEditing) {
  //     if (!props.book) {
  //       return;
  //     }
  //     data = await updateBook(props.book.id, book);
  //   } else data = await createBook(book);
  //   if (!data) {
  //     enqueueSnackbar("Something went wrong. Please try again later", {
  //       variant: "error",
  //       preventDuplicate: true,
  //     });
  //     setLoading(false);
  //     return;
  //   }
  //   enqueueSnackbar(
  //     `Book ${props.isEditing ? "updated" : "created"} successfully`,
  //     {
  //       variant: "success",
  //       preventDuplicate: true,
  //     }
  //   );
  //   setLoading(false);
  //   setBook(initialValues);
  //   props.onClose();
  // };

  const handleFetchBooks = async () => {
    const data = await fetchBookFromFrappeApi(limit, title);
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
      return;
    }
    setImportedBooks(data["books"]);
    enqueueSnackbar(`Fetched ${data["count"]} books`, {
      variant: "success",
      preventDuplicate: true,
    });
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Container sx={{ width: "900px" }}>
          <Typography level="h2">Import Books</Typography>
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
              <Typography>Title Keyword(s)</Typography>
              <Input
                placeholder="Title (ex: Harry Potter)"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <Typography>Number of books</Typography>
              <Input
                placeholder="Page count"
                required
                value={limit}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
                onChange={(e) => setLimit(parseInt(e.target.value))}
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
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={handleFetchBooks} loading={loading}>
              Import
            </Button>
          </Stack>
        </Container>
        <Container sx={{ overflow: "auto" }}>
          <Table stickyHeader>
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                  <Checkbox
                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={selectedBookIndices.size == importedBooks.length}
                    onChange={(e) => {
                      const selectedBookIndicesCopy = new Map(
                        selectedBookIndices
                      );
                      if (!e.target.checked) {
                        importedBooks.forEach((_, idx) => {
                          selectedBookIndicesCopy.delete(idx);
                        });
                        setSelectedBookIndices(selectedBookIndicesCopy);
                      } else {
                        importedBooks.forEach((_, idx) => {
                          selectedBookIndicesCopy.set(idx, true);
                        });
                        setSelectedBookIndices(selectedBookIndicesCopy);
                      }
                    }}
                    sx={{ verticalAlign: "sub" }}
                  />
                </th>
                <th style={{ width: "40%" }}>Book Title</th>
                <th>Author</th>
                <th>Publisher</th>
              </tr>
            </thead>
            <tbody>
              {importedBooks.map((book, idx) => (
                <tr>
                  <td>
                    <Checkbox
                      checked={
                        selectedBookIndices.has(idx) &&
                        selectedBookIndices.get(idx)
                      }
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setSelectedBookIndices((prev) => {
                            prev.delete(idx);
                            return new Map(prev);
                          });
                        } else {
                          setSelectedBookIndices((prev) => {
                            prev.set(idx, true);
                            return new Map(prev);
                          });
                          console.log(selectedBookIndices);
                        }
                      }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.authors.join(", ")}</td>
                  <td>{book.publisher}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Container>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              marginTop: 3,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                if (selectedBookIndices.size === 0) {
                  enqueueSnackbar("Please select atleast one book to proceed", {
                    variant: "error",
                    preventDuplicate: true,
                  });
                  return;
                }
                
              }}
            >
              Add to Library
            </Button>
          </Stack>
        </Container>
      </ModalDialog>
    </Modal>
  );
};

export default ImportBookModal;
