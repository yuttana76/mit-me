import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmTimelineComponent } from './crm-timeline.component';

describe('CrmTimelineComponent', () => {
  let component: CrmTimelineComponent;
  let fixture: ComponentFixture<CrmTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
