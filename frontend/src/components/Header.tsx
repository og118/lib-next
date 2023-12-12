import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {
  Container,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { AutoStories, LocalAtm, People } from "@mui/icons-material";

const Header = () => {
  const path =
    window.location.href.split("/")[window.location.href.split("/").length - 1];

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginTop: "10px",
        }}
      >
        <Typography level="h1">LibNext</Typography>
        <List sx={{ flexGrow: 0 }} role="menubar" orientation="horizontal">
          <ListItem role="none">
            <ListItemButton
              role="menuitem"
              component="a"
              href="/books"
              selected={path == "books"}
            >
              <ListItemDecorator>
                <AutoStories />
              </ListItemDecorator>
              Books
            </ListItemButton>
          </ListItem>
          <ListDivider />
          <ListItem role="none">
            <ListItemButton
              role="menuitem"
              component="a"
              href="/users"
              selected={path == "users"}
            >
              <ListItemDecorator>
                <People />
              </ListItemDecorator>
              Users
            </ListItemButton>
          </ListItem>
          <ListDivider />
          <ListItem role="none">
            <ListItemButton
              role="menuitem"
              component="a"
              href="/checkout"
              selected={path == "checkout"}
            >
              <ListItemDecorator>
                <LocalAtm />
              </ListItemDecorator>
              Checkout
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};

export default Header;
