/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BiEngineModalComponent } from '../bi-engine-modal/bi-engine-modal.component';
import { AlertToastService } from '../../../shared/common/alert-toast.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BiEngine } from '../../../shared/interfaces/bi_engine.model';
import { TranslateService } from '@ngx-translate/core';
import { Token } from '../../../shared/rest-api/token';

@Component({
    selector: 'app-bi-engine-management',
    templateUrl: './bi-engine-management.component.html',
    styleUrls: ['./bi-engine-management.component.css'],
    providers: [BiEngineModalComponent]
})

export class BiEngineManagementComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})

    private dtElement: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public biEngines: BiEngine[] = [];
    // This trigger is used because fetching the list of biElements can be quite long,
    // thus we ensure the data is fetched before rendering
    public dtTrigger: Subject<any> = new Subject<any>();
    // Translation Service File to Be Used
    private languageFileUrl;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private modalService: BsModalService,
        private modal: BiEngineModalComponent,
        private alertToast: AlertToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.languageFileUrl = 'assets/i18n/' + Token.getTokenLanguage() + '.json';
        this.setDatatablesOptions();
        this.getAllBIEngines();
    }

    setDatatablesOptions() {
        this.dtOptions = {
            language: {
                url: this.languageFileUrl
            },
            fixedColumns: {
                leftColumns: 1,
                rightColumns: 1
            },
            pagingType: 'full_numbers',
            pageLength: 10,
            scrollX: true,
            paging: true,
            deferRender: true,
            columnDefs: [ {
                targets: [1, 4],
                orderable: false
            } ]
        };
    }

    getAllBIEngines() {
        this.biManagementApiService.getAllBiEngines().subscribe(data => {
            this.biEngines = data;
            this.dtTrigger.next();
        } );
    }

    destroyDtInstance() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
        });
    }

    openModal(params = {}) {
        const modalRef = this.modalService.show(BiEngineModalComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            console.log(receivedEntry);
            if (receivedEntry === 'success') {
                this.destroyDtInstance();
                this.getAllBIEngines();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MANAGEMENT.OPERATION-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MANAGEMENT.OPERATION-ERROR'));
            }
        });
    }

    deleteBiEngine(biEngineId) {
        if (window.confirm(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MANAGEMENT.DELETE.CONFIRMATION'))) {
            this.biManagementApiService.deleteBiEngine(biEngineId).subscribe(data => {
                this.destroyDtInstance();
                this.getAllBIEngines();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MANAGEMENT.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MANAGEMENT.DELETE.ERROR'));
            });
        }
    }

}
