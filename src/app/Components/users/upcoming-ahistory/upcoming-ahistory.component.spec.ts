import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingAhistoryComponent } from './upcoming-ahistory.component';

describe('UpcomingAhistoryComponent', () => {
  let component: UpcomingAhistoryComponent;
  let fixture: ComponentFixture<UpcomingAhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingAhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingAhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
