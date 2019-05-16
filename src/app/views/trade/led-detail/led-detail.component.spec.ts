import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedDetailComponent } from './led-detail.component';

describe('LedDetailComponent', () => {
  let component: LedDetailComponent;
  let fixture: ComponentFixture<LedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
