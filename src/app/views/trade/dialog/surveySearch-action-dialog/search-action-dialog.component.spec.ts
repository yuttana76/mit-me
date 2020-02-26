import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySearchActionDialogComponent } from './surveySearch-action-dialog.component';

describe('SearchActionDialogComponent', () => {
  let component: SurveySearchActionDialogComponent;
  let fixture: ComponentFixture<SurveySearchActionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveySearchActionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveySearchActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
