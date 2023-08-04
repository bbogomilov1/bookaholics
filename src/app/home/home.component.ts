import { Component } from '@angular/core';
import { faHeart, faBook, faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  faHeart = faHeart;
  faBook = faBook;
  faPen = faPen;
}
