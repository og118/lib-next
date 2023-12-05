import axios from "axios";
import { BACKEND_URL } from "../constants";
import { BookInput } from "../models/book";

export const fetchAllBooks = async () => {
  try {
    const response = await axios.get(BACKEND_URL + "/books");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchBook = async (id: number) => {
  try {
    const response = await axios.get(BACKEND_URL + `/books/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchBookFromFrappeApi = async (limit: number = 10, includes: string = '') => {
  try { 
    let filterQuery = `?limit=${limit}`;
    if(includes !== '') filterQuery+=`&includes=${includes}`

    const response = await axios.get(BACKEND_URL + `/books/import/frappe${filterQuery}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createBook = async (book: BookInput) => {
  try {
    const response = await axios.post(BACKEND_URL + "/books", book);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateBook = async (id: number, book: BookInput) => {
  try {
    const response = await axios.patch(BACKEND_URL + `/books/${id}`, book);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const deleteBook = async (id: number) => {
  try {
    const response = await axios.delete(BACKEND_URL + `/books/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
