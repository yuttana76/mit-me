import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspResultComponent } from './led-insp-result.component';

describe('LedInspResultComponent', () => {
  let component: LedInspResultComponent;
  let fixture: ComponentFixture<LedInspResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
