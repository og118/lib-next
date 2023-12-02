import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import { useState } from "react";

const Header = () => {
  const [path, _] = useState(
    window.location.href.split("/")[window.location.href.split("/").length - 1]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/checkout"
          aria-pressed={path === "checkout"}
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          Checkout
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          aria-pressed={path === "users"}
          href="/users"
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          Users
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/books"
          aria-pressed={path === "books"}
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          Books
        </Button>
      </Stack>
    </Box>
  );
};

export default Header;
