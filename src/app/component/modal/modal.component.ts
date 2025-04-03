import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal/modal.service';
import { v4 as uuidv4 } from 'uuid';  // Import de uuid pour générer un id unique

@Component({
    selector: 'jw-modal',
    templateUrl: 'modal.component.html',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['../../../scss/components/modal.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id?: string;
    @Input() widthbody?: string = '30rem';
    isOpen = false;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        // Vérifie si l'id est passé, sinon génère un id unique
        if (!this.id) {
            this.id = uuidv4();  // Génère un id unique si nécessaire
        }
        // Enregistre ce modal dans le ModalService pour pouvoir l'ouvrir depuis n'importe quel composant
        this.modalService.add(this);

        // Déplace l'élément modal en bas de la page (avant </body>) pour qu'il soit affiché par-dessus tout
        document.body.appendChild(this.element);

        // Ferme le modal si on clique sur l'arrière-plan
        this.element.addEventListener('click', (el: any) => {
            if (el.target.className === 'jw-modal') {
                this.close();
            }
        });
    }

    ngOnDestroy() {
        // remove self from modal service
        this.modalService.remove(this);

        // remove modal element from html
        this.element.remove();
    }

    open() {
        this.element.style.display = 'block';
        document.body.classList.add('jw-modal-open');
        this.isOpen = true;
    }

    close() {
        this.element.style.display = 'none';
        document.body.classList.remove('jw-modal-open');
        this.isOpen = false;
    }
}