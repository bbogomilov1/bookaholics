export interface Book {
  title: string;
  author_name: string[];
  first_publish_year: number;
  cover_i?: number | null;
  subject: string[];
  shelf: 'wishlist' | 'read';
  _version_: string;
}
