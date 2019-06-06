import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspDashListComponent } from './led-insp-dash-list.component';

describe('LedInspDashListComponent', () => {
  let component: LedInspDashListComponent;
  let fixture: ComponentFixture<LedInspDashListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspDashListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspDashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
