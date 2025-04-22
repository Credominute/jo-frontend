import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPageComponent } from './manual.component';

describe('ManualComponent', () => {
  let component: ManualPageComponent;
  let fixture: ComponentFixture<ManualPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
