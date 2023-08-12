import { Book } from './book';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  bookshelf: Book[];
}
