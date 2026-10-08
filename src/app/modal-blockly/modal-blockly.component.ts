/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';

import { BlocklyApiService } from '../shared/rest-api/blockly-api.service';
import {TranslateService} from 'node_modules/@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActionRule} from '../shared/interfaces/action_rule.model';

@Component({
    selector: 'app-modal-blockly',
    templateUrl: './modal-blockly.component.html',
    styleUrls: ['./modal-blockly.component.css']
})
export class ModalBlocklyComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public selectedActionRule?: ActionRule;
    public ActionRules: any = [];
    public actionRuleDrafts = false;
    private initialStateParams = {} as ModalInitialState;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private alertToast: AlertToastService,
        private restBlocklyApi: BlocklyApiService,
        public translate: TranslateService,
        public router: Router,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.initialStateParams = this.modalService.config.initialState as ModalInitialState;
        this.actionRuleDrafts = this.initialStateParams.draftModal;
        this.loadActionRules();
    }

    getARPreview() {
        return this.sanitizer.bypassSecurityTrustUrl(this.selectedActionRule.preview);
    }

    passBack() {
        this.passEntry.emit(this.selectedActionRule);
        this.closeModal();
    }

    closeModal() {
        this.modalRef.hide();
    }

    loadActionRules() {
        if (this.actionRuleDrafts) {
            this.restBlocklyApi.getActionRuleDrafts().subscribe((data: {}) => {
                this.ActionRules = data;
                this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.LOAD-AR-DRAFT'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.LOAD-AR-DRAFT'));
            });
        } else {
            this.restBlocklyApi.getActionRules().subscribe((data: {}) => {
                this.ActionRules = data;
                this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.LOAD-AR'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.LOAD-AR'));
            });
        }
    }

    deleteActionRule() {
        if (this.actionRuleDrafts) {
            if (window.confirm(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ASK-DELETE-DRAFT'))) {
                return this.restBlocklyApi.deleteActionRuleDraft(this.selectedActionRule.id).subscribe((data: {}) => {
                    if (data) {
                        this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.DELETE-AR-DRAFT'));
                        this.closeModal();
                    } else {
                        this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.DELETE-AR-DRAFT'));
                    }
                });
            }
        } else {
            if (window.confirm(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ASK-DELETE'))) {
                return this.restBlocklyApi.deleteActionRule(this.selectedActionRule.id).subscribe((data: any) => {
                    if (data && data.success === true) {
                        this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.DELETE-AR'));
                        this.closeModal();
                    } else if (data && data.success === false && data.error_code === 'STRUCTURAL_DEPENDENCY') {
                        this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.DELETE-AR-STRUCTURAL-DEPENDENCY'));
                    } else {
                        this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.DELETE-AR'));
                    }
                }, error => {
                    this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.DELETE-AR'));
                });
            }
        }
    }
}

export interface ModalInitialState {
    draftModal: boolean;
}
