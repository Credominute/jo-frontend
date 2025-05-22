import { TestBed } from '@angular/core/testing';
import { ModalComponent } from '../../component/modal/modal.component';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a modal with a unique id', () => {
    const modalMock = { id: 'testModal' } as ModalComponent;
    service['modals'] = []; // reset state
    service.add(modalMock);
    expect(service['modals']).toContain(modalMock);
  });

  it('should throw error when adding a modal with duplicate id', () => {
    const modalMock = { id: 'testModal' } as ModalComponent;
    service['modals'] = [modalMock];
    expect(() => service.add(modalMock)).toThrowError('modal must have a unique id attribute');
  });

  it('should open a modal by id', () => {
    const openSpy = jasmine.createSpy('open');
    const modalMock = { id: 'openModal', open: openSpy } as unknown as ModalComponent;
    service['modals'] = [modalMock];
    service.open('openModal');
    expect(openSpy).toHaveBeenCalled();
  });

  it('should throw error when opening unknown modal', () => {
    service['modals'] = [];
    expect(() => service.open('unknownModal')).toThrowError("modal 'unknownModal' not found");
  });

  it('should close the currently open modal', () => {
    const closeSpy = jasmine.createSpy('close');
    const modalMock = { id: 'modal1', isOpen: true, close: closeSpy } as unknown as ModalComponent;
    service['modals'] = [modalMock];
    service.close();
    expect(closeSpy).toHaveBeenCalled();
  });

});
