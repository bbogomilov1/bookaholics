import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/types/book';
import { faBookmark, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { LibraryService } from './library.service';
import { BookService } from '../book.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit, OnDestroy {
  faBookmark = faBookmark;
  faSquareCheck = faSquareCheck;

  private booksToShow: number = 9;
  searchQuery: string = '';
  books: Book[] = [];
  totalBooks: number = 0;
  isLoading: boolean = true;
  buttonLessIsLoading: boolean = false;
  buttonMoreIsLoading: boolean = false;
  isSearching: boolean = false;
  currentSearchQuery: string = '';

  private booksSubscription: Subscription | null = null;

  constructor(
    private libraryService: LibraryService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.fetchBooks();
  }

  addToMyBooks(book: Book) {
    book.shelf = 'read';
    this.bookService.addToBookshelf(book).subscribe((response) => {
      console.log('Added to My Books:', book.title);
    });
  }

  removeFromMyBooks(book: Book) {
    // Implement the logic to remove the book from the user's library
    console.log('Removed from My Books:', book.title);
  }

  addToWishList(book: Book) {
    book.shelf = 'wishlist';
    this.bookService.addToBookshelf(book).subscribe((response) => {
      console.log('Added to Wishlist:', book.title);
    });
  }

  fetchBooks(searchQuery: string = 'classics') {
    this.currentSearchQuery = searchQuery;

    this.booksSubscription = this.libraryService
      .searchBooks(searchQuery, this.booksToShow)
      .subscribe(
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

    this.booksSubscription = this.libraryService
      .searchBooks(this.searchQuery, this.booksToShow)
      .subscribe(
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

  ngOnDestroy(): void {
    this.booksSubscription?.unsubscribe();
  }
}
