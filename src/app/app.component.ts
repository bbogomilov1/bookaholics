import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseApiService } from './firebase-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bookaholics';

  constructor(private firebaseApiService: FirebaseApiService) {}

  postDataToFirebase() {
    const postData = {
      name: 'metro',
      author: 'artem',
      imageUrl:
        'https://m.media-amazon.com/images/I/61JbxV8r2mL._AC_UF1000,1000_QL80_.jpg',
      plot: 'this is the plot',
    };

    this.firebaseApiService.postToFirebase(postData).subscribe(
      (response) => {
        console.log('Data posted successfully!', response);
      },
      (error) => {
        console.error('Error posting data:', error);
      }
    );
  }

  // constructor(private http: HttpClient) {
  //   const postData = {
  //     name: 'metro',
  //     author: 'artem',
  //     imageUrl:
  //       'https://m.media-amazon.com/images/I/61JbxV8r2mL._AC_UF1000,1000_QL80_.jpg',
  //     plot: 'this is the plot',
  //   };

  //   const firebaseUrl =
  //     'https://bookaholics-966d8-default-rtdb.firebaseio.com/books.json';

  //   this.http.post(firebaseUrl, postData).subscribe(
  //     (response) => {
  //       console.log('Data posted successfully!', response);
  //     },
  //     (error) => {
  //       console.error('Error posting data:', error);
  //     }
  //   );
  // }
}
