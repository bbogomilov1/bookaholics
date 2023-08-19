import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/types/book';
import { BookService } from '../book.service';
import {
  faBookmark,
  faSquareCheck,
  faPencilSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription, switchMap, of } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-my-bookshelf',
  templateUrl: './my-bookshelf.component.html',
  styleUrls: ['./my-bookshelf.component.css'],
})
export class MyBookshelfComponent implements OnInit, OnDestroy {
  faBookmark = faBookmark;
  faSquareCheck = faSquareCheck;
  faPencil = faPencilSquare;

  errorMessage: string = '';

  books: Book[] = [];
  wishlistBooks: Book[] = [];
  readBooks: Book[] = [];
  isLoading: boolean = true;

  private fetchBooksFromBookshelfSubscription: Subscription | null = null;
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchBooksFromBookshelf();
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
                if (books) {
                  this.wishlistBooks = Object.values(books)
                    .filter((book) => book.shelf === 'wishlist')
                    .reverse();
                  this.readBooks = Object.values(books)
                    .filter((book) => book.shelf === 'read')
                    .reverse();
                }
                this.isLoading = false;
              },
              (error) => {
                this.isLoading = false;
                this.errorMessage =
                  'An error occurred while loading the books. Please try again later.';
                throw new Error('Error fetching books:', error.message);
              },
              () => {
                if (
                  (this.wishlistBooks.length === 0 &&
                    this.readBooks.length === 0) ||
                  this.wishlistBooks.length === 0 ||
                  this.readBooks.length === 0
                ) {
                  this.isLoading = false;
                }
              }
            );
        } else {
          this.isLoading = false;
        }
      });
  }

  removeFromReadBooks(book: Book) {
    if (book.shelf !== 'read') {
      return;
    }

    this.bookService.removeFromBookshelf(book).subscribe(
      (response) => {
        const bookIndex = this.readBooks.findIndex(
          (b) => b._version_ === book._version_
        );
        if (bookIndex !== -1) {
          this.readBooks.splice(bookIndex, 1);
        }
      },
      (error) => {
        book.shelf = 'read';
        this.errorMessage =
          'An error occurred while removing the book from read bookshelf. Please try again later.';
        throw new Error('Error removing book:', error.message);
      }
    );
  }

  removeFromWishlistBooks(book: Book) {
    if (book.shelf !== 'wishlist') {
      return;
    }

    this.bookService.removeFromBookshelf(book).subscribe(
      (response) => {
        const bookIndex = this.wishlistBooks.findIndex(
          (b) => b._version_ === book._version_
        );
        if (bookIndex !== -1) {
          this.wishlistBooks.splice(bookIndex, 1);
        }
      },
      (error) => {
        book.shelf = 'wishlist';
        this.errorMessage =
          'An error occurred while removing the book from wishlist bookshelf. Please try again later.';
        throw new Error('Error removing book:', error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.fetchBooksFromBookshelfSubscription?.unsubscribe();
  }
}
