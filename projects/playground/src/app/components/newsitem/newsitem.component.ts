import { Component, Input, OnInit } from '@angular/core';
import { NewsPiece } from '../../interfaces';

@Component({
  selector: 'app-news-item',
  templateUrl: './newsitem.component.html',
  styleUrl: './newsitem.component.css'
})
export class NewsitemComponent implements OnInit {
  @Input() newItem: NewsPiece
  ngOnInit(): void {
  }

}
