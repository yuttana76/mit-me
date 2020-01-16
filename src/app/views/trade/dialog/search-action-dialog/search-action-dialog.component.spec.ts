import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchActionDialogComponent } from './search-action-dialog.component';

describe('SearchActionDialogComponent', () => {
  let component: SearchActionDialogComponent;
  let fixture: ComponentFixture<SearchActionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchActionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
