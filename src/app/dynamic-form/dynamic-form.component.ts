/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';

import {DynamicFormCellCustomComponent} from './dynamic-form_cell.component';
import {GridOptions, ValueFormatterParams} from 'ag-grid-community';

import {FormApiService} from '../shared/rest-api/form-api.service';
import {AgGridTranslateService} from '../shared/common/ag-grid-translate.service';

import { ModalDynamicFormComponent } from '../modal-dynamic-form/modal-dynamic-form.component';

import {BsModalService} from 'ngx-bootstrap/modal';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {Token} from '../shared/rest-api/token';
import {TranslatorFormCellComponent} from './form-translator_cell.component';
import {ModalFormTranslatorComponent} from '../modal-form-translator/modal-form-translator.component';
import {Form} from '../shared/interfaces/form.model';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

    public gridOptions: GridOptions;
    public DynamicFormsActive: any = [];
    public DynamicFormsToTranslate: any = [];
    public DynamicFormsNeedUpdating: any = [];
    public DynamicFormsNoLongerInUse: any = [];

    public formsManagementColumnDefs: any = [];
    public formsTranslatorColumnDefs: any = [];
    public formsNoLongerInUseColumnsDefs: any = [];

    public numberOfTotalFormsManagement = 0;
    public tablesToShow: any = [];

    private languageAbbrv;

    constructor(
        private modalService: BsModalService,
        private alertToast: AlertToastService,
        public restFormApi: FormApiService,
        public translate: TranslateService,
        private agGridTranslate: AgGridTranslateService
    ) {}

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        this.gridOptions = {
            localeText: this.agGridTranslate.localeText(this.languageAbbrv),
            defaultColDef: {
                resizable: true,
                wrapText: true,
                autoHeight: true,
            }
        } as GridOptions;
        this.formsManagementColumnDefs = this.getFormsManagementColumnDefs();
        this.formsTranslatorColumnDefs = this.getFormsTranslatorColumnDefs();
        this.formsNoLongerInUseColumnsDefs = this.getFormsNoLongerInUseColumnDefs();
        this.loadDynamicForms();
    }

    loadDynamicForms() {
        this.restFormApi.getForms().subscribe((data) => {
            // Separate the forms into the different tables of this component
            this.separateFormTypes(data);
            this.gridOptions.getRowStyle = (params) => {
                if (params.data.deleted_action_rule) {
                    return {color: 'red'};
                }
            };
        });
        this.restFormApi.getFormsToTranslate().subscribe((data: {}) => {
            this.DynamicFormsToTranslate = data;
            this.gridOptions.getRowStyle = (params) => {
                if (params.data.deleted_action_rule) {
                    return {color: 'red'};
                }
            };
        });
    }

    separateFormTypes(forms: Form[]) {
        // Get the total number of forms in the system to display below the "Forms Management" tab
        this.numberOfTotalFormsManagement = forms.length;
        // Get the active forms that need updating (duplicated forms resulting from an action rule update - can be from a
        // deleted action rule but still in use in a certain task execution initiated before the action rule deletion/update)
        this.DynamicFormsNeedUpdating = forms.filter(form =>
            form.needs_updating && (form.being_used_in_ar_execution || !form.deleted_action_rule));
        // Get the forms whose action rule has been deleted/updated and aren't being used in any task execution
        this.DynamicFormsNoLongerInUse = forms.filter(form =>
            form.deleted_action_rule && !form.being_used_in_ar_execution);
        // Get the active forms that are being used in the system (can be from a deleted action rule but still in use
        // in a certain task execution initiated before the action rule deletion/update)
        this.DynamicFormsActive = forms.filter(form =>
            !form.needs_updating && (form.being_used_in_ar_execution || !form.deleted_action_rule));
        // If there are forms that need updating, display that table immediately when the forms are loaded
        this.tablesToShow = this.DynamicFormsNeedUpdating.length ? ['forms-need-updating', 'forms-active'] : ['forms-active'];
    }

    showOrHideTable(clickedTableName) {
        if (this.tablesToShow.includes(clickedTableName)) {
            this.tablesToShow = this.tablesToShow.filter( table => {
                return table !== clickedTableName;
            });
        } else {
            this.tablesToShow.push(clickedTableName);
        }
    }

    languageAbbrvFormatter(params: ValueFormatterParams) {
        return params.value.toUpperCase();
    }

    private getFormsManagementColumnDefs() {
        return [
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-TRANSACTION-NAME'),
                field: 'transaction_type_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-ACTION-NAME'),
                field: 'action_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-UPDATED'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-CREATED'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-ACTIONS-AVAILABLE'),
                field: 'edit',
                cellRendererFramework: DynamicFormCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 190,
                pinned: 'right'
            }
        ];
    }

    private getFormsNoLongerInUseColumnDefs() {
        return [
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-TRANSACTION-NAME'),
                field: 'transaction_type_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-ACTION-NAME'),
                field: 'action_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-ACTION-RULE-DELETED'),
                field: 'deleted_action_rule',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-CREATED'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('FORM-MANAGEMENT.FORM-ACTIONS-AVAILABLE'),
                field: 'edit',
                cellRendererFramework: DynamicFormCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 190,
                pinned: 'right'
            }
        ];
    }

    private getFormsTranslatorColumnDefs() {
        return [
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-LANGUAGE-ABBRV'),
                field: 'language_abbrv',
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-TRANSACTION-NAME'),
                field: 'transaction_type_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-ACTION-NAME'),
                field: 'action_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-UPDATED'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-CREATED'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TRANSLATOR.FORM-ACTIONS'),
                field: 'render',
                cellRendererFramework: TranslatorFormCellComponent,
                minWidth: 100,
                maxWidth: 100,
                pinned: 'right'
            }
        ];
    }

    openFormsManagementModal(params = {}) {
        // @ts-ignore
        params.actionsWithFormsDesigned = this.DynamicFormsActive;
        const modalRef = this.modalService.show(ModalDynamicFormComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadDynamicForms();
                this.alertToast.showSuccess(this.translate.instant('FORM-MANAGEMENT.OPERATION-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('FORM-MANAGEMENT.OPERATION-ERROR'));
            }
        });
    }

    openFormsTranslatorModal(params = {}) {
        const modalRef = this.modalService.show(ModalFormTranslatorComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadDynamicForms();
            }
        });
    }

    deleteDynamicForm(id) {
        if (window.confirm(this.translate.instant('FORM-MANAGEMENT.ASK-DELETE'))) {
            this.restFormApi.deleteForm(id).subscribe(data => {
                this.loadDynamicForms();
                this.alertToast.showSuccess(this.translate.instant('FORM-MANAGEMENT.OPERATION-SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('FORM-MANAGEMENT.OPERATION-ERROR'));
            });
        }
    }

    deleteAllUnusedForms() {
        if (window.confirm(this.translate.instant('FORM-MANAGEMENT.ASK-DELETE-ALL-RETIRED-FORMS'))) {
            const retiredFormsIds = this.DynamicFormsNoLongerInUse.map(form => form.id);
            this.restFormApi.deleteAllRetiredForms(retiredFormsIds).subscribe(data => {
                this.loadDynamicForms();
                this.alertToast.showSuccess(this.translate.instant('FORM-MANAGEMENT.OPERATION-SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('FORM-MANAGEMENT.OPERATION-ERROR'));
            });
        }
    }
}
