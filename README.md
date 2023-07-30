# Bookaholics - A Book-Lover's Paradise :books:

## Introduction

Welcome to Bookaholics, a website created for book enthusiasts to explore, discover, and share their favorite books. Whether you're an avid reader, a casual bookworm, or simply looking for your next literary adventure, Bookaholics has something for everyone.

## Project Architecture

The Bookaholics project follows a modular and component-based architecture, built using Angular, a popular web application framework. The architecture promotes scalability, maintainability, and code reusability.

### Components

1. **Navbar Component**

   - Description: The Navbar component provides navigation links to various sections of the website.
   - Structure:
     - Home
     - Library
     - My Books (Viisible when user is logged in)
     - Login/Register (or User Profile when user is logged in)
     - Logout (Visible when user is logged in)

2. **Home Component**

   - Description: The Home component displays an overview of what the website is about and welcomes users.

3. **Library Component**

   - Description: The Library component showcases all available books using data fetched from the Open Library API.
   - Features:
     - Search Bar: Allows users to search for books by title, author, or any relevant keywords.

4. **My Books Component**

   - Description: The My Books component displays the books the user has read, allowing them to revisit their literary journey.
   - Features:
     - Search Bar: Enables users to search for their books by title or author.

5. **Add Book Component**

   - Description: The Add Book component enables users to add books of their own, especially if they cannot find them in the Library.
   - Features:
     - Form: Allows users to provide book details such as title, author, description, etc.
     - Submit: Adds the book to the user's collection.

6. **Edit Book Component**
   - Description: The Edit Book component enables users to edit the details of the books they have added.
   - Features:
     - Form: Allows users to modify book details.
     - Update: Saves the changes made to the book.

### Services

1. **Book Service**

   - Description: The Book Service handles data retrieval from the Open Library API for the Library component.
   - Responsibilities:
     - Fetching books from the Open Library API based on user searches.
     - Providing book data to the Library component.

2. **User Service**
   - Description: The User Service manages user-related functionalities, including authentication and user-specific data.
   - Responsibilities:
     - User Registration
     - User Login
     - User Logout
     - User-specific operations such as adding and editing books.

## Conclusion

With Bookaholics, users can dive into the world of books, explore vast libraries, and create their own literary space. The project's architecture and component-based design provide a foundation for further expansion and improvement. Enjoy creating and happy reading! :books:

# Bookaholics

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
