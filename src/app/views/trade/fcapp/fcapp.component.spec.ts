import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FCAppComponent } from './fcapp.component';

describe('FCAppComponent', () => {
  let component: FCAppComponent;
  let fixture: ComponentFixture<FCAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FCAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FCAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
