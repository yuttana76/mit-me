import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmPersonalDataComponent } from './crm-personal-data.component';

describe('CrmPersonalDataComponent', () => {
  let component: CrmPersonalDataComponent;
  let fixture: ComponentFixture<CrmPersonalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmPersonalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
