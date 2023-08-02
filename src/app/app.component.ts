import { Component, OnInit } from '@angular/core';
import { FirebaseApiService } from './firebase-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bookaholics';
  // books: any[] = [];

  // constructor(private firebaseApiService: FirebaseApiService) {}

  // ngOnInit(): void {}

  // postBook() {
  //   const postData = {
  //     title: 'metro',
  //     author: 'artem',
  //     imageUrl:
  //       'https://m.media-amazon.com/images/I/61JbxV8r2mL._AC_UF1000,1000_QL80_.jpg',
  //     plot: 'this is the plot',
  //   };

  //   this.firebaseApiService.postBook(postData).subscribe(
  //     (response) => {
  //       console.log('Data posted successfully!', response);
  //     },
  //     (error) => {
  //       console.error('Error posting data:', error);
  //     }
  //   );
  // }
}
