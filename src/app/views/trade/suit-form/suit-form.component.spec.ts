import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitFormComponent } from './suit-form.component';

describe('SuitFormComponent', () => {
  let component: SuitFormComponent;
  let fixture: ComponentFixture<SuitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
