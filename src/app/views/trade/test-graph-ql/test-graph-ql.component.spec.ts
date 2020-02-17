import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGraphQLComponent } from './test-graph-ql.component';

describe('TestGraphQLComponent', () => {
  let component: TestGraphQLComponent;
  let fixture: ComponentFixture<TestGraphQLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestGraphQLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestGraphQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
