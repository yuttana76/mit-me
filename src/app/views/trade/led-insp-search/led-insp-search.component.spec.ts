import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspSearchComponent } from './led-insp-search.component';

describe('LedInspSearchComponent', () => {
  let component: LedInspSearchComponent;
  let fixture: ComponentFixture<LedInspSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
