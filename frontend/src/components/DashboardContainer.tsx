import { Container } from "@mui/joy";
import Header from "./Header";
import { ReactNode } from "react";

const DashboardContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <Container maxWidth="xl">{children}</Container>
    </>
  );
};

export default DashboardContainer;
