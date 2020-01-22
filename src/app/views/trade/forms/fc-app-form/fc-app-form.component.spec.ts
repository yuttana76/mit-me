import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcAppFormComponent } from './fc-app-form.component';

describe('FcAppFormComponent', () => {
  let component: FcAppFormComponent;
  let fixture: ComponentFixture<FcAppFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcAppFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcAppFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
