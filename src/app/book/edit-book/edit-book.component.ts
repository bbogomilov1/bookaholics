import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';
import { coverUrlValidator } from 'src/app/shared/validators/cover-url-validator';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
})
export class EditBookComponent implements OnInit {
  editBookForm: FormGroup;
  version: string | null = null;
  errorMessage: string = '';
  yearsRange: number[] = this.generateYearsRange(
    1800,
    new Date().getFullYear()
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {
    this.editBookForm = this.fb.group({
      title: ['', Validators.required],
      cover: ['', coverUrlValidator()],
      author: ['', Validators.required],
      publishedYear: ['', Validators.required],
      genre: ['', Validators.required],
      shelf: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.version = params.get('version');

      if (this.version) {
        this.bookService.getBookByVersion(this.version).subscribe(
          (book: Book | null) => {
            if (book) {
              this.editBookForm.patchValue({
                title: book.title,
                cover: book.customCoverUrl || '',
                author: book.author_name || '',
                publishedYear: book.first_publish_year || '',
                genre: book.subject ? book.subject.join(', ') : '',
                shelf: book.shelf,
              });
            } else {
              this.errorMessage = 'Book was not found. Please try again';
            }
          },
          (error) => {
            this.errorMessage =
              'An error occurred while editing the book. Please try again later.';
            throw new Error('Error adding book:', error.message);
          }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.version) {
      const updatedBook: Book = {
        title: this.editBookForm.value.title,
        customCoverUrl: this.editBookForm.value.cover,
        author_name: [this.editBookForm.value.author],
        first_publish_year: this.editBookForm.value.publishedYear,
        subject: [this.editBookForm.value.genre],
        shelf: this.editBookForm.value.shelf,
        _version_: this.version,
      };

      this.bookService.updateInBookshelf(updatedBook).subscribe(
        (response) => {
          this.router.navigate(['/my-bookshelf']);
        },
        (error) => {
          this.errorMessage =
            'An error occurred while editing the book. Please try again later.';
          throw new Error('Error adding book:', error.message);
        }
      );
    }
  }

  generateYearsRange(startYear: number, endYear: number): number[] {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }
}
