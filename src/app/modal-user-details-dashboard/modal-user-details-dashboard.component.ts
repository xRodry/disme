/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {UserApiService} from '../shared/rest-api/user-api.service';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';

@Component({
    selector: 'app-modal-user-details-dashboard',
    templateUrl: './modal-user-details-dashboard.component.html',
    styleUrls: ['./modal-user-details-dashboard.component.css']
})
export class ModalUserDetailsDashboardComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public userDetailingId: number;
    public users: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restEntTypesApi: EnttypeApiService,
        private restUsersApi: UserApiService
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.restUsersApi.getUsers().subscribe((data: {}) => {
            const users: any = data;
            // If it's a 'user input', present only users that don't already have an associated entity in the dropdown
            this.users = users.filter(user => !user.entity_id);
        });
    }

    showForm() {
        this.passEntry.emit(this.userDetailingId);
        this.closeModal();
    }

    closeModal() {
        this.modalRef.hide();
    }

}
