import axios from "axios";
import { BACKEND_URL } from "../constants";
import { Status, TransactionInput } from "../models/transaction";

export const fetchAllTransactions = async () => {
  try {
    const response = await axios.get(BACKEND_URL + "/transactions");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateTransaction = async (id: number, status: Status) => {
  try {
    const response = await axios.patch(
      BACKEND_URL + `/transactions/${id}?status=${status}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createTransaction = async (transaction: TransactionInput) => {
  try {
    const response = await axios.post(
      BACKEND_URL + "/transactions",
      transaction
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchTransactionsByUserId = async (user_id: number) => {
  try {
    const response = await axios.get(
      BACKEND_URL + "/transactions/users/" + user_id,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
