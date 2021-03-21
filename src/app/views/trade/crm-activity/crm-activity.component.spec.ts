import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActivityComponent } from './crm-activity.component';

describe('CrmActivityComponent', () => {
  let component: CrmActivityComponent;
  let fixture: ComponentFixture<CrmActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
