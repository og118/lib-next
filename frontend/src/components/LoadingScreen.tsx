import { Modal, ModalDialog, Typography, CircularProgress, Stack } from "@mui/joy"

interface LoadingScreenProps {
    loading: boolean
}

const LoadingScreen = ({loading}: LoadingScreenProps) => {
    return <Modal open={loading}>
    <ModalDialog>
      <Stack sx={{
        justifyContent: "center",
        alignItems: "center",
      }} spacing={3}>
      <Typography>Fetching your precious data.....</Typography>
      <CircularProgress />
      </Stack>
    </ModalDialog>
  </Modal>
}

export default LoadingScreen