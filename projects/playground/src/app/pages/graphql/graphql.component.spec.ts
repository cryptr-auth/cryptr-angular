import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GraphqlComponent } from './graphql.component';

describe('GraphqlComponent', () => {
  let component: GraphqlComponent;
  let fixture: ComponentFixture<GraphqlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GraphqlComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
