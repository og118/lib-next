import {
  Button,
  Chip,
  Container,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { forwardRef, useEffect, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Book, BookInput } from "../../models/book";
import { createBook, updateBook } from "../../api/book";
import { useSnackbar } from "notistack";

interface CreateBookModalProps {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  book?: Book;
}

interface NumericProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatAdapter = forwardRef<NumericFormatProps, NumericProps>(
  function NumericFormatAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
      />
    );
  }
);

const initialValues: BookInput = {
  title: "",
  authors: [],
  publisher: "",
  stock_quantity: 0,
  num_pages: 0,
};

const CreateBookModal = (props: CreateBookModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [book, setBook] = useState<BookInput>(props.book ?? initialValues);
  const [currentAuthor, setCurrentAuthor] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.book && props.isEditing) {
      setBook(props.book);
    }
  }, [props.book]);

  const handleValidateBook = () => {
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

  const handleCreateBook = async () => {
    setLoading(true);
    if (!handleValidateBook()) {
      setLoading(false);
      return;
    }
    let data = null;
    if (props.isEditing) {
      if (!props.book) {
        return;
      }
      data = await updateBook(props.book.id, book);
    } else data = await createBook(book);
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    enqueueSnackbar(
      `Book ${props.isEditing ? "updated" : "created"} successfully`,
      {
        variant: "success",
        preventDuplicate: true,
      }
    );
    setLoading(false);
    setBook(initialValues);
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Container>
          <Typography level="h2">
            {props.isEditing ? "Edit book" : "Create a new book"}
          </Typography>
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
              <Typography>Title</Typography>
              <Input
                placeholder="Title"
                required
                value={book.title}
                onChange={(e) =>
                  setBook((prev) => ({ ...prev, title: e.target.value }))
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
              <Typography>Authors</Typography>
              <Input
                placeholder="Authors"
                required
                value={currentAuthor}
                onChange={(e) => setCurrentAuthor(e.target.value)}
              />
            </Stack>
            <Stack>
              <Stack direction="row" spacing={1}>
                {book.authors.map((author) => (
                  <Chip
                    variant="soft"
                    color="success"
                    sx={{
                      padding: 1,
                    }}
                  >
                    {author}
                  </Chip>
                ))}
              </Stack>
              <Button
                sx={{
                  marginTop: 1,
                }}
                onClick={() => {
                  setBook((prev) => ({
                    ...prev,
                    authors: [...prev.authors, currentAuthor],
                  }));
                  setCurrentAuthor("");
                }}
              >
                Add Author
              </Button>
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
              <Typography>Publishers</Typography>
              <Input
                placeholder="Publisher"
                required
                value={book.publisher}
                onChange={(e) =>
                  setBook((prev) => ({ ...prev, publisher: e.target.value }))
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
              <Typography>Stock</Typography>
              <Input
                placeholder="Stock Quantity"
                required
                value={book.stock_quantity}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
                onChange={(e) =>
                  setBook((prev) => ({
                    ...prev,
                    stock_quantity: Number(e.target.value),
                  }))
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
              <Typography>Page Count</Typography>
              <Input
                placeholder="Page count"
                required
                value={book.num_pages}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
                onChange={(e) =>
                  setBook((prev) => ({
                    ...prev,
                    num_pages: Number(e.target.value),
                  }))
                }
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
            <Button onClick={handleCreateBook} loading={loading}>
              {props.isEditing ? "Save" : "Create"}
            </Button>
          </Stack>
        </Container>
      </ModalDialog>
    </Modal>
  );
};

export default CreateBookModal;
