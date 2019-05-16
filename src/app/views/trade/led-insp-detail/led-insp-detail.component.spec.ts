import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspDetailComponent } from './led-insp-detail.component';

describe('LedInspDetailComponent', () => {
  let component: LedInspDetailComponent;
  let fixture: ComponentFixture<LedInspDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
