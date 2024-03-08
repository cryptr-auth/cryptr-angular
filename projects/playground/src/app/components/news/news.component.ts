import { Component, Input, OnInit } from '@angular/core';
import { NewsPiece } from '../../interfaces';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  @Input() news: NewsPiece[] = []
  ngOnInit(): void {
  }

}
