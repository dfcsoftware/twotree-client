import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunkComponent } from './funk.component';

describe('FunkComponent', () => {
  let component: FunkComponent;
  let fixture: ComponentFixture<FunkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
