import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmPersonalComponent } from './crm-personal.component';

describe('CrmPersonalComponent', () => {
  let component: CrmPersonalComponent;
  let fixture: ComponentFixture<CrmPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
