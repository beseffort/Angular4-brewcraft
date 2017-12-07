import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipOfTheDayWidgetComponent } from './tip-of-the-day-widget.component';

describe('TipOfTheDayWidgetComponent', () => {
  let component: TipOfTheDayWidgetComponent;
  let fixture: ComponentFixture<TipOfTheDayWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipOfTheDayWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipOfTheDayWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
