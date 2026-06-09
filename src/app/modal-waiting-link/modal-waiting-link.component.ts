/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WaitingLink} from '../shared/interfaces/waiting_link.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {TransactionTypeApiService} from '../shared/rest-api/transaction-type-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {TransactionStateApiService} from '../shared/rest-api/transaction-state-api.service';
import {WaitingLinkApiService} from '../shared/rest-api/waiting-link-api.service';

@Component({
  selector: 'app-modal-waiting-link',
  templateUrl: './modal-waiting-link.component.html',
  styleUrls: ['./modal-waiting-link.component.css']
})
export class ModalWaitingLinkComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public waitingLink: any = {} as WaitingLink;
    public transactionTypes: any = [];
    public transactionStates: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restWaitingLinkApi: WaitingLinkApiService,
        private restTransactionTypeApi: TransactionTypeApiService,
        private restTransactionStateApi: TransactionStateApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed waiting link to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.waitingLink = params;
        }
    }

    loadFormFieldData() {
        this.restTransactionTypeApi.getTransactionTypes().subscribe((data: {}) => {
            this.transactionTypes = data;
        });
        this.restTransactionStateApi.getTransactionStates().subscribe((data: {}) => {
            this.transactionStates = data;
        });
    }

    saveData() {
        // If waiting link has an id, it means we have opened it through the 'edit' button
        if (this.waitingLink.id) {
            this.restWaitingLinkApi.updateWaitingLink(this.waitingLink).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('WAITING-LINKS-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('WAITING-LINKS-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('WAITING-LINKS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restWaitingLinkApi.createWaitingLink(this.waitingLink).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('WAITING-LINKS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('WAITING-LINKS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('WAITING-LINKS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

}
