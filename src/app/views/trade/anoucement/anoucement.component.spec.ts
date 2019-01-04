import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnoucementComponent } from './anoucement.component';

describe('AnoucementComponent', () => {
  let component: AnoucementComponent;
  let fixture: ComponentFixture<AnoucementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnoucementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnoucementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
