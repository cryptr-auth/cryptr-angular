import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GrowthHackerComponent } from './growth-hacker.component';

describe('GrowthHackerComponent', () => {
  let component: GrowthHackerComponent;
  let fixture: ComponentFixture<GrowthHackerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GrowthHackerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthHackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
