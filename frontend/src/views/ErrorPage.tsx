import { Button, Container, SvgIcon, Typography } from "@mui/joy";
// import { ReactComponent as FailSvg } from "../assets/fail.svg";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <SvgIcon
        sx={{
          width: "40%",
          height: "40%",
        }}
      >
        {/* TODO: fix the icon import */}
        {/* <FailSvg /> */}
      </SvgIcon>
      <Typography sx={{ fontStyle: "italic", mt: 5 }}>
        Unicorn speaks. “The page you are looking for isn’t here. It might be
        somewhere else, or it may never have existed. This world is ephemeral,
        always changing. But take heart: all is not lost.
      </Typography>{" "}
      <Typography sx={{ marginTop: "1rem" }}>{error?.message}</Typography>
      <Button
        variant="soft"
        sx={{ marginTop: "1rem" }}
        onClick={() => (window.location.href = "/")}
      >
        Go back to home
      </Button>
    </Container>
  );
}
