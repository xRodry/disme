/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {Value} from '../shared/interfaces/value.model';
import {ValueApiService} from '../shared/rest-api/value-api.service';

@Component({
  selector: 'app-modal-value',
  templateUrl: './modal-value.component.html',
  styleUrls: ['./modal-value.component.css']
})
export class ModalValueComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public value: any = {} as Value;
    public valueStates: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restValueApi: ValueApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed value to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.value = params;
        }
    }

    loadFormFieldData() {
        this.valueStates = [
            {name: this.translate.instant('VALUE-MODAL.SELECT-STATE.OPTIONS.ACTIVE') , id: 'active'},
            {name: this.translate.instant('VALUE-MODAL.SELECT-STATE.OPTIONS.INACTIVE') , id: 'inactive'}
        ];
    }

    saveData() {
        this.restValueApi.updateValue(this.value).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('VALUE-MODAL.UPDATE.SUCCESS'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('VALUE-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('VALUE-MODAL.UPDATE.ERROR'));
            this.passEntry.emit('error');
        });
    }

    closeModal() {
        this.modalRef.hide();
    }

}
