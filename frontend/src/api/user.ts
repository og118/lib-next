import axios from "axios";
import { BACKEND_URL } from "../constants";
import { UserInput } from "../models/user";

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(BACKEND_URL + "/users");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchUser = async (id: number) => {
  try {
    const response = await axios.get(BACKEND_URL + `/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async (user: UserInput) => {
  try {
    const response = await axios.post(BACKEND_URL + "/users", user);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUser = async (id: number, user: UserInput) => {
  try {
    const body = {
      email: user.email,
      name: user.name
    }
    const response = await axios.patch(BACKEND_URL + `/users/${id}`, body);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(BACKEND_URL + `/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
