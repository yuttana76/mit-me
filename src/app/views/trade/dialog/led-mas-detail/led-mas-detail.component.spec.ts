import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedMasDetailComponent } from './led-mas-detail.component';

describe('LedMasDetailComponent', () => {
  let component: LedMasDetailComponent;
  let fixture: ComponentFixture<LedMasDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedMasDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedMasDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
