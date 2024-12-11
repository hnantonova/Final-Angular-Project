export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  likes?: string[];
  likesLength: number;
}
