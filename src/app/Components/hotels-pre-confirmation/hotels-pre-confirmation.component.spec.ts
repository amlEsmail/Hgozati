import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsPreConfirmationComponent } from './hotels-pre-confirmation.component';

describe('HotelsPreConfirmationComponent', () => {
  let component: HotelsPreConfirmationComponent;
  let fixture: ComponentFixture<HotelsPreConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelsPreConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsPreConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
