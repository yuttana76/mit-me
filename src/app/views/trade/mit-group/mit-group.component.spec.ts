import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitGroupComponent } from './mit-group.component';

describe('MitGroupComponent', () => {
  let component: MitGroupComponent;
  let fixture: ComponentFixture<MitGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
