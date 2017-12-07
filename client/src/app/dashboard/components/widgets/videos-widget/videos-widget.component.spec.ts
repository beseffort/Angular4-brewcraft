import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosWidgetComponent } from './videos-widget.component';

describe('VideosWidgetComponent', () => {
  let component: VideosWidgetComponent;
  let fixture: ComponentFixture<VideosWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
