import { Component, OnInit } from '@angular/core';
import { FirebaseApiService } from '../firebase-api.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  books: any[] = [];

  constructor(private firebaseApiService: FirebaseApiService) {}

  ngOnInit(): void {}

  getBooks() {
    this.firebaseApiService.getBooks().subscribe(
      (response) => {
        this.books = Object.values(response);
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }
}
