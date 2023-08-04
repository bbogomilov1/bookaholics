import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      cover: ['', Validators.required],
      author: ['', Validators.required],
      publishedDate: ['', Validators.required],
      genre: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      // Handle form validation errors
      return;
    }

    const book: Book = this.bookForm.value;

    this.bookService.addBook(book).subscribe(
      (response) => {
        // Success! Handle any success actions here
        console.log('Book added successfully:', response);

        // Reset the form after successful submission
        this.bookForm.reset();
      },
      (error) => {
        // Handle error, if any
        console.error('Error adding book:', error);
      }
    );
  }
}
