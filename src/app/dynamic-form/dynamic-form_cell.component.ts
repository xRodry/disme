/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {DynamicFormComponent} from './dynamic-form.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-dynamic-form',
    template: '<button type="button" class="btn-info" (click)="editRow()"> {{ \'FORM-MANAGEMENT.FORM-EDIT\' | translate }} </button>' +
        '<button type="button" class="btn-warning" (click)="deleteRow()"> {{ \'FORM-MANAGEMENT.FORM-DELETE\' | translate }} </button>' +
        '<button type="button" class="btn-info" (click)="renderForm()"> {{ \'FORM-RENDER.FORM-RENDER-ACTION\' | translate }} </button>',
    styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormCellCustomComponent {

    rowData: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private modalService: BsModalService,
        private dynamicFormComp: DynamicFormComponent,
        private translate: TranslateService
    ) {}

    agInit(params) {
        this.rowData = params.data;
    }

    // Allows the opening of a modal for form editing
    editRow() {
        this.dynamicFormComp.openFormsManagementModal(this.rowData);
    }

    // Deletes the respective form
    deleteRow() {
        this.dynamicFormComp.deleteDynamicForm(this.rowData.id);
    }

    // Renders the form in its respective page
    renderForm() {
        if (window.confirm(this.translate.instant('FORM-RENDER.ASK-RENDER'))) {
            this.router.navigate(['/formRendered/' + this.rowData.id]).then(null);
        }
    }

}
