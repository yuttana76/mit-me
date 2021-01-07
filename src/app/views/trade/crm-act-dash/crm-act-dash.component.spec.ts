import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActDashComponent } from './crm-act-dash.component';

describe('CrmActDashComponent', () => {
  let component: CrmActDashComponent;
  let fixture: ComponentFixture<CrmActDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmActDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
