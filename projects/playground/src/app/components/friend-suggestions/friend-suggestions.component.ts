import { Component, Input, OnInit } from '@angular/core';
import { Friend } from '../../interfaces';

@Component({
  selector: 'app-friend-suggestions',
  templateUrl: './friend-suggestions.component.html',
  styleUrl: './friend-suggestions.component.css'
})
export class FriendSuggestionsComponent implements OnInit {
  @Input() friends: Friend[] = []

  ngOnInit(): void {
  }
}
