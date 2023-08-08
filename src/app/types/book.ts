export interface Book {
  title: string;
  author_name: string[];
  first_publish_year: number;
  cover_i?: number | null;
  customCoverUrl?: string;
  subject: string[];
  shelf: string;
  _version_: string;
}
