import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAccountFirstComponent } from './open-account-first.component';

describe('OpenAccountFirstComponent', () => {
  let component: OpenAccountFirstComponent;
  let fixture: ComponentFixture<OpenAccountFirstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenAccountFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAccountFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
