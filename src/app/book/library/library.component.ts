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
  bookshelfBooks: Book[] = [];
  totalBooks: number = 0;
  isLoading: boolean = true;
  buttonLessIsLoading: boolean = false;
  buttonMoreIsLoading: boolean = false;
  isSearching: boolean = false;
  currentSearchQuery: string = '';

  private fetchBooksSubscription: Subscription | null = null;
  private searchSubscription: Subscription | null = null;
  private addToReadSubscription: Subscription | null = null;
  private addToWishlistSubscription: Subscription | null = null;
  private fetchBooksFromBookshelfSubscription: Subscription | null = null;

  constructor(
    private libraryService: LibraryService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.fetchBooksFromBookshelf();
    // this.fetchBooks();
  }

  addToReadBooks(book: Book) {
    book.shelf = 'read';
    this.addToReadSubscription = this.bookService
      .addToBookshelf(book)
      .subscribe(
        (response) => {
          // this.fetchBooksFromBookshelf.find()
          console.log('Added to My Books:', book.title);
        },
        (error) => {
          console.error('Error adding books:', error);
          this.isLoading = false;
        }
      );
  }

  removeFromMyBooks(book: Book) {
    // Implement the logic to remove the book from the user's library
    console.log('Removed from My Books:', book.title);
  }

  addToWishList(book: Book) {
    book.shelf = 'wishlist';
    this.addToWishlistSubscription = this.bookService
      .addToBookshelf(book)
      .subscribe(
        (response) => {
          console.log('Added to Wishlist:', book.title);
        },
        (error) => {
          console.error('Error adding books:', error);
          this.isLoading = false;
        }
      );
  }

  fetchBooks(searchQuery: string = 'classics') {
    this.currentSearchQuery = searchQuery;

    this.fetchBooksSubscription = this.libraryService
      .searchBooks(searchQuery, this.booksToShow)
      .subscribe(
        (response) => {
          const fetchedBooks = response.docs.filter(
            (book) =>
              book.title && book.author_name && book.author_name.length > 0
          );

          const bookshelfTitles = new Set(
            this.bookshelfBooks.map((book) => book.title)
          );

          fetchedBooks.forEach((book) => {
            if (bookshelfTitles.has(book.title)) {
              const currBook = this.bookshelfBooks.find(
                (b) => b.title === book.title
              );
              if (currBook) {
                book.shelf = currBook.shelf;
              }
            }
          });
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

  fetchBooksFromBookshelf() {
    this.fetchBooksFromBookshelfSubscription = this.bookService
      .getAllBooksFromBookshelf()
      .subscribe(
        (books) => {
          if (!books) {
            books = {};
          }

          this.bookshelfBooks = Object.values(books);

          if (this.searchQuery === '' || this.searchQuery === 'classics') {
            this.fetchBooks();
          } else {
            this.searchBooks();
          }

          this.books.forEach((book) => {
            const currBook = this.bookshelfBooks.find(
              (b) => b.title === book.title
            );

            if (currBook) {
              book.shelf = currBook.shelf;
            }
          });
          // this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching books:', error);
          this.isLoading = false;
        }
      );
  }

  searchBooks() {
    this.isSearching = true;

    this.fetchBooksFromBookshelfSubscription = this.bookService
      .getAllBooksFromBookshelf()
      .subscribe((books) => {
        if (!books) {
          books = {};
        }

        this.bookshelfBooks = Object.values(books);

        this.searchSubscription = this.libraryService
          .searchBooks(this.searchQuery, this.booksToShow)
          .subscribe(
            (response) => {
              const fetchedBooks = response.docs.filter(
                (book) =>
                  book.title && book.author_name && book.author_name.length > 0
              );

              const bookshelfTitles = new Set(
                this.bookshelfBooks.map((book) => book.title)
              );

              fetchedBooks.forEach((book) => {
                if (bookshelfTitles.has(book.title)) {
                  const currBook = this.bookshelfBooks.find(
                    (b) => b.title === book.title
                  );
                  if (currBook) {
                    book.shelf = currBook.shelf;
                  }
                }
              });

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
      });
  }

  loadLessBooks() {
    if (this.booksToShow <= 9) {
      return;
    }

    this.buttonLessIsLoading = true;
    this.booksToShow -= 9;

    this.fetchBooksFromBookshelf();
  }

  loadMoreBooks() {
    this.buttonMoreIsLoading = true;
    this.booksToShow += 9;

    this.fetchBooksFromBookshelf();
  }

  ngOnDestroy(): void {
    this.fetchBooksSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.addToReadSubscription?.unsubscribe();
    this.addToWishlistSubscription?.unsubscribe();
    this.fetchBooksFromBookshelfSubscription?.unsubscribe();
  }
}
