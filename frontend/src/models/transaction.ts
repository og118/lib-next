export enum Status {
    Pending = "PENDING",
    Completed = "COMPLETED",
}

export type Transaction = {
    id: number;
    user_id: number;
    book_id: number;
    status: Status;
    created_at: string;
    updated_at: string;
}

export type TransactionInput = {
    user_id: number;
    book_id: number;
}