/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {ConstantDB} from '../shared/interfaces/constant.model';
import {ConstantApiService} from '../shared/rest-api/constant-api.service';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-constant',
  templateUrl: './modal-constant.component.html',
  styleUrls: ['./modal-constant.component.css']
})
export class ModalConstantComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public constant: any = {} as ConstantDB;
    public constantValueTypes: any = [];
    public invalidDate = false;
    public boolSelectValues;
    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restConstantApi: ConstantApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed constant to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.constant = params;
            // Transform saved date in DB to ngbDate format, so we can display the saved date in the date input
            if (this.constant.value_type === 'date') {
                this.formatDate(null, true);
            }
            // Transform the string containing the enumValues into an object to populate the options in the modal
            if (this.constant.value_type === 'enum') {
                this.constant.enumValues = JSON.parse(this.constant.value);
            }
        }
    }

    loadFormFieldData() {
        this.constantValueTypes = [
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.TEXT') , id: 'text'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.BOOL') , id: 'bool'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.INT') , id: 'int'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.DOUBLE') , id: 'double'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.ENUM') , id: 'enum'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.DATE') , id: 'date'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-VALUE-TYPE.OPTIONS.TIME') , id: 'time'},
        ];
        this.boolSelectValues = this.getBoolValues();
    }

    getBoolValues() {
        return [
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-BOOL-VALUE.TRUE') , id: 'true'},
            {name: this.translate.instant('CONSTANTS-MODAL.SELECT-BOOL-VALUE.FALSE') , id: 'false'},
        ];
    }

    clearValueInput() {
        this.constant.value = null;
        this.constant.ngbDate = null;
        this.invalidDate = false;
        this.constant.enumValues = this.constant.value_type === 'enum' ?
            this.constant.enumValues = [{value: null}] : null;
    }

    formatDate(ngbDate, formatToNgb = false) {
        if (formatToNgb) {
            // Transform saved date in DB to ngbDate format, so we can display the saved date in the date input
            const newDate = new Date(this.constant.value);
            this.constant.ngbDate = new NgbDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
        } else {
            // Transform ngbDate into 'yyyy-mm-dd' date, so we can save it successfully in the DB
            this.constant.value = ngbDate.year + '-' + ngbDate.month + '-' + ngbDate.day;
        }
    }

    addEnumValue() {
        this.constant.enumValues.push({value: null});
    }

    removeEnumValue(i: number) {
        if (this.constant.enumValues.length > 1) {
            this.constant.enumValues.splice(i, 1);
        }
    }

    saveData() {
        this.constant.value = this.constant.value_type === 'enum' ? JSON.stringify(this.constant.enumValues) : this.constant.value;
        // If constant has an id, it means we have opened it through the 'edit' button
        if (this.constant.id) {
            this.restConstantApi.updateConstant(this.constant).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('CONSTANTS-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('CONSTANTS-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('CONSTANTS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restConstantApi.createConstant(this.constant).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('CONSTANTS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('CONSTANTS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('CONSTANTS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    disableSaveButton() {
        let disableSaveButton = false;
        if (!(this.constant.name && this.constant.value_type)) {
            disableSaveButton = true;
        }
        if (this.constant.value_type === 'date' && this.invalidDate) {
            disableSaveButton = true;
        }
        // When valueType is enum, we have 'constant.enumValues' (object with enumValues) and not 'constant.value' (constant value).
        if (this.constant.value_type === 'enum') {
            // If value_type is 'enum', the user has to fill all rows for 'enum values'
            for (const constantEnumValue of this.constant.enumValues) {
                if (constantEnumValue.value === null || constantEnumValue.value === '') {
                    disableSaveButton = true;
                }
            }
        } else if (!this.constant.value) {
            // For every other valueType, disable the button if there is no value inserted
            disableSaveButton = true;
        }
        return disableSaveButton;
    }


    closeModal() {
        this.modalRef.hide();
    }

}
