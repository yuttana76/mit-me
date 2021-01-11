import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmMarketManagerComponent } from './crm-market-manager.component';

describe('CrmMarketManagerComponent', () => {
  let component: CrmMarketManagerComponent;
  let fixture: ComponentFixture<CrmMarketManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmMarketManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmMarketManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
