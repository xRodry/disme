/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {DelegationsComponent} from './delegations.component';

@Component({
    selector: 'app-delegations',
    template: '<button type="button" class="btn-info" (click)="editRow()">{{ \'DELEGATIONS.TABLE.ACTIONS.EDIT\' | translate }}</button>' +
        '<button type="button" class="btn-warning" (click)="deleteRow()">{{ \'DELEGATIONS.TABLE.ACTIONS.DELETE\' | translate }}</button>',
    styleUrls: ['./delegations.component.css']
})
export class DelegationsCellComponent {

    rowData: any;
    constructor(
        private http: HttpClient,
        private router: Router,
        private modalService: BsModalService,
        private delegationsComponent: DelegationsComponent
    ) {}

    agInit(params) {
        this.rowData = params.data;
    }

    editRow() {
        this.delegationsComponent.openModal(this.rowData);
    }

    deleteRow() {
        this.delegationsComponent.deleteDelegation(this.rowData.id);
    }
}
