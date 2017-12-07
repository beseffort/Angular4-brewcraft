import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBrewWidgetComponent } from './favorite-brew-widget.component';

describe('FavoriteBrewWidgetComponent', () => {
  let component: FavoriteBrewWidgetComponent;
  let fixture: ComponentFixture<FavoriteBrewWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteBrewWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteBrewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
