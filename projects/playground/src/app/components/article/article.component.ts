import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  @Input() article: Article

  ngOnInit(): void {
  }

}
