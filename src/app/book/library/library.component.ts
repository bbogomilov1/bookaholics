import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  faCoffee = faCheck;
  private booksToShow: number = 9;
  searchQuery: string = '';
  books: Book[] = [];
  totalBooks: number = 0;
  isLoading: boolean = true;
  buttonLessIsLoading: boolean = false;
  buttonMoreIsLoading: boolean = false;
  isSearching: boolean = false;

  currentSearchQuery: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.fetchBooks();
  }

  addToMyBooks(book: Book) {
    // Implement the logic to add the book to the user's library
    console.log('Added to My Books:', book.title);
  }

  removeFromMyBooks(book: Book) {
    // Implement the logic to remove the book from the user's library
    console.log('Removed from My Books:', book.title);
  }

  addToWishList(book: Book) {
    // Implement the logic to add the book to the user's wish list
    console.log('Added to Wish List:', book.title);
  }

  fetchBooks(searchQuery: string = 'classics') {
    this.currentSearchQuery = searchQuery;

    this.bookService.searchBooks(searchQuery, this.booksToShow).subscribe(
      (response) => {
        console.log(response);

        const fetchedBooks = response.docs.filter(
          (book) =>
            book.title && book.author_name && book.author_name.length > 0
        );
        this.books = fetchedBooks;
        this.totalBooks = response.numFound;
        this.isLoading = false;
        this.buttonLessIsLoading = false;
        this.buttonMoreIsLoading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.isLoading = false;
        this.buttonLessIsLoading = false;
        this.buttonMoreIsLoading = false;
      }
    );
  }

  loadLessBooks() {
    if (this.booksToShow <= 9) {
      return;
    }

    this.buttonLessIsLoading = true;
    this.booksToShow -= 9;

    if (!this.isSearching) {
      this.fetchBooks(this.currentSearchQuery);
    } else {
      this.searchBooks();
    }
  }

  loadMoreBooks() {
    this.buttonMoreIsLoading = true;
    this.booksToShow += 9;

    if (!this.isSearching) {
      this.fetchBooks(this.currentSearchQuery);
    } else {
      this.searchBooks();
    }
  }

  searchBooks() {
    this.isSearching = true;

    this.bookService.searchBooks(this.searchQuery, this.booksToShow).subscribe(
      (response) => {
        const fetchedBooks = response.docs.filter(
          (book) =>
            book.title && book.author_name && book.author_name.length > 0
        );
        this.books = fetchedBooks;
        this.totalBooks = response.numFound;
        this.isLoading = false;
        this.buttonLessIsLoading = false;
        this.buttonMoreIsLoading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.isLoading = false;
        this.buttonLessIsLoading = false;
        this.buttonMoreIsLoading = false;
      }
    );
  }
}
