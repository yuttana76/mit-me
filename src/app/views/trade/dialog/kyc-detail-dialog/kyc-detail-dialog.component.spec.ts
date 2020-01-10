import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDetailDialogComponent } from './kyc-detail-dialog.component';

describe('KycDetailDialogComponent', () => {
  let component: KycDetailDialogComponent;
  let fixture: ComponentFixture<KycDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
