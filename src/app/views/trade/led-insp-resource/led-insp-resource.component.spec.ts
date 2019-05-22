import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspResourceComponent } from './led-insp-resource.component';

describe('LedInspResourceComponent', () => {
  let component: LedInspResourceComponent;
  let fixture: ComponentFixture<LedInspResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
