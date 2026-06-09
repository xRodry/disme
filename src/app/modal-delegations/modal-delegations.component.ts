/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {Delegation} from '../shared/interfaces/delegation.model';
import {DelegationsApiService} from '../shared/rest-api/delegations-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-delegations',
  templateUrl: './modal-delegations.component.html',
  styleUrls: ['./modal-delegations.component.css']
})
export class ModalDelegationsComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    // DB data
    public tasksToDelegate: any = [];
    private userRoles: any = [];

    // To populate the form's select boxes
    public possibleRoles: any = [];
    public possibleStates: any = [];
    public delegatedRoles: any = [];
    public delegatedUsers: any = [];
    public type = [];

    // To save the selected dates in ngbDateFormat
    public ngbStartTime = null;
    public ngbEndTime = null;

    // Limits on the date fields
    public ngbMinStartTime = null;
    public ngbMaxEndTime = null;

    // Save the checkbox value regarding Delegation to a Specific User
    public delegateSpecificUser = false;

    // To save the info we're going to save in the DB
    public delegation = {} as Delegation;

    constructor(private modalService: BsModalService,
                private modalRef: BsModalRef,
                private restApi: DelegationsApiService,
                private alertToast: AlertToastService,
                private translate: TranslateService,
                public router: Router) {}

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        // Action Types - 'is'/'has-been'
        this.type = [
            {name: 'act', form_name: this.translate.instant('DELEGATIONS.TABLE.TYPE.ACT')},
            {name: 'fact', form_name: this.translate.instant('DELEGATIONS.TABLE.TYPE.FACT')}
        ];
        // If component is opened through the 'edit' button, save the passed delegation to populate the form's fields
        if (!isEmptyObj) {
            this.delegation = params;
        }
        // Get data to populate form's select boxes
        this.getTasksToDelegate();
    }

    getTasksToDelegate() {
        this.restApi.getTasksToDelegate().subscribe(data => {
            this.tasksToDelegate = data;
            this.getUserRoles();
        });
    }

    getUserRoles() {
        this.restApi.getUserRoles().subscribe(data => {
            this.userRoles = data;
            let minStartDate;
            if (this.delegation.id) {
                this.initialConfigEditor();
                minStartDate = new Date(this.delegation.start_time);
            } else {
                minStartDate = new Date(Date.now());
            }
            this.ngbMinStartTime = new NgbDate(minStartDate.getFullYear(), minStartDate.getMonth() + 1, minStartDate.getDate());
        });
    }

    initialConfigEditor() {
        // Configure the modal according to the data from the form to be updated
        this.changeSelectedTask(true);
        this.changeSelectedRole(true);
        this.changeSelectedType(true);
        this.changedDelegatedRole(true);
        // Format DB dates (datetime format) to the ngbDateFormat - ex: {year: 2022, month: 01, day:04}
        if (this.delegation.start_time) {
            const startDate = new Date(this.delegation.start_time);
            this.ngbStartTime = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        }
        if (this.delegation.end_time) {
            const endDate = new Date(this.delegation.end_time);
            this.ngbEndTime = new NgbDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
        }
    }

    changeSelectedTask(initialConfig = false) {
        this.clearFilters('task', initialConfig);
        this.possibleRoles = this.tasksToDelegate.find(
            item => item.transaction_type_id === this.delegation.transaction_type_id
        ).roles;
    }

    changeSelectedRole(initialConfig = false) {
        this.clearFilters('delegatesRole', initialConfig);
        // Present the possible roles to be delegated (every role except the current one)
        this.delegatedRoles = this.userRoles.filter(role => role.id !== this.delegation.delegates_role_id);
    }

    changeSelectedType(initialConfig = false) {
        this.clearFilters('type', initialConfig);
        // Get the available tStates within the current transactionType/role combo
        const possibleTStates = this.possibleRoles.find(
            item => item.role_id === this.delegation.delegates_role_id
        );
        // Add the possible t_states to display to the user - needed because user can be a executer and initiator of a transaction
        if (this.delegation.type === 'act') {
            this.possibleStates = possibleTStates.possible_states_act;
        } else {
            this.possibleStates = possibleTStates.possible_states_fact;
        }
        // Sort the transaction states by t_state_id ascending
        this.possibleStates.sort((a, b) => a.t_state_id - b.t_state_id);
    }

    defineMaxEndDate() {
        // Check if selected transType/role/tState to be delegated belongs to a previous delegation with flag 'delegated_user_can_delegate'
        const selectedTask = this.possibleStates.find(
            item => item.t_state_id === this.delegation.t_state_id
        );
        // If it belongs to a previous delegation, check if that delegation had an endTime
        // If it did, make that endTime the max endTime for the new delegation being created
        if (selectedTask && selectedTask.end_time) {
            const maxEndDate = new Date(selectedTask.end_time);
            this.ngbMaxEndTime = new NgbDate(maxEndDate.getFullYear(), maxEndDate.getMonth() + 1, maxEndDate.getDate());
        } else {
            this.ngbMaxEndTime = null;
        }
    }

    changedDelegatedRole(initialConfig = false) {
        this.clearFilters('delegatedRole', initialConfig);
        // Get users in the system with the selected role
        if (this.delegation.delegated_role_id) {
            this.restApi.getUsersFromRole(this.delegation.delegated_role_id).subscribe(data => {
                this.delegatedUsers = data;
            });
        }
    }

    // Clear the selects' selected option and possible options when a parent select is cleared
    clearFilters(type, initialConfig) {
        // Clear select options
        if (type === 'task') {
            this.possibleRoles = [];
        }
        if (type === 'task' || type === 'delegatesRole') {
            this.delegatedRoles = [];
        }
        if (type === 'task' || type === 'delegatesRole' || type === 'type') {
            this.possibleStates = [];
        }
        if (type === 'task' || type === 'delegatesRole' || type === 'delegatedRole') {
            this.delegateSpecificUser = initialConfig ? !!this.delegation.user_id : false;
            this.delegatedUsers = [];
        }
        // Clear selected options by the user that can be affected by the change made
        // - do not clear on the opening of the modal through the 'edit' button
        if (!initialConfig) {
            if (type === 'task') {
                this.delegation.delegates_role_id = null;
            }
            if (type === 'task' || type === 'delegatesRole') {
                this.delegation.delegated_role_id = null;
                this.delegation.type = null;
            }
            if (type === 'task' || type === 'delegatesRole' || type === 'type') {
                this.delegation.t_state_id = null;
            }
            if (type === 'task' || type === 'delegatesRole' || type === 'delegatedRole') {
                this.delegation.user_id = null;
            }
        }
    }

    // Transform ngbDate into js Date so we can save it successfully in the DB
    formatDate(input, type) {
        // Mark changed time as null - will stay null if insertedDate is invalid or isn't filled
        if (type === 'startTime') {
            this.delegation.start_time = null;
        } else if (type === 'endTime') {
            this.delegation.end_time = null;
        }
        // If the date field is correctly filled, save the date inserted in the respective delegation date field.
        if (input && input.year && input.month && input.day) {
            const finalDate = new Date(input.year, input.month - 1, input.day);
            if (type === 'startTime') {
                this.delegation.start_time = finalDate;
            } else {
                this.delegation.end_time = finalDate;
            }
            this.validateEndDate();
        }
    }

    // If endDate is before startDate, reset endDate to the startDate - endDate can't be before startDate
    validateEndDate() {
        if (this.delegation.end_time < this.delegation.start_time) {
            this.delegation.end_time = this.delegation.start_time;
            const startDate = new Date(this.delegation.start_time);
            this.ngbStartTime = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
            this.ngbEndTime  = this.ngbStartTime;
        }
    }

    // Only allow the user to save the delegation if the form is correctly filled
    disableSaveButton() {
        if (
            this.delegation.delegates_role_id &&
            this.delegation.delegated_role_id &&
            this.delegation.transaction_type_id &&
            this.delegation.type &&
            this.delegation.t_state_id &&
            this.delegation.start_time
        ) {
            // If checkbox 'delegate to specific user' is checked, a user has to be selected in order to save
            if (this.delegateSpecificUser && !this.delegation.user_id) {
                return 1;
            }
            if (this.ngbMaxEndTime && !this.delegation.end_time) {
                return 1;
            }
            return 0;
        }
        return 1;
    }

    saveData() {
        this.delegation.visible_to_delegator = this.delegation.visible_to_delegator ? 1 : 0;
        this.delegation.delegated_user_can_delegate = this.delegation.delegated_user_can_delegate ? 1 : 0;
        // If delegation has an id, it means we have opened it through the 'edit' button
        if (this.delegation.id) {
            this.restApi.updateDelegation(this.delegation).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('DELEGATIONS-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showSuccess(this.translate.instant('DELEGATIONS-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showSuccess(this.translate.instant('DELEGATIONS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restApi.createDelegation(this.delegation).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('DELEGATIONS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showSuccess(this.translate.instant('DELEGATIONS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showSuccess(this.translate.instant('DELEGATIONS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    closeModal() {
        this.modalRef.hide();
    }
}
