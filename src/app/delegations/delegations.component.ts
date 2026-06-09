/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {DelegationsApiService} from '../shared/rest-api/delegations-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {AgGridTranslateService} from '../shared/common/ag-grid-translate.service';
import {TranslateService} from '@ngx-translate/core';
import {GridOptions, ValueGetterParams} from 'ag-grid-community';
import {Token} from '../shared/rest-api/token';
import {ModalDelegationsComponent} from '../modal-delegations/modal-delegations.component';
import {DelegationsCellComponent} from './delegations_cell.component';

@Component({
  selector: 'app-delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['./delegations.component.css'],
})
export class DelegationsComponent implements OnInit {

    public gridOptions: GridOptions;
    public delegations: any = [];
    private languageAbbrv;

    constructor(
        private modalService: BsModalService,
        public restDelegationsApi: DelegationsApiService,
        private alertToast: AlertToastService,
        private agGridTranslate: AgGridTranslateService,
        public translate: TranslateService
    ) {}

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        this.gridOptions = {
            columnDefs: this.columnDefs(),
            localeText: this.agGridTranslate.localeText(this.languageAbbrv),
            defaultColDef: {
                resizable: true,
                wrapText: true,
                autoHeight: true,
            }
        } as GridOptions;
        this.loadDelegations();
    }

    loadDelegations() {
        return this.restDelegationsApi.getDelegations().subscribe((data: {}) => {
            this.delegations = data;
        });
    }

    transactionStepGetter(params: ValueGetterParams) {
        const typeName = params.data.type === 'act' ?
            this.translate.instant('DELEGATIONS.TABLE.TYPE.ACT') :
            this.translate.instant('DELEGATIONS.TABLE.TYPE.FACT');
        const tStateName = params.data.type === 'act' ? params.data.t_state_act_name : params.data.t_state_name;
        return params.data.transaction_type_name + ' ' + typeName + ' ' + tStateName;
    }

    delegatedToGetter(params: ValueGetterParams) {
        return params.data.delegated_role_name ? params.data.delegated_role_name + ' (' + params.data.user_name + ')' :
            params.data.delegated_role_name;
    }

    private columnDefs() {
        return [
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('DELEGATIONS.TABLE.DELEGATED-ROLE'),
                field: 'delegated_to',
                valueGetter: this.delegatedToGetter.bind(this),
                sortable: true, filter: true,
                flex: 5,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('DELEGATIONS.TABLE.TRANSACTION-STEP'),
                field: 'transactional_type_name&t_name&t_state_name',
                valueGetter: this.transactionStepGetter.bind(this),
                sortable: true, filter: true,
                flex: 5,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('DELEGATIONS.TABLE.START-TIME'),
                field: 'start_time',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('DELEGATIONS.TABLE.END-TIME'),
                field: 'end_time',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('DELEGATIONS.TABLE.ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: DelegationsCellComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 190,
                pinned: 'right'
            }
        ];
    }

    openModal(params = {}) {
        const modalRef = this.modalService.show(ModalDelegationsComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadDelegations();
                this.alertToast.showSuccess(this.translate.instant('DELEGATIONS.OPERATION-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('DELEGATIONS.OPERATION-ERROR'));
            }
        });
    }

    deleteDelegation(delegationId) {
        if (window.confirm(this.translate.instant('DELEGATIONS.ASK-DELETE'))) {
            this.restDelegationsApi.deleteDelegation(delegationId).subscribe(data => {
                this.loadDelegations();
                this.alertToast.showSuccess(this.translate.instant('DELEGATIONS.OPERATION-SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('DELEGATIONS.OPERATION-ERROR'));
            });
        }
    }
}
