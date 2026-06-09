import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {XmlDataService} from "../shared/rest-api/xml-data.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal";
import {FactDiagramApiService} from "../shared/rest-api/fact-diagram-api.service";
import {FactDiagram} from "../shared/interfaces/fact_diagram.model";
import {AlertToastService} from "../shared/common/alert-toast.service";

@Component({
  selector: 'app-modal-save-fact-diagram',
  templateUrl: './modal-save-fact-diagram.component.html',
  styleUrls: ['./modal-save-fact-diagram.component.css']
})
export class ModalSaveFactDiagramComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public factDiagram: any = {} as FactDiagram;
    public currentXmlContent: string | null = null;

    constructor(
        private modalRef: BsModalRef,
        public router: Router,
        private restFactDiagramApi: FactDiagramApiService,
        private translate: TranslateService,
        private alertToast: AlertToastService,
        private xmlDataService: XmlDataService
    ) {}

    ngOnInit() {
        this.currentXmlContent = this.xmlDataService.getToSaveContent();
    }

    saveFactDiagram() {
        this.factDiagram.XML = this.currentXmlContent;
        this.restFactDiagramApi.updateOrCreateFactDiagram(this.factDiagram).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('SAVE-FACT-DIAGRAM-MODAL.SAVE.SUCCESS'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('SAVE-FACT-DIAGRAM-MODAL.SAVE.ERROR'));
                this.passEntry.emit('error');
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('SAVE-FACT-DIAGRAM-MODAL.SAVE.ERROR'));
            this.passEntry.emit('error');
        });
    }

    closeModal() {
        this.xmlDataService.clearToSaveContent();
        this.modalRef.hide();
    }

}
