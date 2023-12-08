import { enqueueSnackbar } from "notistack";

export const errorToast = (message?: string) =>
  enqueueSnackbar(
    message ? message : "Something went wrong. Please try again later",
    {
      variant: "error",
      preventDuplicate: true,
    }
  );

export const successToast = (message?: string) =>
  enqueueSnackbar(message ? message : "Success!", {
    variant: "success",
    preventDuplicate: true,
  });
