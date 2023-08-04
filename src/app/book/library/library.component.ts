import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
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
