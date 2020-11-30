import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmPersonalSearchComponent } from './crm-personal-search.component';

describe('CrmPersonalSearchComponent', () => {
  let component: CrmPersonalSearchComponent;
  let fixture: ComponentFixture<CrmPersonalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmPersonalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmPersonalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
