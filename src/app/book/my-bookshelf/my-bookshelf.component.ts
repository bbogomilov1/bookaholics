import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/types/book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-my-bookshelf',
  templateUrl: './my-bookshelf.component.html',
  styleUrls: ['./my-bookshelf.component.css'],
})
export class MyBookshelfComponent implements OnInit {
  books: Book[] = [];
  wishlistBooks: Book[] = [];
  readBooks: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooksFromBookshelf();
  }

  fetchBooksFromBookshelf() {
    this.bookService.getAllBooksFromBookshelf().subscribe((books) => {
      console.log(books);

      this.wishlistBooks = Object.values(books).filter(
        (book) => book.shelf === 'wishlist'
      );
      this.readBooks = Object.values(books).filter(
        (book) => book.shelf === 'read'
      );
    });
  }
}
