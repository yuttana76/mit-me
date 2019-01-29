import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnoucementDialogComponent } from './anoucement-dialog.component';

describe('AnoucementDialogComponent', () => {
  let component: AnoucementDialogComponent;
  let fixture: ComponentFixture<AnoucementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnoucementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnoucementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
