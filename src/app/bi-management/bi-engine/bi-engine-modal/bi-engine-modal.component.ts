/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { BiEngine } from '../../../shared/interfaces/bi_engine.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-bi-engine-modal',
    templateUrl: './bi-engine-modal.component.html',
    styleUrls: ['./bi-engine-modal.component.css']
})

export class BiEngineModalComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public biEngine: BiEngine = {} as BiEngine;
    public imageError: string;
    public isImageSaved: boolean;
    public cardImageBase64: string;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private biManagementApiService: BiManagementApiService,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.biEngine = params;
        }
    }

    closeModal() {
        this.modalRef.hide();
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
                this.imageError = this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MODAL.MAXIMUM-SIZE-ALLOWED') +
                    maxSize / 1000 + 'Mb';
                return false;
            }

            if (!_.includes(allowedTypes, fileInput.target.files[0].type)) {
                this.imageError = this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MODAL.ONLY-IMAGES-ALLOWED');
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
                            this.translate.instant('BI-MANAGEMENT.BI-ENGINE.MODAL.MAXIMUM-DIMENSIONS-ALLOWED') + ' ' +
                            maxHeight + '*' + maxWidth + 'px';
                        return false;
                    } else {
                        this.cardImageBase64 = e.target.result;
                        this.biEngine.logo_preview = this.cardImageBase64;
                        this.isImageSaved = true;
                        this.cdr.detectChanges();
                    }
                };
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    removeImage() {
        this.biEngine.logo_preview = null;
        this.cardImageBase64 = null;
        this.isImageSaved = false;
        this.cdr.detectChanges();
    }

    cantSaveEngine() {
        return !(this.biEngine.name && this.biEngine.logo_preview);
    }

    saveData() {
        console.log(this.biEngine);
        if (!this.biEngine.id) {
            this.biManagementApiService.storeBiEngine(this.biEngine).subscribe((data) => {
                this.isImageSaved = false;
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        } else {
            this.biManagementApiService.updateBiEngine(this.biEngine).subscribe((data) => {
                this.isImageSaved = false;
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        }
    }

}
