import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewOfTheDayWidgetComponent } from './brew-of-the-day-widget.component';

describe('BrewOfTheDayWidgetComponent', () => {
  let component: BrewOfTheDayWidgetComponent;
  let fixture: ComponentFixture<BrewOfTheDayWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewOfTheDayWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewOfTheDayWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
