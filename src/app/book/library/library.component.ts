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
  buttonIsLoading: boolean = false;
  private booksToShow: number = 9;
  totalBooks: number = 0;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    const searchQuery = 'hunger games';
    this.bookService.searchBooks(searchQuery, this.booksToShow).subscribe(
      (response) => {
        console.log(response);

        const fetchedBooks = response.docs.filter(
          (book) =>
            book.title && book.author_name && book.author_name.length > 0
        );
        this.books = fetchedBooks;
        this.totalBooks = response.numFound;
        this.isLoading = false;
        this.buttonIsLoading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.isLoading = false;
      }
    );
  }

  loadMoreBooks() {
    this.buttonIsLoading = true;

    this.booksToShow += 9;
    this.fetchBooks();
  }
}
