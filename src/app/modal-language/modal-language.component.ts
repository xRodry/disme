/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';

import {LanguageApiService} from '../shared/rest-api/language-api.service';
import {TranslateService} from '@ngx-translate/core';
import {AlertToastService} from '../shared/common/alert-toast.service';

@Component({
  selector: 'app-modal-language',
  templateUrl: './modal-language.component.html',
  styleUrls: ['./modal-language.component.css']
})

export class ModalLanguageComponent implements OnInit {

  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public language: any = {};
    public languageState;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private restApi: LanguageApiService,
        public router: Router,
        private translate: TranslateService,
        private alertToast: AlertToastService
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed language to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.language = params;
        }
    }

    loadFormFieldData() {
        this.languageState = [
            {name: this.translate.instant('LANGUAGE-MODAL.SELECT-STATE.OPTIONS.ACTIVE') , id: 'active'},
            {name: this.translate.instant('LANGUAGE-MODAL.SELECT-STATE.OPTIONS.INACTIVE') , id: 'inactive'}
        ];
    }

    closeModal() {
        this.modalRef.hide();
    }

    saveData() {
        // If language type doesn't have an id, it means we haven't opened it through the 'edit' button
        if (!this.language.id) {
            this.restApi.createLanguage(this.language).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('LANGUAGE-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('LANGUAGE-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('LANGUAGE-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restApi.updateLanguage(this.language).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('LANGUAGE-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('LANGUAGE-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('LANGUAGE-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }
}

