import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsWidgetComponent } from './tips-widget.component';

describe('TipsWidgetComponent', () => {
  let component: TipsWidgetComponent;
  let fixture: ComponentFixture<TipsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
