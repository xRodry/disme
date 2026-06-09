/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';

import {ActionApiService} from '../shared/rest-api/action-api.service';
import {FormApiService} from '../shared/rest-api/form-api.service';

@Component({
    selector: 'app-modal-dynamic-form',
    templateUrl: './modal-dynamic-form.component.html',
    styleUrls: ['./modal-dynamic-form.component.css']
})
export class ModalDynamicFormComponent implements OnInit {
    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public dynamicForm: any = {};
    public userInputActions;
    private deletedActionRule = 0;
    private actionsWithFormsDesigned: any = [];

    constructor(private modalService: BsModalService,
                private modalRef: BsModalRef,
                private restApi: FormApiService,
                public router: Router,
                private ActionApi: ActionApiService) {}

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        // Save the actions that already have forms, passed through the 'parent' component, so we know which actions to
        // present on the select box: If there's already a form for an action, don't present that action in the select
        this.actionsWithFormsDesigned = params.actionsWithFormsDesigned.map( (form) => form.action_id);
        delete(params.actionsWithFormsDesigned);
        // If component is opened through the 'edit' button, save the passed 'form' to populate the form's fields
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.dynamicForm = params;
            this.deletedActionRule = this.dynamicForm.deleted_action_rule ? 1 : 0;
        }
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.ActionApi.getActionsWithFormFacts(this.deletedActionRule).subscribe((data) => {
            // Remove the actions that already have form defined when we're creating a new form. In case of edition, we
            // want these actions to still be displayed, so the form attributed action is presented in the select box.
            this.userInputActions = this.dynamicForm.id ? data :
                data.filter((action) => !this.actionsWithFormsDesigned.includes(action.id));
        });
    }

    // Redirect to the form editor page with the parameters needed for each case
    saveData() {
        const isEntitySpecificationAction = this.userInputActions.find(action =>
            action.id === this.dynamicForm.action_id).isEntitySpecificationAction;
        this.passEntry.emit('success');
        if (this.dynamicForm.id) {
            this.router.navigate(['/formsManagement/formio'], {state: {action_id: this.dynamicForm.action_id,
                    form_id: this.dynamicForm.id, form_name: this.dynamicForm.name, isEntitySpecificationAction}});
        } else {
            this.router.navigate(['/formsManagement/formio'], {state: {action_id: this.dynamicForm.action_id,
                    form_id: null, form_name: this.dynamicForm.name, isEntitySpecificationAction}});
        }
        this.closeModal();
    }

    closeModal() {
        this.modalRef.hide();
    }
}
