/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RoleHasUser} from '../shared/interfaces/role_has_user.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {RoleApiService} from '../shared/rest-api/role-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleHasUserApiService} from '../shared/rest-api/role-has-user-api.service';
import {UserApiService} from '../shared/rest-api/user-api.service';

@Component({
  selector: 'app-modal-role-has-user',
  templateUrl: './modal-role-has-user.component.html',
  styleUrls: ['./modal-role-has-user.component.css']
})
export class ModalRoleHasUserComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public roleHasUser: any = {} as RoleHasUser;
    public users: any = [];
    private roles: any = [];
    public rolesUserDoesntHave: any = [];
    private attributedUserRoles: any = [];
    private previousRoleId = 0;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restRoleHasUserApi: RoleHasUserApiService,
        private restRoleApi: RoleApiService,
        private restUsersApi: UserApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        // Save the attributed user roles passed through the 'parent' component, so we know which roles to load for each user
        this.attributedUserRoles = params.attributedUserRoles;
        delete(params.attributedUserRoles);
        // If component is opened through the 'edit' button, save the passed 'role has user' to populate the form's fields
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            // Get the role from the roleHasUser record that is being edited
            this.previousRoleId = params.role_id;
            this.roleHasUser = {...params};
        }
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.restUsersApi.getUsers().subscribe((data: {}) => {
            this.users = data;
        });
        this.restRoleApi.getRoles().subscribe((data: {}) => {
            this.roles = data;
            // If record is being edited, get roles user doesn't have to populate the 'role' select box, as function
            // won't be triggered by the changing of the 'user' select box (it's already pre-selected)
            if (this.roleHasUser.user_id) {
                this.getRolesUserDoesntHave();
            }
        });
    }

    getRolesUserDoesntHave() {
        this.roleHasUser.role_id = null;
        // Get roles that current select user already has
        const userRoles = this.attributedUserRoles.filter(userRole => userRole.user_id === this.roleHasUser.user_id)
            .map(userRole => userRole.role_id);
        // Get roles that the selected user doesn't currently have
        this.rolesUserDoesntHave = this.roles.filter(role => !userRoles.includes(role.id));
    }

    saveData() {
        // If 'role has user' has a 'created at' field, it means we have opened it through the 'edit' button
        if (this.roleHasUser.created_at) {
            this.restRoleHasUserApi.updateRoleHasUser(this.roleHasUser, this.previousRoleId).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ROLE-HAS-USERS-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ROLE-HAS-USERS-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLE-HAS-USERS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restRoleHasUserApi.createRoleHasUser(this.roleHasUser).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ROLE-HAS-USERS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ROLE-HAS-USERS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLE-HAS-USERS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }


    closeModal() {
        this.modalRef.hide();
    }

}
