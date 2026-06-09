/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Role} from '../shared/interfaces/role.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleApiService} from '../shared/rest-api/role-api.service';

@Component({
    selector: 'app-modal-role',
    templateUrl: './modal-role.component.html',
    styleUrls: ['./modal-role.component.css']
})
export class ModalRoleComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public role: any = {} as Role;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restRoleApi: RoleApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        // If component is opened through the 'edit' button, save the passed role to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.role = params;
        }
    }

    saveData() {
        // If role has an id, it means we have opened it through the 'edit' button
        if (this.role.id) {
            this.restRoleApi.updateRole(this.role).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ROLES-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ROLES-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLES-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restRoleApi.createRole(this.role).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ROLES-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ROLES-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLES-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }


    closeModal() {
        this.modalRef.hide();
    }

}
