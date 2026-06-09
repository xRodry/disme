/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BiElementModalComponent } from '../bi-element-modal/bi-element-modal.component';
import { AlertToastService } from '../../../shared/common/alert-toast.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Token } from '../../../shared/rest-api/token';
import { BiElement } from '../../../shared/interfaces/bi_element.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bi-element-management',
  templateUrl: './bi-element-management.component.html',
  styleUrls: ['./bi-element-management.component.css'],
  providers: [BiElementModalComponent]
})

export class BiElementManagementComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})

    private dtElement: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public biElements: BiElement[] = [];
    // This trigger is used because fetching the list of biElements can be quite long,
    // thus we ensure the data is fetched before rendering
    public dtTrigger: Subject<any> = new Subject<any>();
    // Translation Service File to Be Used
    private languageFileUrl;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private modalService: BsModalService,
        private modal: BiElementModalComponent,
        private alertToast: AlertToastService,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.languageFileUrl = 'assets/i18n/' + Token.getTokenLanguage() + '.json';
        this.setDatatablesOptions();
        this.getAllBiElementsDetail();
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
                targets: [1, 7],
                orderable: false
            } ]
        };
    }

    getAllBiElementsDetail() {
        this.biManagementApiService.getAllBiElements().subscribe(data => {
            this.biElements = data;
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
        const modalRef = this.modalService.show(BiElementModalComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            console.log(receivedEntry);
            if (receivedEntry === 'success') {
                this.destroyDtInstance();
                this.getAllBiElementsDetail();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MANAGEMENT.OPERATION-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MANAGEMENT.OPERATION-ERROR'));
            }
        });
    }

    deleteBiElement(biElementId) {
        if (window.confirm(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MANAGEMENT.DELETE.CONFIRMATION'))) {
            this.biManagementApiService.deleteBiElement(biElementId).subscribe(data => {
                this.destroyDtInstance();
                this.getAllBiElementsDetail();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MANAGEMENT.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MANAGEMENT.DELETE.ERROR'));
            });
        }
    }

}
