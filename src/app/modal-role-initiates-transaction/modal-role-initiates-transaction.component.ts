/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RoleInitiatesTransaction} from '../shared/interfaces/role_initiates_transaction.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {RoleApiService} from '../shared/rest-api/role-api.service';
import {TransactionTypeApiService} from '../shared/rest-api/transaction-type-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleInitiatesTransactionApiService} from '../shared/rest-api/role-initiates-transaction-api.service';

@Component({
  selector: 'app-modal-role-initiates-transaction',
  templateUrl: './modal-role-initiates-transaction.component.html',
  styleUrls: ['./modal-role-initiates-transaction.component.css']
})
export class ModalRoleInitiatesTransactionComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public roleInitiatesTransaction: any = {} as RoleInitiatesTransaction;
    public roles: any = [];
    public transactionTypes: any = [];
    private previousRoleId = 0;
    private attributedRoleInitiatesTransaction: any = [];
    public rolesDontInitiateTransaction: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restRoleInitiatesTransactionApi: RoleInitiatesTransactionApiService,
        private restRoleApi: RoleApiService,
        private restTransactionTypeApi: TransactionTypeApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        // Save the attributed user initiates transaction records passed through the 'parent' component, so we know
        // which transaction types to load for each role
        this.attributedRoleInitiatesTransaction = params.attributedRoleInitiatesTransaction;
        delete(params.attributedRoleInitiatesTransaction);
        // If component is opened through the 'edit' button, save the passed 'role initiates transaction' to populate the form's fields
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.previousRoleId = params.role_id;
            this.roleInitiatesTransaction = {...params};
        }
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.restTransactionTypeApi.getTransactionTypes().subscribe((data: {}) => {
            this.transactionTypes = data;
        });
        this.restRoleApi.getRoles().subscribe((data: {}) => {
            this.roles = data;
            // If record is being edited, get roles transaction doesn't have to populate the 'role' select box, as function
            // won't be triggered by the changing of the 'user' select box (it's already pre-selected)
            if (this.roleInitiatesTransaction.transaction_type_id) {
                this.getRolesTransactionDoesntHave();
            }
        });
    }

    getRolesTransactionDoesntHave() {
        this.roleInitiatesTransaction.role_id = null;
        // Get roles that already initiate the selected transaction type
        const transactionInitiatorRoles = this.attributedRoleInitiatesTransaction.filter(roleInitiatesTransaction =>
            roleInitiatesTransaction.transaction_type_id === this.roleInitiatesTransaction.transaction_type_id)
            .map(roleInitiatesTransaction => roleInitiatesTransaction.role_id);
        // Get roles that don't already initiate the selected transaction type
        this.rolesDontInitiateTransaction = this.roles.filter(role => !transactionInitiatorRoles.includes(role.id));
    }

    saveData() {
        this.roleInitiatesTransaction.own_user_access_only = this.roleInitiatesTransaction.own_user_access_only ? 1 : 0;
        // If 'role initiates transaction' has a 'created at' field, it means we have opened it through the 'edit' button
        if (this.roleInitiatesTransaction.created_at) {
            this.restRoleInitiatesTransactionApi.updateRoleInitiatesTransaction(this.roleInitiatesTransaction, this.previousRoleId)
                .subscribe((data: {}) => {
                    if (data) {
                        this.alertToast.showSuccess(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.UPDATE.SUCCESS'));
                        this.passEntry.emit('success');
                        this.closeModal();
                    } else {
                        this.alertToast.showError(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.UPDATE.ERROR'));
                        this.passEntry.emit('error');
                    }
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restRoleInitiatesTransactionApi.createRoleInitiatesTransaction(this.roleInitiatesTransaction).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }


    closeModal() {
        this.modalRef.hide();
    }

}
