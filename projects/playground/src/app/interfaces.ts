export interface Course {
  id: number;
  user_id: string;
  title: string;
  desc: string;
  tags: Array<string>;
  img: string;
  teacher: {
    name: string;
    picture: string;
  };
  date: string;
  timestamp: number;
}
