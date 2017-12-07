import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewComponent } from './brew.component';

describe('BrewComponent', () => {
  let component: BrewComponent;
  let fixture: ComponentFixture<BrewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
