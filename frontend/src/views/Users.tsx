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
import { useSnackbar } from "notistack";
import LoadingScreen from "../components/LoadingScreen";
import { User } from "../models/user";
import CreateUserModal from "../components/Users/CreateUserModal";
import DeleteUserModal from "../components/Users/DeleteUserModal";
import { fetchAllUsers } from "../api/user";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const UsersPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleSetRowsPerPage = (newRowsPerPage: number) => {
    const start = (pageNumber - 1) * rowsPerPage + 1;
    const newPageNumber = Math.ceil(start / newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPageNumber(newPageNumber);
  };

  const handleFetchUsers = async () => {
    setLoading(true);
    const data = await fetchAllUsers();
    if (!data) {
      enqueueSnackbar("Something went wrong. Please try again later", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    setUsers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    handleFetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContainer>
      <LoadingScreen loading={loading} />
      <Typography level="h2" sx={{ marginY: "25px" }}>
        Users
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenCreateUserDialog(true)}>
            Create User
          </Button>
        </Stack>
      </Box>
      <Table sx={{ width: "auto" }}>
        <thead>
          <tr>
            <th style={{ width: "60%" }}>Name</th>
            <th style={{ width: "30%" }}>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users
            .slice(
              (pageNumber - 1) * rowsPerPage,
              (pageNumber - 1) * rowsPerPage + rowsPerPage
            )
            .map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={() => {
                        setUserToEdit(user);
                        setOpenEditUserDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => {
                        setUserToEdit(user);
                        setOpenDeleteUserDialog(true);
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
                    onChange={(_, val: number | null) =>
                      val !== null && handleSetRowsPerPage(val)
                    }
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
                  users.length
                    ? users.length
                    : (pageNumber - 1) * rowsPerPage + 1 + rowsPerPage - 1}{" "}
                  of {users.length}
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
                      pageNumber === Math.ceil(users.length / rowsPerPage)
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
      <CreateUserModal
        open={openCreateUserDialog || openEditUserDialog}
        isEditing={openEditUserDialog}
        onClose={() => {
          handleFetchUsers();
          setOpenCreateUserDialog(false);
          setOpenEditUserDialog(false);
        }}
        user={userToEdit}
      />
      {userToEdit && (
        <DeleteUserModal
          open={openDeleteUserDialog}
          onClose={() => {
            handleFetchUsers();
            setOpenDeleteUserDialog(false);
          }}
          user={userToEdit!}
        />
      )}
    </DashboardContainer>
  );
};

export default UsersPage;
