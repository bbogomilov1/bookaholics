import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  books: any[] = []; // Replace 'any[]' with the appropriate data type of the books

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    const searchQuery = 'fantasy';
    this.bookService.searchBooks(searchQuery).subscribe(
      (response) => {
        this.books = response.docs; // The 'docs' property contains the array of books from the API response
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }
}
