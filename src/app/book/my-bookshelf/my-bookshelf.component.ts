import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/types/book';
import { BookService } from '../book.service';
import { faBookmark, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
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

  books: Book[] = [];
  wishlistBooks: Book[] = [];
  readBooks: Book[] = [];
  isLoading: boolean = true;

  private fetchBooksFromBookshelfSubscription: Subscription | null = null;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchBooksFromBookshelf();
  }

  removeFromReadBooks(book: Book) {
    if (book.shelf !== 'read') {
      return;
    }

    this.bookService.removeFromBookshelf(book).subscribe(
      (response) => {
        console.log('Removed from My Books:', book.title);

        const bookIndex = this.readBooks.findIndex(
          (b) => b._version_ === book._version_
        );
        if (bookIndex !== -1) {
          this.readBooks.splice(bookIndex, 1);
        }
      },
      (error) => {
        console.error('Error removing book:', error);
        // If there's an error, set the shelf back to 'read'
        book.shelf = 'read';
      }
    );
  }

  removeFromWishlistBooks(book: Book) {
    if (book.shelf !== 'wishlist') {
      return;
    }

    this.bookService.removeFromBookshelf(book).subscribe(
      (response) => {
        console.log('Removed from My Books:', book.title);

        const bookIndex = this.wishlistBooks.findIndex(
          (b) => b._version_ === book._version_
        );
        if (bookIndex !== -1) {
          this.wishlistBooks.splice(bookIndex, 1);
        }
      },
      (error) => {
        console.error('Error removing book:', error);
        // If there's an error, set the shelf back to 'wishlist'
        book.shelf = 'wishlist';
      }
    );
  }

  fetchBooksFromBookshelf() {
    this.fetchBooksFromBookshelfSubscription =
      this.authService.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          this.http
            .get<{ [key: string]: User }>(
              `https://bookaholics-966d8-default-rtdb.firebaseio.com/users.json`
            )
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
                console.error('Error fetching books:', error);
                this.isLoading = false;
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

          // Handle case when user is not logged in
        }
      });
  }

  ngOnDestroy(): void {
    this.fetchBooksFromBookshelfSubscription?.unsubscribe();
  }
}
