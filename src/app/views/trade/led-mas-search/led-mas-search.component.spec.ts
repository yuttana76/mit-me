import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedMasSearchComponent } from './led-mas-search.component';

describe('LedMasSearchComponent', () => {
  let component: LedMasSearchComponent;
  let fixture: ComponentFixture<LedMasSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedMasSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedMasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
