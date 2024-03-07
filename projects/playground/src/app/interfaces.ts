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

export interface Article {
  id: number;
  avatar: string;
  publish_date: Date;
  author: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  views: number;
}


export interface Friend {
  avatar: string;
  name: string;
  nickname: string;
}

export interface NewsPiece {
  id: number;
  avatar: string;
  content: string;
  comments_count: number;
}


export interface ResponseData {
  articles?: Article[];
  friends?: Friend[];
  news?: NewsPiece[];
}
