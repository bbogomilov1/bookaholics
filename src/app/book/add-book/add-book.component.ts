import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { coverUrlValidator } from 'src/app/shared/validators/cover-url-validator';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit, OnDestroy {
  bookForm!: FormGroup;
  uuid: string = uuid();
  errorMessage: string = '';
  yearsRange: number[] = this.generateYearsRange(
    1800,
    new Date().getFullYear()
  );

  private bookSubscription: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      cover: ['', coverUrlValidator()],
      author: ['', Validators.required],
      publishedYear: ['', Validators.required],
      genre: ['', Validators.required],
      shelf: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      return;
    }

    const newBook: Book = {
      title: this.bookForm.value.title,
      customCoverUrl: this.bookForm.value.cover,
      author_name: [this.bookForm.value.author],
      first_publish_year: this.bookForm.value.publishedYear,
      subject: [this.bookForm.value.genre],
      shelf: this.bookForm.value.shelf,
      _version_: uuid(),
    };

    this.bookService.addToBookshelf(newBook).subscribe(
      (response) => {
        this.bookForm.reset();
        this.router.navigate(['/my-bookshelf']);
      },
      (error) => {
        this.errorMessage =
          'An error occurred while adding the book. Please try again later.';
        throw new Error('Error adding book:', error.message);
      }
    );
  }

  generateYearsRange(startYear: number, endYear: number): number[] {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }

  ngOnDestroy(): void {
    this.bookSubscription?.unsubscribe();
  }
}
