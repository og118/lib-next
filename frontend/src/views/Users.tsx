import { Box, Button, Stack, Table } from "@mui/joy";
import DashboardContainer from "../components/DashboardContainer";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import LoadingScreen from "../components/LoadingScreen";
import { User } from "../models/user";
import CreateUserModal from "../components/Users/CreateUserModal";
import DeleteUserModal from "../components/Users/DeleteUserModal";
import { fetchAllUsers } from "../api/user";

const Users = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);

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
      <h1>Users</h1>
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
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Name</th>
            <th>Email</th>
            <th></th>
            <th></th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button
                  onClick={() => {
                    setUserToEdit(user);
                    setOpenDeleteUserDialog(true);
                  }}
                >
                  Delete
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => {
                    setUserToEdit(user);
                    setOpenEditUserDialog(true);
                  }}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </thead>
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
      {userToEdit && <DeleteUserModal
        open={openDeleteUserDialog}
        onClose={() => {
          handleFetchUsers();
          setOpenDeleteUserDialog(false);
        }}
        user={userToEdit!}
      />}
    </DashboardContainer>
  );
};

export default Users;
