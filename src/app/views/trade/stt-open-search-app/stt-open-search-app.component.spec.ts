import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SttOpenSearchAppComponent } from './stt-open-search-app.component';

describe('SttOpenSearchAppComponent', () => {
  let component: SttOpenSearchAppComponent;
  let fixture: ComponentFixture<SttOpenSearchAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SttOpenSearchAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SttOpenSearchAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
