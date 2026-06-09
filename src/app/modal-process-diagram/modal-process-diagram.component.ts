import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {ProcessTypeApiService} from "../shared/rest-api/processtype-api.service";
import {TranslateService} from "@ngx-translate/core";
import {ProcessDiagramApiService} from "../shared/rest-api/process-diagram-api.service";
import {XmlDataService} from "../shared/rest-api/xml-data.service";

@Component({
  selector: 'app-modal-process-diagram',
  templateUrl: './modal-process-diagram.component.html',
  styleUrls: ['./modal-process-diagram.component.css']
})
export class ModalProcessDiagramComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public processTypes: any = [];
    public dataSources: any = [];
    public processDiagrams: any = [];
    selectedProcessType: number | null = null;
    selectedDataSource: string | null = null;
    selectedXmlContent: string | null = null;

    constructor(
        private modalRef: BsModalRef,
        public router: Router,
        private restProcessTypeApi: ProcessTypeApiService,
        private restProcessDiagramApi: ProcessDiagramApiService,
        private translate: TranslateService,
        private xmlDataService: XmlDataService
    ) {}

    ngOnInit() {
        this.xmlDataService.clearXmlData();
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.restProcessTypeApi.getProcessTypes().subscribe((data: {}) => {
            this.processTypes = data;
        });
        this.dataSources = [
            {name: this.translate.instant('PROCESS-DIAGRAM-MODAL.SELECT-SOURCE.OPTIONS.CURRENT-DB'), id: 'current-db'},
            {name: this.translate.instant('PROCESS-DIAGRAM-MODAL.SELECT-SOURCE.OPTIONS.XML-FILE'), id: 'xml-file'},
            {name: this.translate.instant('PROCESS-DIAGRAM-MODAL.SELECT-SOURCE.OPTIONS.PROCESS-DIAGRAM-TABLE'), id: 'process-diagram-table'},
        ];
        this.restProcessDiagramApi.getProcessDiagrams().subscribe((data: {}) => {
            this.processDiagrams = data;
        });
    }

    onDataSourceChange() {
        this.selectedXmlContent = null; // Limpa o conteúdo XML se mudar a fonte
        this.selectedProcessType = null; // Limpa o tipo de processo se mudar a fonte
    }

    setXmlFromFile(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                this.selectedXmlContent = reader.result as string;
            };

            reader.readAsText(file);
        } else {
            this.selectedXmlContent = null; // Limpa se não houver ficheiro
        }
    }

    onProcessDiagramChange(option): void {
        this.selectedXmlContent = option.XML;
        this.selectedProcessType = option.process_type_id;
    }

    setAndNavigate(procId: number, content: string): void {
        this.xmlDataService.setProcessType(procId);
        this.xmlDataService.setXml(content);
        this.closeModal();
        this.router.navigate(['/parameterization/process-diagram']);
    }

    closeModal() {
        this.modalRef.hide();
    }

}
