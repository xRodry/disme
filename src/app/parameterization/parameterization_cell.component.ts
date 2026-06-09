/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ModalProcessTypeComponent} from '../modal-processtype/modal-processtype.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ParameterizationComponent} from './parameterization.component';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-parameterization',
    template: '<button *ngIf="showTranslateButton(rowData)" type="button" class="btn-info w-100" (click)="translateRow()">' +
        '{{ \'PARAMETERIZATION.TABLE-ACTIONS.TRANSLATE\' | translate }}</button>' +
        '<button *ngIf="!showTranslateButton(rowData)" type="button" class="btn-info w-50" (click)="editRow()">' +
        '{{ \'PARAMETERIZATION.TABLE-ACTIONS.EDIT\' | translate }}</button>' +
        '<button *ngIf="!showTranslateButton(rowData)" type="button" class="btn-warning w-50" (click)="deleteRow()">' +
        '{{ \'PARAMETERIZATION.TABLE-ACTIONS.DELETE\' | translate }}</button>',
    styleUrls: ['./parameterization.component.css']
})
export class ParameterizationCellCustomComponent {

    rowData: any;
    userLanguage: any;
    tablesNoTranslation: any;

    constructor(private http: HttpClient,
                private router: Router,
                private modal: ModalProcessTypeComponent,
                private modalService: BsModalService,
                private parameterizationComponent: ParameterizationComponent
    ) { }

    agInit(params) {
        this.rowData = params.data;
        this.userLanguage = Token.getTokenLanguage();
        this.tablesNoTranslation = ['language', 'users', 'roleInitiatesTransaction', 'roleHasUser', 'processDetails',
            'waitingLink'];
    }

    translateRow() {
        this.parameterizationComponent.openTranslationModal(this.rowData);
    }

    editRow() {
        switch (this.rowData.originTable) {
            case 'language':
                this.parameterizationComponent.openLanguageModal(this.rowData);
                break;
            case 'users':
                this.parameterizationComponent.openUsersModal(this.rowData);
                break;
            case 'role':
                this.parameterizationComponent.openRolesModal(this.rowData);
                break;
            case 'roleInitiatesTransaction':
                this.parameterizationComponent.openRoleInitiatesTransactionModal(this.rowData);
                break;
            case 'roleHasUser':
                this.parameterizationComponent.openRoleHasUserModal(this.rowData);
                break;
            case 'processType':
                this.parameterizationComponent.openProcessTypeModal(this.rowData);
                break;
            case 'processDetails':
                this.parameterizationComponent.openProcessDetailsModal(this.rowData);
                break;
            case 'transactionType':
                this.parameterizationComponent.openTransactionTypeModal(this.rowData);
                break;
            case 'entityType':
                this.parameterizationComponent.openEntityTypeModal(this.rowData);
                break;
            case 'property':
                this.parameterizationComponent.openPropertyModal(this.rowData);
                break;
            case 'propUnitType':
                this.parameterizationComponent.openPropUnitTypeModal(this.rowData);
                break;
            case 'referencedPropertyValue':
                this.parameterizationComponent.openReferencedPropertyValueModal(this.rowData);
                break;
            case 'constant':
                this.parameterizationComponent.openConstantModal(this.rowData);
                break;
            case 'waitingLink':
                this.parameterizationComponent.openWaitingLinkModal(this.rowData);
                break;
            default:
                break;
        }
    }

    deleteRow() {
        switch (this.rowData.originTable) {
            case 'language':
                this.parameterizationComponent.deleteLanguage(this.rowData.id);
                break;
            case 'users':
                this.parameterizationComponent.deleteUser(this.rowData.id);
                break;
            case 'role':
                this.parameterizationComponent.deleteRole(this.rowData.id);
                break;
            case 'roleInitiatesTransaction':
                this.parameterizationComponent.deleteRoleInitiatesTransaction(this.rowData.role_id, this.rowData.transaction_type_id);
                break;
            case 'roleHasUser':
                this.parameterizationComponent.deleteRoleHasUser(this.rowData.role_id, this.rowData.user_id);
                break;
            case 'processType':
                this.parameterizationComponent.deleteProcessType(this.rowData.id);
                break;
            case 'processDetails':
                this.parameterizationComponent.deleteProcessDetail(this.rowData.process_type_id, this.rowData.property_id);
                break;
            case 'transactionType':
                this.parameterizationComponent.deleteTransactionType(this.rowData.id);
                break;
            case 'entityType':
                this.parameterizationComponent.deleteEntityType(this.rowData.id);
                break;
            case 'property':
                this.parameterizationComponent.deleteProperty(this.rowData.id);
                break;
            case 'propUnitType':
                this.parameterizationComponent.deletePropUnitType(this.rowData.id);
                break;
            case 'referencedPropertyValue':
                this.parameterizationComponent.deleteReferencedPropertyValue(this.rowData.id);
                break;
            case 'constant':
                this.parameterizationComponent.deleteConstant(this.rowData.id);
                break;
            case 'waitingLink':
                this.parameterizationComponent.deleteWaitingLink(this.rowData.id);
                break;
            default:
                break;
        }
    }

    showTranslateButton(rowData) {
        // In case the object doesn't have a name specified in the user's language, show Translate Button
        // Also can't be part of a table specified in the tablesNoTranslation array
        if (rowData.language_id && rowData.language_abbrv !== this.userLanguage &&
            !this.tablesNoTranslation.includes(rowData.originTable)) {
                return true;
        }
        // In case the object is a property of type 'enum' and has propAllowedValues: If a prop allowed value isn't
        // translated in the user's language, show Translate Button for propAllowedValue translation
        if (rowData.originTable === 'property' && rowData.value_type === 'enum' && rowData.property_values) {
            for (const propAllowedValue of rowData.property_values) {
                if (propAllowedValue.language_abbrv !== this.userLanguage) {
                    return true;
                }
            }
        }
        // Otherwise, show the 'Edit' and 'Delete' Buttons instead
        return false;
    }
}
