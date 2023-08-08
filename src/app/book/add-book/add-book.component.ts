import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit, OnDestroy {
  bookForm!: FormGroup;
  uuid: string = uuid();

  private bookSubscription: Subscription | null = null;

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
      publishedYear: ['', Validators.required],
      genre: ['', Validators.required],
      shelf: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      // Handle form validation errors
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
        // Success! Handle any success actions here
        console.log('Book added successfully:', response);

        this.bookForm.reset();
      },
      (error) => {
        // Handle error, if any
        console.error('Error adding book:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.bookSubscription?.unsubscribe();
  }
}
