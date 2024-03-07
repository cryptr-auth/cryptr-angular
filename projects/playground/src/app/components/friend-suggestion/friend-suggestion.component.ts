import { Component, Input, OnInit } from '@angular/core';
import { Friend } from '../../interfaces';

@Component({
  selector: 'app-friend-suggestion',
  templateUrl: './friend-suggestion.component.html',
  styleUrl: './friend-suggestion.component.css'
})
export class FriendSuggestionComponent implements OnInit {
  @Input() friend: Friend
  ngOnInit(): void {
  }
}
