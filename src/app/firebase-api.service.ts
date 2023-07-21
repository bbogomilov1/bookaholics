import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseApiService {
  private firebaseUrl =
    'https://bookaholics-966d8-default-rtdb.firebaseio.com/books.json';

  constructor(private http: HttpClient) {}

  postToFirebase(data: any): Observable<any> {
    return this.http.post<any>(this.firebaseUrl, data);
  }
}
