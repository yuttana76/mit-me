import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmPortfolioComponent } from './crm-portfolio.component';

describe('CrmPortfolioComponent', () => {
  let component: CrmPortfolioComponent;
  let fixture: ComponentFixture<CrmPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
