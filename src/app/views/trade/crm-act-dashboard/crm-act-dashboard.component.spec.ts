import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActDashboardComponent } from './crm-act-dashboard.component';

describe('CrmActDashboardComponent', () => {
  let component: CrmActDashboardComponent;
  let fixture: ComponentFixture<CrmActDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmActDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
