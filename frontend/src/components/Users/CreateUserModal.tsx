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
import { User, UserInput } from "../../models/user";
import { createUser, updateUser } from "../../api/user";
import { useSnackbar } from "notistack";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  user?: User;
}

const initialValues: UserInput = {
  name: "",
  email: "",
};

const CreateUserModal = (props: CreateUserModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState<UserInput>(props.user ?? initialValues);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.user && props.isEditing) {
      setUser(props.user);
    }
  }, [props.user, props.isEditing]);

  const handleClose = () => {
    setLoading(false);
    setUser(initialValues);
    props.onClose();
  }

  const handleValidateUser = () => {
    if (user.name === "") {
      enqueueSnackbar("Please provide a name", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    if (user.email === "") {
      enqueueSnackbar("Please provide an email", {
        variant: "error",
        preventDuplicate: true,
      });
      return false;
    }
    return true;
  };

  const handleCreateUser = async () => {
    setLoading(true);
    if (!handleValidateUser()) {
      setLoading(false);
      return;
    }
    let data = null;
    if (props.isEditing) {
      if (!props.user) {
        return;
      }
      data = await updateUser(props.user.id, user);
    } else data = await createUser(user);
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return
    }
    enqueueSnackbar(
      `User ${props.isEditing ? "updated" : "created"} successfully`,
      {
        variant: "success",
        preventDuplicate: true,
      }
    );
    handleClose();
  };

  return (
    <Modal open={props.open} onClose={handleClose}>
      <ModalDialog size="lg">
        <ModalClose />
        <Container>
          <Typography level="h2">
            {props.isEditing ? "Edit user" : "Create a new user"}
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
              <Typography>Name</Typography>
              <Input
                placeholder="Name"
                required
                value={user.name}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
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
              <Typography>Email</Typography>
              <Input
                placeholder="Email"
                required
                value={user.email}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreateUser} loading={loading}>
              {props.isEditing ? "Save" : "Create"}
            </Button>
          </Stack>
        </Container>
      </ModalDialog>
    </Modal>
  );
};

export default CreateUserModal;
