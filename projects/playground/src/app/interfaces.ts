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
