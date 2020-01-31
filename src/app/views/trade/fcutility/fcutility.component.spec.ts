import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FCUtilityComponent } from './fcutility.component';

describe('FCUtilityComponent', () => {
  let component: FCUtilityComponent;
  let fixture: ComponentFixture<FCUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FCUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FCUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
