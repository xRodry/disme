/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertToastService } from '../../../shared/common/alert-toast.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BiElementTypeModalComponent } from '../bi-element-type-modal/bi-element-type-modal.component';
import { Token } from '../../../shared/rest-api/token';
import { TranslateService } from '@ngx-translate/core';
import { BiElementType } from '../../../shared/interfaces/bi_element_type.model';

@Component({
    selector: 'app-bi-element-type',
    templateUrl: './bi-element-type.component.html',
    styleUrls: ['./bi-element-type.component.css'],
    providers: [BiElementTypeModalComponent]
})

export class BiElementTypeComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})

    private dtElement: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public biElementTypes: BiElementType[] = [];
    // This trigger is used because fetching the list of biElementTypes can be quite long,
    // thus we ensure the data is fetched before rendering
    public dtTrigger: Subject<any> = new Subject<any>();
    // Translation Service File to Be Used
    private languageFileUrl;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private modalService: BsModalService,
        private alertToast: AlertToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.languageFileUrl = 'assets/i18n/' + Token.getTokenLanguage() + '.json';
        this.setDatatablesOptions();
        this.getBiElementsTypes();
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
                targets: [4],
                orderable: false
            } ]
        };
    }

    getBiElementsTypes() {
        this.biManagementApiService.getBiElementsTypes().subscribe(data => {
            this.biElementTypes = data;
            this.dtTrigger.next();
        });
    }

    destroyDtInstance() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
        });
    }

    openModal(params = {}) {
        const modalRef = this.modalService.show(BiElementTypeModalComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            console.log(receivedEntry);
            if (receivedEntry === 'success') {
                this.destroyDtInstance();
                this.getBiElementsTypes();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.TYPE.OPERATION-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.TYPE.OPERATION-ERROR'));
            }
        });
    }

    deleteBiElementType(biElementTypeId) {
        if (window.confirm(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.TYPE.DELETE.CONFIRMATION'))) {
            this.biManagementApiService.deleteBiElementType(biElementTypeId).subscribe(data => {
                this.destroyDtInstance();
                this.getBiElementsTypes();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.TYPE.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.TYPE.DELETE.ERROR'));
            });
        }
    }

}
