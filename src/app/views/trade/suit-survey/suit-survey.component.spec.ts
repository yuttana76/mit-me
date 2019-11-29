import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitSurveyComponent } from './suit-survey.component';

describe('SuitSurveyComponent', () => {
  let component: SuitSurveyComponent;
  let fixture: ComponentFixture<SuitSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
