import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle modal visibility when open/close method is called', () => {
    // Assurez-vous que le modal est initialement fermé
    component.isOpen = false;
  
    // Appeler la méthode d'ouverture
    component.open();
    fixture.detectChanges();
  
    // Vérifier que le modal est maintenant ouvert
    expect(component.isOpen).toBeTrue();
  
    // Appeler la méthode de fermeture
    component.close();
    fixture.detectChanges();
  
    // Vérifier que le modal est maintenant fermé
    expect(component.isOpen).toBeFalse();
  });
  
});



