import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  books: Book[] = [];
  isLoading: boolean = true;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    const searchQuery = 'horror';
    this.bookService.searchBooks(searchQuery).subscribe(
      (response) => {
        this.books = response.docs.slice(0, 21);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.isLoading = false;
      }
    );
  }
}
