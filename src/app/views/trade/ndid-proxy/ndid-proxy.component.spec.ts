import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdidProxyComponent } from './ndid-proxy.component';

describe('NdidProxyComponent', () => {
  let component: NdidProxyComponent;
  let fixture: ComponentFixture<NdidProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdidProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdidProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
