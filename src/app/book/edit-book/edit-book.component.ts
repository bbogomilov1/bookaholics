import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from 'src/app/types/book';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
})
export class EditBookComponent implements OnInit {
  editBookForm: FormGroup;
  version: string | null = null;
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
      cover: ['', Validators.required],
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
              console.error('Book not found');
              // Handle case where book is not found
            }
          },
          (error) => {
            console.error('Error fetching book:', error);
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
          console.log('Book updated successfully:', updatedBook.title);
          this.router.navigate(['/my-bookshelf']);
        },
        (error) => {
          console.error('Error updating book:', error);
          // Handle error
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
