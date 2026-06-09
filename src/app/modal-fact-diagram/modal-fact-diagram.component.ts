import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FactDiagramApiService} from "../shared/rest-api/fact-diagram-api.service";
import {XmlDataService} from "../shared/rest-api/xml-data.service";


@Component({
  selector: 'app-modal-fact-diagram',
  templateUrl: './modal-fact-diagram.component.html',
  styleUrls: ['./modal-fact-diagram.component.css']
})
export class ModalFactDiagramComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public dataSources: any = [];
    public factDiagrams: any = [];
    public selectedDataSource: string | null = null;
    public selectedXmlContent: string | null = null;

    constructor(
        private modalRef: BsModalRef,
        public router: Router,
        private restFactDiagramApi: FactDiagramApiService,
        private translate: TranslateService,
        private xmlDataService: XmlDataService
    ) {}

    ngOnInit() {
        this.xmlDataService.clearXmlData();
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.dataSources = [
            {name: this.translate.instant('FACT-DIAGRAM-MODAL.SELECT-SOURCE.OPTIONS.CURRENT-DB'), id: 'current-db'},
            {name: this.translate.instant('FACT-DIAGRAM-MODAL.SELECT-SOURCE.OPTIONS.XML-FILE'), id: 'xml-file'},
            {name: this.translate.instant('FACT-DIAGRAM-MODAL.SELECT-SOURCE.OPTIONS.FACT-DIAGRAM-TABLE'), id: 'fact-diagram-table'},
        ];
        this.restFactDiagramApi.getFactDiagrams().subscribe((data: {}) => {
            this.factDiagrams = data;
        });
    }

    onDataSourceChange() {
        this.selectedXmlContent = null;
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

    setAndNavigate(content: string): void {
        this.xmlDataService.setXml(content);
        this.closeModal();
        this.router.navigate(['/parameterization/fact-diagram']);
    }


    closeModal() {
        this.modalRef.hide();
    }

}
