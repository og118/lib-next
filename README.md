# LibNext

LibNext is an open-source Library Management Suite designed to track book availability and user credit in libraries efficiently.



## Features
- **Create, Update, and Delete Books:** Librarians can easily add new books, update existing book details, and remove outdated or irrelevant entries.
 ![image](https://github.com/og118/lib-next/assets/63297841/ed428704-1f50-46e6-aa22-c288534eb74d)
- **Create, Update, and Delete Users:** LibNext provides tools for librarians to maintain an updated user database, making it easy to manage library memberships.
 ![image](https://github.com/og118/lib-next/assets/63297841/24290a29-2361-40c1-af7b-6f342d6f91e3)

- **Issue Books to Users:** Librarians can issue books to users based on certain conditions:
  - The book must be in stock.
  - The user's credit should not exceed a specified threshold.
![image](https://github.com/og118/lib-next/assets/63297841/68c1aecf-73d4-44ca-a8cc-e980458beed8)

- **Import Books from Frappe Books API:** LibNext allows librarians to import books seamlessly from the open-source Frappe Books API. Key features include:
  - Limiting the number of books fetched from the API.
  - Including specific keywords from the book titles during the import process.
![image](https://github.com/og118/lib-next/assets/63297841/98d10dc6-a327-4ca4-a54e-93d41a897688)


## Getting Started
Clone the project into your local machine using the following command
```
git clone https://github.com/og118/lib-next/
```

The repository contains 2 main directories
1. `server` - Contains the backend code (Written in FastAPI)
2. `frontend` - Contains the frontend code (Written in React, Typescript)

The relevant documentation for setting up the frontend and backend can be found in their respective READMEs

[Setting up Frontend](https://github.com/og118/lib-next/blob/master/frontend/README.md) \
[Setting up Backend](https://github.com/og118/lib-next/blob/master/server/README.md)


## Contributing

LibNext is an open-source project, and contributions are welcome! If you have ideas for improvements or new features, feel free to submit a pull request or open an issue.


Happy reading with LibNext!
