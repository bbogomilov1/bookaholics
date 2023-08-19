import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/types/book';
import { faBookmark, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { Subscription, switchMap, of } from 'rxjs';
import { LibraryService } from './library.service';
import { BookService } from '../book.service';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit, OnDestroy {
  faBookmark = faBookmark;
  faSquareCheck = faSquareCheck;

  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

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
  errorMessage: string = '';

  private fetchBooksSubscription: Subscription | null = null;
  private searchSubscription: Subscription | null = null;
  private addToReadSubscription: Subscription | null = null;
  private addToWishlistSubscription: Subscription | null = null;
  private fetchBooksFromBookshelfSubscription: Subscription | null = null;

  constructor(
    private libraryService: LibraryService,
    private bookService: BookService,
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchBooksFromBookshelf();
  }

  get isUserLoggedIn(): boolean {
    return !!this.userService.getLoggedInUserEmail();
  }

  toggleReadStatus(book: Book) {
    if (book.shelf === 'read') {
      this.removeFromReadBooks(book);
    } else {
      this.addToReadBooks(book);
    }
  }

  toggleWishlistStatus(book: Book) {
    if (book.shelf === 'wishlist') {
      this.removeFromWishlistBooks(book);
    } else {
      this.addToWishlistBooks(book);
    }
  }

  addToReadBooks(book: Book) {
    book.shelf = 'read';

    this.addToReadSubscription = this.bookService
      .addToBookshelf(book)
      .subscribe(
        (response) => {},
        (error) => {
          this.isLoading = false;
          this.errorMessage =
            'An error occurred while adding the book to read bookshelf. Please try again later.';
          throw new Error('Error adding book:', error.message);
        }
      );
  }

  removeFromReadBooks(book: Book) {
    if (book.shelf !== 'read') {
      return;
    }

    this.bookService.removeFromBookshelf(book).subscribe(
      (response) => {
        book.shelf = '';
      },
      (error) => {
        book.shelf = 'read';
        this.errorMessage =
          'An error occurred while removing the book from read bookshelf. Please try again later.';
        throw new Error('Error removing book:', error.message);
      }
    );
  }

  addToWishlistBooks(book: Book) {
    book.shelf = 'wishlist';

    this.addToWishlistSubscription = this.bookService
      .addToBookshelf(book)
      .subscribe(
        (response) => {},
        (error) => {
          this.isLoading = false;
          this.errorMessage =
            'An error occurred while adding the book to wishlist bookshelf. Please try again later.';
          throw new Error('Error adding book:', error.message);
        }
      );
  }

  removeFromWishlistBooks(book: Book) {
    if (book.shelf !== 'wishlist') {
      return;
    }

    this.bookService.removeFromBookshelf(book).subscribe(
      (response) => {
        book.shelf = '';
      },
      (error) => {
        book.shelf = 'read';
        this.errorMessage =
          'An error occurred while removing the book from wishlist bookshelf. Please try again later.';
        throw new Error('Error removing book:', error.message);
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
          this.isLoading = false;
          this.buttonLessIsLoading = false;
          this.buttonMoreIsLoading = false;
          this.errorMessage =
            'An error occurred while loading the books. Please try again later.';
          throw new Error('Error fetching books:', error.message);
        }
      );
  }

  fetchBooksFromBookshelf() {
    this.fetchBooksFromBookshelfSubscription =
      this.authService.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          this.http
            .get<{ [key: string]: User }>(`${this.firebaseUrl}/users.json`)
            .pipe(
              switchMap((users) => {
                const userIds = Object.keys(users);

                const userId = userIds.find(
                  (id) => users[id].email === currentUser.email
                );

                if (userId) {
                  return this.bookService.getAllBooksFromBookshelf(userId);
                } else {
                  return of(null);
                }
              })
            )
            .subscribe(
              (books) => {
                if (!books) {
                  books = {};
                }

                this.bookshelfBooks = Object.values(books);

                if (
                  this.searchQuery === '' ||
                  this.searchQuery === 'classics'
                ) {
                  this.fetchBooks();
                } else {
                  this.searchBooks();
                }

                this.books.forEach((book) => {
                  const currBook = this.bookshelfBooks.find(
                    (b) => b._version_ === book._version_
                  );

                  if (currBook) {
                    book.shelf = currBook.shelf;
                  }
                });
                this.isLoading = false;
              },
              (error) => {
                console.error('Error fetching books:', error);
                this.isLoading = false;
              }
            );
        } else {
          if (this.searchQuery === '' || this.searchQuery === 'classics') {
            this.fetchBooks();
          } else {
            this.searchBooks();
          }
          this.isLoading = false;
        }
      });
  }

  searchBooks() {
    this.isSearching = true;
    this.isLoading = true;

    this.fetchBooksFromBookshelfSubscription =
      this.authService.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          this.http
            .get<{ [key: string]: User }>(`${this.firebaseUrl}/users.json`)
            .pipe(
              switchMap((users) => {
                const userIds = Object.keys(users);

                const userId = userIds.find(
                  (id) => users[id].email === currentUser.email
                );

                if (userId) {
                  return this.bookService.getAllBooksFromBookshelf(userId);
                } else {
                  return of(null);
                }
              })
            )
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
                        book.title &&
                        book.author_name &&
                        book.author_name.length > 0
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
                    this.isLoading = false;
                    this.buttonLessIsLoading = false;
                    this.buttonMoreIsLoading = false;
                    this.errorMessage =
                      'An error occurred while loading the books. Please try again later.';
                    throw new Error('Error fetching books:', error.message);
                  }
                );
            });
        } else {
          this.searchSubscription = this.libraryService
            .searchBooks(this.searchQuery, this.booksToShow)
            .subscribe(
              (response) => {
                const fetchedBooks = response.docs.filter(
                  (book) =>
                    book.title &&
                    book.author_name &&
                    book.author_name.length > 0
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
                this.isLoading = false;
                this.buttonLessIsLoading = false;
                this.buttonMoreIsLoading = false;
                this.errorMessage =
                  'An error occurred while loading the books. Please try again later.';
                throw new Error('Error fetching books:', error.message);
              }
            );
        }
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
