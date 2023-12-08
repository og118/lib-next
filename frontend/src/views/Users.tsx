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
import { useContext, useState } from "react";
import { User } from "../models/user";
import CreateUserModal from "../components/Users/CreateUserModal";
import DeleteUserModal from "../components/Users/DeleteUserModal";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import UserModal from "../components/Users/UserModal";
import { AppContext, TAppContext } from "../context/AppContext";
import { handleFetchAllUsers } from "../utils/helper/fetchAllResources";

const UsersPage = () => {
  const { users, setUsers } = useContext<TAppContext>(AppContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState<boolean>(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState<boolean>(false);
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleSetRowsPerPage = (newRowsPerPage: number) => {
    const start = (pageNumber - 1) * rowsPerPage + 1;
    const newPageNumber = Math.ceil(start / newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPageNumber(newPageNumber);
  };

  return (
    <DashboardContainer>
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
                <td
                  onClick={() => {
                    setUserToEdit(user);
                    setOpenUserModal(true);
                  }}
                >
                  {user.name}
                </td>
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
      <UserModal
        open={openUserModal}
        user={userToEdit}
        onClose={() => {
          setOpenUserModal(false);
        }}
      />
      <CreateUserModal
        open={openCreateUserDialog || openEditUserDialog}
        isEditing={openEditUserDialog}
        onClose={() => {
          handleFetchAllUsers(setLoading, setUsers);
          setOpenCreateUserDialog(false);
          setOpenEditUserDialog(false);
        }}
        user={userToEdit}
      />
      {userToEdit && (
        <DeleteUserModal
          open={openDeleteUserDialog}
          onClose={() => {
            handleFetchAllUsers(setLoading, setUsers);
            setOpenDeleteUserDialog(false);
          }}
          user={userToEdit!}
        />
      )}
    </DashboardContainer>
  );
};

export default UsersPage;
