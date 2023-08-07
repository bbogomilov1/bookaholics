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

  toggleReadStatus(book: Book) {
    if (book.shelf === 'read') {
      this.removeFromReadBooks(book);
    } else {
      this.addToReadBooks(book);
    }
  }

  addToReadBooks(book: Book) {
    const bookIsAdded = this.bookshelfBooks.filter(
      (b) => b.title === book.title
    );

    if (!bookIsAdded) {
      return;
    }
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

  removeFromReadBooks(book: Book) {
    if (book.shelf !== 'read') {
      return;
    }

    this.addToReadSubscription = this.bookService
      .removeFromBookshelf(book)
      .subscribe(
        (response) => {
          console.log('Removed from My Books:', book.title);
          // Once the book is successfully removed from the bookshelf, set its shelf to an empty string
          book.shelf = '';
        },
        (error) => {
          console.error('Error removing book:', error);
          // If there's an error, set the shelf back to 'read'
          book.shelf = 'read';
        }
      );
  }

  addToWishList(book: Book) {
    const bookIsAdded = this.bookshelfBooks.filter(
      (b) => b.title === book.title
    );

    if (!bookIsAdded) {
      return;
    }

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
            this.bookshelfBooks.map((book) => book._version_)
          );

          fetchedBooks.forEach((book) => {
            if (bookshelfTitles.has(book._version_)) {
              const currBook = this.bookshelfBooks.find(
                (b) => b._version_ === book._version_
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
