import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewDayComponent } from './brew-day.component';

describe('BrewDayComponent', () => {
  let component: BrewDayComponent;
  let fixture: ComponentFixture<BrewDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
