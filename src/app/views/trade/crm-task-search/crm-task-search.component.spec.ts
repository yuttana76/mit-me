import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmTaskSearchComponent } from './crm-task-search.component';

describe('CrmTaskSearchComponent', () => {
  let component: CrmTaskSearchComponent;
  let fixture: ComponentFixture<CrmTaskSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmTaskSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmTaskSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
