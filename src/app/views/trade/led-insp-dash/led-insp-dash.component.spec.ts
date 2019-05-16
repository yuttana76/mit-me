import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspDashComponent } from './led-insp-dash.component';

describe('LedInspDashComponent', () => {
  let component: LedInspDashComponent;
  let fixture: ComponentFixture<LedInspDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
