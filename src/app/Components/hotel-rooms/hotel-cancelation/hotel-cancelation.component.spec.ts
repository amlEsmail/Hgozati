import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCancelationComponent } from './hotel-cancelation.component';

describe('HotelCancelationComponent', () => {
  let component: HotelCancelationComponent;
  let fixture: ComponentFixture<HotelCancelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCancelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
