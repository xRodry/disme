import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProcessDiagram} from "../shared/interfaces/process_diagram.model";
import {BsModalRef} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {ProcessDiagramApiService} from "../shared/rest-api/process-diagram-api.service";
import {TranslateService} from "@ngx-translate/core";
import {AlertToastService} from "../shared/common/alert-toast.service";
import {XmlDataService} from "../shared/rest-api/xml-data.service";

@Component({
  selector: 'app-modal-save-process-diagram',
  templateUrl: './modal-save-process-diagram.component.html',
  styleUrls: ['./modal-save-process-diagram.component.css']
})
export class ModalSaveProcessDiagramComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public processDiagram: any = {} as ProcessDiagram;
    public currentXmlContent: string | null = null;

    constructor(
        private modalRef: BsModalRef,
        public router: Router,
        private restProcessDiagramApi: ProcessDiagramApiService,
        private translate: TranslateService,
        private alertToast: AlertToastService,
        private xmlDataService: XmlDataService
    ) { }

    ngOnInit() {
        this.currentXmlContent = this.xmlDataService.getToSaveContent();
    }

    saveProcessDiagram() {
        this.processDiagram.process_type_id = this.xmlDataService.getProcessType();
        this.processDiagram.XML = this.currentXmlContent;
        this.restProcessDiagramApi.updateOrCreateProcessDiagram(this.processDiagram).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('SAVE-PROCESS-DIAGRAM-MODAL.SAVE.SUCCESS'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('SAVE-PROCESS-DIAGRAM-MODAL.SAVE.ERROR'));
                this.passEntry.emit('error');
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('SAVE-PROCESS-DIAGRAM-MODAL.SAVE.ERROR'));
            this.passEntry.emit('error');
        });
    }

    closeModal() {
        this.xmlDataService.clearToSaveContent();
        this.modalRef.hide();
    }

}
