/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {TemplateEditorComponent} from './template-editor.component';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-template-editor',
    template: '<button *ngIf="showTranslateButton(rowData)" type="button" class="btn-info w-100" (click)="translateRow()">' +
        '{{ \'USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.TRANSLATE\' | translate }}</button>' +
        '<button *ngIf="!showTranslateButton(rowData)" type="button" class="btn-info w-50" (click)="editRow()">' +
        '{{ \'USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.EDIT\' | translate }}</button>' +
        '<button *ngIf="!showTranslateButton(rowData)" type="button" class="btn-warning w-50" (click)="deleteRow()">' +
        '{{ \'USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.DELETE\' | translate }}</button>',
    styleUrls: ['./template-editor.component.css']
})

export class UserEvaluatedExpressionCellComponent {

    rowData: any;
    userLanguage: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private modalService: BsModalService,
        private templateEditorComponent: TemplateEditorComponent,
    ) {}

    agInit(params) {
        this.userLanguage = Token.getTokenLanguage();
        this.rowData = params.data;
    }

    editRow() {
        this.rowData.from = 'expressionEdition';
        this.templateEditorComponent.openUserEvaluatedExpressionEditorModal(this.rowData);
    }

    deleteRow() {
        this.templateEditorComponent.deleteUserEvaluatedExpression(this.rowData.id);
    }

    translateRow() {
        this.rowData.from = 'expressionTranslation';
        this.templateEditorComponent.openUserEvaluatedExpressionEditorModal(this.rowData);
    }

    showTranslateButton(rowData) {
        // In case the object doesn't have a name specified in the user's language, show Translate Button
        if (rowData.language_abbrv !== this.userLanguage) {
            return true;
        }
        // Otherwise, show the 'Edit' and 'Delete' Buttons instead
        return false;
    }

}
