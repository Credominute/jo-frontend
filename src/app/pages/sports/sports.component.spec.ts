import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsPageComponent } from './sports.component';

describe('SportsComponent', () => {
  let component: SportsPageComponent;
  let fixture: ComponentFixture<SportsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
