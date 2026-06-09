/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { BiElement } from '../../../shared/interfaces/bi_element.model';

@Component({
    selector: 'app-bi-element-modal',
    templateUrl: './bi-element-modal.component.html',
    styleUrls: ['./bi-element-modal.component.css']
})

export class BiElementModalComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public biElement: BiElement = {} as BiElement;
    public biEngines;
    public biElementTypes;
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
        this.getEngines();
        this.getBiElementTypeSlug();

        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;

        if (!isEmptyObj) {
            this.biElement = params;
        } else {
            console.log('Not loaded');
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

    getEngines() {
        return this.biManagementApiService.getAllBiEngines().subscribe((data) => {
            this.biEngines =  data;
        });
    }

    getBiElementTypeSlug() {
        return this.biManagementApiService.getBiElementsTypes().subscribe((data) => {
            this.biElementTypes =  data;
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
                this.imageError = this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MODAL.MAXIMUM-SIZE-ALLOWED') +
                    maxSize / 1000 + 'Mb';
                return false;
            }

            if (!_.includes(allowedTypes, fileInput.target.files[0].type)) {
                this.imageError = this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MODAL.ONLY-IMAGES-ALLOWED');
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
                    if (imgHeight > maxHeight || imgWidth > maxWidth) {
                        this.imageError =
                            this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.MODAL.MAXIMUM-DIMENSIONS-ALLOWED') + ' ' +
                            maxHeight + '*' + maxWidth + 'px';
                        return false;
                    } else {
                        this.cardImageBase64 = e.target.result;
                        this.biElement.preview = this.cardImageBase64;
                        this.isImageSaved = true;
                        this.cdr.detectChanges();
                    }
                };
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    removeImage() {
        this.biElement.preview = null;
        this.cardImageBase64 = null;
        this.isImageSaved = false;
        this.cdr.detectChanges();
    }

    cantSaveElement() {
        return !(this.biElement.bi_engine_id && this.biElement.bi_element_type_id && this.biElement.name &&
            this.biElement.description && this.biElement.embed && this.biElement.preview);
    }

    saveData() {
        console.log(this.biElement);
        if (!this.biElement.id) {
            this.biManagementApiService.storeBiElement(this.biElement).subscribe((data: {}) => {
                this.isImageSaved = false;
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        } else {
            this.biManagementApiService.updateBiElement(this.biElement).subscribe((data: {}) => {
                this.isImageSaved = false;
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        }
    }

}
