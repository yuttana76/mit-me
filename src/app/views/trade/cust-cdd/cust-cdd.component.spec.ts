import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCDDComponent } from './cust-cdd.component';

describe('CustCDDComponent', () => {
  let component: CustCDDComponent;
  let fixture: ComponentFixture<CustCDDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustCDDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCDDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
