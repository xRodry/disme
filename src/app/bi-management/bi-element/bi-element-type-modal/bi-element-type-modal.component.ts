/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BiElementType } from '../../../shared/interfaces/bi_element_type.model';

@Component({
    selector: 'app-bi-element-type-modal',
    templateUrl: './bi-element-type-modal.component.html',
    styleUrls: ['./bi-element-type-modal.component.css']
})

export class BiElementTypeModalComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public biElementType: BiElementType = {} as BiElementType;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private biManagementApiService: BiManagementApiService
    ) { }

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.biElementType = params;
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

    cantSaveElementType() {
        return !(this.biElementType.name && this.biElementType.slug && this.biElementType.description);
    }

    saveData() {
        console.log(this.biElementType);
        if (!this.biElementType.id) {
            this.biManagementApiService.storeBiElementType(this.biElementType).subscribe((data: {}) => {
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        } else {
            this.biManagementApiService.updateBiElementType(this.biElementType).subscribe((data: {}) => {
                this.passEntry.emit('success');
                this.closeModal();
            }, error => {
                this.passEntry.emit('error');
            });
        }
    }

}
