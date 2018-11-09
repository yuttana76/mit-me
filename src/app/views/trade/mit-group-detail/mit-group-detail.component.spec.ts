import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitGroupDetailComponent } from './mit-group-detail.component';

describe('MitGroupDetailComponent', () => {
  let component: MitGroupDetailComponent;
  let fixture: ComponentFixture<MitGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
