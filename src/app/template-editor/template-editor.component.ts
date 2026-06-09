/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';

import { TemplateEditorCellComponent } from './template-editor_cell.component';
import { GridOptions } from 'ag-grid-community';

import { TemplateApiService } from '../shared/rest-api/template-api.service';
import { AgGridTranslateService } from '../shared/common/ag-grid-translate.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertToastService } from '../shared/common/alert-toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalTemplateEditorComponent } from '../modal-template-editor/modal-template-editor.component';
import {Template} from '../shared/interfaces/template.model';
import {Token} from '../shared/rest-api/token';
import {UserEvaluatedExpressionApiService} from '../shared/rest-api/user-evaluated-expression-api.service';
import {UserEvaluatedExpression} from '../shared/interfaces/user_evaluated_expression.model';
import {
    ModalUserEvaluatedExpressionEditorComponent
} from '../modal-user-evaluated-expression-editor/modal-user-evaluated-expression-editor.component';
import {UserEvaluatedExpressionCellComponent} from './user-evaluated-expression_cell.component';

@Component({
    selector: 'app-template-editor',
    templateUrl: './template-editor.component.html',
    styleUrls: ['./template-editor.component.css']
})

export class TemplateEditorComponent implements OnInit {

    public gridOptions: GridOptions;
    public templates: Template[] = [];
    public userEvaluatedExpressions: UserEvaluatedExpression[] = [];

    public templateColumnDefs: any = [];
    public userEvaluatedExpressionColumnDefs: any = [];

    public tablesToShow: any = [];

    private languageAbbrv;

    constructor(
        private modalService: BsModalService,
        private alertToast: AlertToastService,
        public restTemplateApi: TemplateApiService,
        public restUserEvaluatedExpressionApi: UserEvaluatedExpressionApiService,
        public translate: TranslateService,
        private agGridTranslate: AgGridTranslateService
    ) { }

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
        this.templateColumnDefs = this.getTemplateColumnDefs();
        this.userEvaluatedExpressionColumnDefs = this.getUserEvaluatesExpressionColumnDefs();
        this.loadComponentData();
    }

    loadComponentData() {
        this.restTemplateApi.getTemplates().subscribe((data) => {
            this.templates = data.filter(template => template.type !== 'validation_warning');
        });
        this.restUserEvaluatedExpressionApi.getUserEvaluatedExpressions().subscribe((data) => {
            this.userEvaluatedExpressions = data;
        });
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

    private getTemplateColumnDefs() {
        return [
            {
                headerName: 'ID',
                field: 'template_id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('TEMPLATES-MANAGEMENT.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TEMPLATES-MANAGEMENT.TABLE.TYPE'),
                field: 'type',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TEMPLATES-MANAGEMENT.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TEMPLATES-MANAGEMENT.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('TEMPLATES-MANAGEMENT.TABLE.AVAILABLE-ACTIONS'),
                field: 'edit',
                cellRendererFramework: TemplateEditorCellComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 190,
                pinned: 'right'
            }
        ];
    }

    private getUserEvaluatesExpressionColumnDefs() {
        return [
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.NAME'),
                field: 'expression_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('USER-EVALUATED-EXPRESSION-MANAGEMENT.TABLE.AVAILABLE-ACTIONS'),
                field: 'edit',
                cellRendererFramework: UserEvaluatedExpressionCellComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 190,
                pinned: 'right'
            }
        ];
    }

    openTemplateEditorModal(params = {}) {
        const modalRef = this.modalService.show(ModalTemplateEditorComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadComponentData();
            }
        });
    }

    openUserEvaluatedExpressionEditorModal(params = {}) {
        const modalRef = this.modalService.show(ModalUserEvaluatedExpressionEditorComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadComponentData();
            }
        });
    }

    deleteTemplate(id) {
        if (window.confirm(this.translate.instant('TEMPLATES-MANAGEMENT.DELETE-CONFIRMATION-MESSAGE'))) {
            this.restTemplateApi.deleteTemplate(id).subscribe(data => {
                if (data.belongsAR === 'true') {
                    this.alertToast.showWarning(this.translate.instant( 'TEMPLATES-MANAGEMENT.WARNING.USED-IN-AR'));
                } else {
                    this.loadComponentData();
                    this.alertToast.showSuccess(this.translate.instant('TEMPLATES-MANAGEMENT.SUCCESS.DELETING'));
                }
            }, error => {
                console.log(error);
                this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.DELETING'));
            });
        }
    }

    deleteUserEvaluatedExpression(id) {
        if (window.confirm(this.translate.instant('USER-EVALUATED-EXPRESSION-MANAGEMENT.DELETE-CONFIRMATION-MESSAGE'))) {
            this.restUserEvaluatedExpressionApi.deleteUserEvaluatedExpression(id).subscribe(data => {
                if (data.belongsAR === 'true') {
                    this.alertToast.showWarning(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.WARNING.USED-IN-AR'));
                } else {
                    this.loadComponentData();
                    this.alertToast.showSuccess(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.SUCCESS.DELETING'));
                }
            }, error => {
                console.log(error);
                this.alertToast.showError(this.translate.instant('USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.DELETING'));
            });
        }
    }

}
