/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit, ViewChild, Injectable  } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BiKnowageModalComponent } from '../bi-knowage-modal/bi-knowage-modal.component';
import { AlertToastService } from '../../../shared/common/alert-toast.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BiKnowage } from '../../../shared/interfaces/bi_knowage.model';
import { Token } from '../../../shared/rest-api/token';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bi-knowage-management',
  templateUrl: './bi-knowage-management.component.html',
  styleUrls: ['./bi-knowage-management.component.css'],
    providers: [BiKnowageModalComponent]
})

@Injectable()
export class BiKnowageManagementComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})

    private dtElement: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    // This trigger is used because fetching the list of biElements can be quite long,
    // thus we ensure the data is fetched before rendering
    public dtTrigger: Subject<any> = new Subject<any>();
    // Translation Service File to Be Used
    private languageFileUrl;

    public biKnowageElements: BiKnowage[] = [];
    protected biKnowageSession: any;
    private getKnowageDocumentsUrlAPI = 'http://localhost:8080/knowage/restful-services/2.0/documents/';

    constructor(
        private biManagementApiService: BiManagementApiService,
        private modalService: BsModalService,
        private alertToast: AlertToastService,
        private httpClient: HttpClient,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.languageFileUrl = 'assets/i18n/' + Token.getTokenLanguage() + '.json';
        this.biKnowageSession = this.readLocalStorageValue('biKnowageSession');
        this.setDatatablesOptions();
        this.getAllBiKnowageDetail();
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
                targets: [9],
                orderable: false,
            } ],
            responsive: true
        };
    }

    getAllBiKnowageDetail() {
        this.biManagementApiService.getAllBiKnowage().subscribe(data => {
            this.biKnowageElements = data;
            this.dtTrigger.next();
        } );
    }

    readLocalStorageValue(key: string): string {
        return JSON.parse(localStorage.getItem(key));
    }

    getBiKnowageDocuments() {
        this.biKnowageSession = this.readLocalStorageValue('biKnowageSession');
        const authorizationData = 'Basic ' + btoa(this.biKnowageSession[0].username + ':' + this.biKnowageSession[0].password);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: authorizationData
            })
        };
        return this.httpClient.get(this.getKnowageDocumentsUrlAPI, httpOptions)
            .subscribe(
                data => { // json data
                    console.log('Success: ', data);
                },
                error => {
                    console.log('Error: ', error);
                });
    }

    destroyDtInstance() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
        });
    }

    openModal(params = {}) {
        const modalRef = this.modalService.show(BiKnowageModalComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            console.log(receivedEntry);
            if (receivedEntry === 'success') {
                this.destroyDtInstance();
                this.getAllBiKnowageDetail();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MANAGEMENT.OPERATION-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MANAGEMENT.OPERATION-ERROR'));
            }
        });
    }

    deleteBiKnowage(biKnowageId) {
        if (window.confirm(this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MANAGEMENT.DELETE.CONFIRMATION'))) {
            this.biManagementApiService.deleteBiKnowage(biKnowageId).subscribe(data => {
                this.destroyDtInstance();
                this.getAllBiKnowageDetail();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MANAGEMENT.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MANAGEMENT.DELETE.ERROR'));
            });
        }
    }

}
