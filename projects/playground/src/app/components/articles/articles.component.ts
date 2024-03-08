import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit {
  @Input() articles: Article[] = []

  ngOnInit(): void {
  }

}
