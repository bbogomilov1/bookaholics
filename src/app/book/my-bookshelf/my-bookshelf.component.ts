import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/types/book';
import { BookService } from '../book.service';
import { faBookmark, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

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

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooksFromBookshelf();
  }

  fetchBooksFromBookshelf() {
    this.fetchBooksFromBookshelfSubscription = this.bookService
      .getAllBooksFromBookshelf()
      .subscribe(
        (books) => {
          this.wishlistBooks = Object.values(books).filter(
            (book, index, books) =>
              book.shelf === 'wishlist' &&
              index === books.findIndex((b) => b.title === book.title)
          );
          this.readBooks = Object.values(books).filter(
            (book, index, books) =>
              book.shelf === 'read' &&
              index === books.findIndex((b) => b.title === book.title)
          );
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching books:', error);
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy(): void {
    this.fetchBooksFromBookshelfSubscription?.unsubscribe();
  }
}
