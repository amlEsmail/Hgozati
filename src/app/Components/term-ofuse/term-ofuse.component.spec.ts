import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermOfuseComponent } from './term-ofuse.component';

describe('TermOfuseComponent', () => {
  let component: TermOfuseComponent;
  let fixture: ComponentFixture<TermOfuseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermOfuseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermOfuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
