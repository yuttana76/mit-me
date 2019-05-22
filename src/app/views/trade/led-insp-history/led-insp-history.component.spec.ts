import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspHistoryComponent } from './led-insp-history.component';

describe('LedInspHistoryComponent', () => {
  let component: LedInspHistoryComponent;
  let fixture: ComponentFixture<LedInspHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
