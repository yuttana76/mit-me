import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SttOpenDetailComponent } from './stt-open-detail.component';

describe('SttOpenDetailComponent', () => {
  let component: SttOpenDetailComponent;
  let fixture: ComponentFixture<SttOpenDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SttOpenDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SttOpenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
