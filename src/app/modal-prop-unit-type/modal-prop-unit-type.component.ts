/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PropUnitType} from '../shared/interfaces/prop_unit_type.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {PropUnitTypeApiService} from '../shared/rest-api/prop-unit-type-api.service';

@Component({
    selector: 'app-modal-prop-unit-type',
    templateUrl: './modal-prop-unit-type.component.html',
    styleUrls: ['./modal-prop-unit-type.component.css']
})
export class ModalPropUnitTypeComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public propUnitType: any = {} as PropUnitType;
    public propUnitTypeStates: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restPropUnitTypeApi: PropUnitTypeApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed prop unit type to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.propUnitType = params;
        }
    }

    loadFormFieldData() {
        this.propUnitTypeStates = [
            {name: this.translate.instant('PROP-UNIT-TYPES-MODAL.SELECT-STATE.OPTIONS.ACTIVE') , id: 'active'},
            {name: this.translate.instant('PROP-UNIT-TYPES-MODAL.SELECT-STATE.OPTIONS.INACTIVE') , id: 'inactive'}
        ];
    }

    saveData() {
        // If prop unit type has an id, it means we have opened it through the 'edit' button
        if (this.propUnitType.id) {
            this.restPropUnitTypeApi.updatePropUnitType(this.propUnitType).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('PROP-UNIT-TYPES-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('PROP-UNIT-TYPES-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROP-UNIT-TYPES-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restPropUnitTypeApi.createPropUnitType(this.propUnitType).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('PROP-UNIT-TYPES-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('PROP-UNIT-TYPES-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROP-UNIT-TYPES-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }


    closeModal() {
        this.modalRef.hide();
    }

}
