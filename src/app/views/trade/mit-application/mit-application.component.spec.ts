import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitApplicationComponent } from './mit-application.component';

describe('MitApplicationComponent', () => {
  let component: MitApplicationComponent;
  let fixture: ComponentFixture<MitApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
