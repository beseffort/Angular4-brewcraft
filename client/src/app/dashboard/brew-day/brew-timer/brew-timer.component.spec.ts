import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewTimerComponent } from './brew-timer.component';

describe('BrewTimerComponent', () => {
  let component: BrewTimerComponent;
  let fixture: ComponentFixture<BrewTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
