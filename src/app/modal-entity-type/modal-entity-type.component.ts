/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {TransactionTypeApiService} from '../shared/rest-api/transaction-type-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {EntityType} from '../shared/interfaces/enttype.model';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';

@Component({
  selector: 'app-modal-entity-type',
  templateUrl: './modal-entity-type.component.html',
  styleUrls: ['./modal-entity-type.component.css']
})
export class ModalEntityTypeComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public entityType: any = {} as EntityType;
    public entityTypeStates: any = [];
    public transactionTypes: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restEntityTypeApi: EnttypeApiService,
        private restTransactionTypeApi: TransactionTypeApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed entity type to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.entityType = params;
        }
    }

    loadFormFieldData() {
        this.restTransactionTypeApi.getTransactionTypes().subscribe((data: {}) => {
            this.transactionTypes = data;
        });
        this.entityTypeStates = [
            {name: this.translate.instant('ENTITY-TYPES-MODAL.SELECT-STATE.OPTIONS.ACTIVE') , id: 'active'},
            {name: this.translate.instant('ENTITY-TYPES-MODAL.SELECT-STATE.OPTIONS.INACTIVE') , id: 'inactive'}
        ];
    }

    changeUserDetailsEntType() {
        if (this.entityType.user_details) {
            this.entityType.has_many = false;
        }
    }

    disableSaveButton() {
        if (this.entityType.name && this.entityType.state) {
            return !(this.entityType.user_details || this.entityType.transaction_type_id);
        }
        return true;
    }

    saveData() {
        this.entityType.has_many = this.entityType.has_many ? 1 : 0;
        this.entityType.auto_generated = this.entityType.auto_generated ? 1 : 0;
        this.entityType.external = this.entityType.external ? 1 : 0;
        this.entityType.user_details = this.entityType.user_details ? 1 : 0;
        // If entity type has an id, it means we have opened it through the 'edit' button
        if (this.entityType.id) {
            this.restEntityTypeApi.updateEntityType(this.entityType).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ENTITY-TYPES-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ENTITY-TYPES-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ENTITY-TYPES-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restEntityTypeApi.createEntityType(this.entityType).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ENTITY-TYPES-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ENTITY-TYPES-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ENTITY-TYPES-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

}
