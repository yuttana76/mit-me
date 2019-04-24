import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitResultTableComponent } from './suit-result-table.component';

describe('SuitResultTableComponent', () => {
  let component: SuitResultTableComponent;
  let fixture: ComponentFixture<SuitResultTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitResultTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
