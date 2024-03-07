import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSuggestionComponent } from './friend-suggestion.component';

describe('FriendSuggestionComponent', () => {
  let component: FriendSuggestionComponent;
  let fixture: ComponentFixture<FriendSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendSuggestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
