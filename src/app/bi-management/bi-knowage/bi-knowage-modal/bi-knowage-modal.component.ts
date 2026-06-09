/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BiKnowage } from '../../../shared/interfaces/bi_knowage.model';

@Component({
    selector: 'app-bi-knowage-modal',
    templateUrl: './bi-knowage-modal.component.html',
    styleUrls: ['./bi-knowage-modal.component.css']
})

export class BiKnowageModalComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    private getKnowageDocumentsUrlAPI = 'http://localhost:8080/knowage/restful-services/2.0/documents/';

    protected imageError: string;
    protected isImageSaved: boolean;
    private cardImageBase64: string;

    protected biKnowageElement: BiKnowage = {} as BiKnowage;
    protected biKnowageApiData;
    private biKnowageSession: any;
    public labelChanged = false;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private biManagementApiService: BiManagementApiService,
        private httpClient: HttpClient,
        private domSanitizer: DomSanitizer,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getBiKnowageDocuments();
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.biKnowageElement = params;
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

    onLabelChange(selectedLabel) {
        // console.log('SELECTED VALUE:', selectedLabel);
        this.biKnowageSession = this.readLocalStorageValue('biKnowageSession');
        const authorizationData = 'Basic ' + btoa(this.biKnowageSession[0].username + ':' + this.biKnowageSession[0].password);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: authorizationData
            })
        };
        this.httpClient.get(this.getKnowageDocumentsUrlAPI + selectedLabel, httpOptions)
            .subscribe(
                data => { // json data
                    // console.log('Success: ', data);
                    const docLabelData = JSON.parse(JSON.stringify(data));
                    this.biKnowageElement.name = docLabelData.name;
                    this.biKnowageElement.description = docLabelData.description;
                    this.biKnowageElement.type = docLabelData.typeCode;
                    this.biKnowageElement.role = docLabelData.creationUser;
                    this.biKnowageElement.dataset_label = docLabelData.dataSetLabel;
                    this.biKnowageElement.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(
                        this.getKnowageDocumentsUrlAPI + selectedLabel + '/preview');
                    this.biKnowageElement.display_toolbar = 1;
                    this.biKnowageElement.display_sliders = 1;
                    this.biKnowageElement.reset_parameters = 1;
                    this.isImageSaved = this.biKnowageElement.preview !== null;
                    this.labelChanged = true;
                },
                error => {
                    console.log('Error: ', error);
                }
            );
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
                    this.biKnowageApiData = of(data);
                    console.log('Success: ', data);
                },
                error => {
                    console.log('Error: ', error);
                });
    }

    fileChangeEvent(fileInput: any) {
        this.imageError = null;
        if (fileInput.target.files && fileInput.target.files[0]) {
            // Size Filter Bytes
            const maxSize = 20971520;
            const allowedTypes = ['image/png', 'image/jpeg'];
            const maxHeight = 15200;
            const maxWidth = 25600;

            if (fileInput.target.files[0].size > maxSize) {
                this.imageError = this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MODAL.MAXIMUM-SIZE-ALLOWED') +
                    maxSize / 1000 + 'Mb';
                return false;
            }

            if (!_.includes(allowedTypes, fileInput.target.files[0].type)) {
                this.imageError = this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MODAL.ONLY-IMAGES-ALLOWED');
                return false;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = rs => {
                    // @ts-ignore
                    const imgHeight = rs.currentTarget.height;
                    // @ts-ignore
                    const imgWidth = rs.currentTarget.width;
                    console.log(imgHeight, imgWidth);
                    if (imgHeight > maxHeight && imgWidth > maxWidth) {
                        this.imageError =
                            this.translate.instant('BI-MANAGEMENT.BI-KNOWAGE.MODAL.MAXIMUM-DIMENSIONS-ALLOWED') + ' ' +
                            maxHeight + '*' + maxWidth + 'px';
                        return false;
                    } else {
                        this.cardImageBase64 = e.target.result;
                        this.biKnowageElement.preview = this.cardImageBase64;
                        this.isImageSaved = true;
                        this.cdr.detectChanges();
                    }
                };
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    removeImage() {
        this.biKnowageElement.preview = null;
        this.cardImageBase64 = null;
        this.isImageSaved = false;
        this.cdr.detectChanges();
    }

    cantSaveKnowageElement() {
        return !(this.biKnowageElement.label && this.biKnowageElement.name && this.biKnowageElement.description &&
        this.biKnowageElement.type && this.biKnowageElement.role && this.biKnowageElement.dataset_label
            && this.biKnowageElement.preview);
    }

    saveData() {
        console.log(this.biKnowageElement);
        if (!this.biKnowageElement.id) {
            this.biManagementApiService.storeBiKnowage(this.biKnowageElement).subscribe((data: {}) => {
                this.isImageSaved = false;
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        } else {
            this.biManagementApiService.updateBiKnowage(this.biKnowageElement).subscribe((data: {}) => {
                this.isImageSaved = false;
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        }
    }

}
