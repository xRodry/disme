/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {BlocklyApiService} from '../shared/rest-api/blockly-api.service';
import {ActionRuleDraft} from '../shared/interfaces/action_rule_draft.model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-modal-action-rule-draft',
  templateUrl: './modal-action-rule-draft.component.html',
  styleUrls: ['./modal-action-rule-draft.component.css']
})
export class ModalActionRuleDraftComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public actionRuleDraft: any = {} as ActionRuleDraft;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restBlocklyApi: BlocklyApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        // If actionRuleDraft is being updated, save the passed actionRuleDraft to populate the form's fields
        this.actionRuleDraft = this.modalService.config.initialState;
    }

    getARPreview() {
        return this.sanitizer.bypassSecurityTrustUrl(this.actionRuleDraft.preview);
    }

    saveData() {
        // If actionRuleDraft has an id, it means we have opened it through the 'edit' button
        if (this.actionRuleDraft.id) {
            this.restBlocklyApi.updateActionRuleDraft(this.actionRuleDraft).subscribe((data) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ACTION-RULE-DRAFT-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit(data);
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ACTION-RULE-DRAFT-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ACTION-RULE-DRAFT-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restBlocklyApi.storeActionRuleDraft(this.actionRuleDraft).subscribe((data) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('ACTION-RULE-DRAFT-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit(data);
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('ACTION-RULE-DRAFT-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('ACTION-RULE-DRAFT-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }


    closeModal() {
        this.modalRef.hide();
    }

}
