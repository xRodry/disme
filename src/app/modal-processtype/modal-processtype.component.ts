/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';

import {ProcessTypeApiService} from '../shared/rest-api/processtype-api.service';
import {TranslateService} from '@ngx-translate/core';
import {AlertToastService} from '../shared/common/alert-toast.service';

@Component({
  selector: 'app-modal-processtype',
  templateUrl: './modal-processtype.component.html',
  styleUrls: ['./modal-processtype.component.css']
})
export class ModalProcessTypeComponent implements OnInit {

  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

  public processType: any = {};
  public processTypeState;

  constructor(
      private modalService: BsModalService,
      private modalRef: BsModalRef,
      private restApi: ProcessTypeApiService,
      public router: Router,
      private translate: TranslateService,
      private alertToast: AlertToastService
  ) { }

  ngOnInit() {
    // Load the data needed for the form's select boxes' options
    this.loadFormFieldData();
    // If component is opened through the 'edit' button, save the passed process type to populate the form's fields
    const params: any = this.modalService.config.initialState;
    const isEmptyObj = !Object.keys(params).length;
    if (!isEmptyObj) {
      this.loadProcessTypeById(params.id);
    }
  }

  loadFormFieldData() {
      this.processTypeState = [
          {name: this.translate.instant('PROCESS-TYPES-MODAL.SELECT-STATE.OPTIONS.ACTIVE') , id: 'active'},
          {name: this.translate.instant('PROCESS-TYPES-MODAL.SELECT-STATE.OPTIONS.INACTIVE') , id: 'inactive'}
      ];
  }

  closeModal() {
    this.modalRef.hide();
  }

  loadProcessTypeById(id) {
    return this.restApi.getProcessType(id).subscribe((data: {}) => {
      this.processType = data;
    });
  }

  saveData() {
    // If process type doesn't have an id, it means we haven't opened it through the 'edit' button
    if (!this.processType.id) {
      this.restApi.createProcessType(this.processType).subscribe((data: {}) => {
        if (data) {
          this.alertToast.showSuccess(this.translate.instant('PROCESS-TYPES-MODAL.CREATE.SUCCESS'));
          this.passEntry.emit('success');
          this.closeModal();
        } else {
          this.alertToast.showError(this.translate.instant('PROCESS-TYPES-MODAL.CREATE.ERROR'));
          this.passEntry.emit('error');
        }
      }, error => {
        this.alertToast.showError(this.translate.instant('PROCESS-TYPES-MODAL.CREATE.ERROR'));
        this.passEntry.emit('error');
      });
    } else {
      this.restApi.updateProcessType(this.processType).subscribe((data: {}) => {
        if (data) {
          this.alertToast.showSuccess(this.translate.instant('PROCESS-TYPES-MODAL.UPDATE.SUCCESS'));
          this.passEntry.emit('success');
          this.closeModal();
        } else {
          this.alertToast.showError(this.translate.instant('PROCESS-TYPES-MODAL.UPDATE.ERROR'));
          this.passEntry.emit('error');
        }
      }, error => {
        this.alertToast.showError(this.translate.instant('PROCESS-TYPES-MODAL.UPDATE.ERROR'));
        this.passEntry.emit('error');
      });
    }
  }
}

