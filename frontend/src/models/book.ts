export type Book = {
    id: number;
    title: string;
    authors: string[];
    publisher: string;
    language_code: string;
    num_pages: number;
    stock_quantity: number;
    isbn: string;
    isbn13: string;
    publication_date: string;
    created_at: string;
    updated_at: string;
}

export const defaultBook = {
    stock_quantity: 0
}

export type BookInput = {
    title: string;
    authors: string[];
    publisher: string;
    language_code?: string;
    num_pages: number;
    stock_quantity: number;
    isbn?: string;
    isbn13?: string;
    publication_date?: string;
}
