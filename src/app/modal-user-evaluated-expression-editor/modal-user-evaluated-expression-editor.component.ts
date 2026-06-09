/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {UserEvaluatedExpression} from '../shared/interfaces/user_evaluated_expression.model';
import {UserEvaluatedExpressionApiService} from '../shared/rest-api/user-evaluated-expression-api.service';

@Component({
    selector: 'app-modal-user-evaluated-expression-editor',
    templateUrl: './modal-user-evaluated-expression-editor.component.html',
    styleUrls: ['./modal-user-evaluated-expression-editor.component.css']
})
export class ModalUserEvaluatedExpressionEditorComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public userEvaluatedExpression: any = {} as UserEvaluatedExpression;
    private from: string;
    public translationNamePlaceholder: string;
    public expressionTranslation = false;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private alertToast: AlertToastService,
        private restUserEvaluatedExpressionApi: UserEvaluatedExpressionApiService,
        public translate: TranslateService,
        public router: Router
    ) {
        this.userEvaluatedExpression.expression_text = this.translate.instant(
            'USER-EVALUATED-EXPRESSION-MANAGEMENT.MODAL.TEXT-DEFAULT');
    }

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.from = params.from;
            this.expressionTranslation = this.from === 'expressionTranslation';
            // Comes from the Template Editor Page in order to update a userEvaluatedExpression
            if (this.from === 'expressionEdition' || this.from === 'expressionTranslation') {
                this.userEvaluatedExpression = params;
                if (this.from === 'expressionTranslation') {
                    this.getPlaceholderFieldNamesForTranslation();
                }
            } else {
                // Comes from Blockly in order to update a userEvaluatedExpression, get the block field values to load the fields in editor
                this.userEvaluatedExpression = params.blockTemplate;
            }
        } else {
            this.from = 'expressionEdition';
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

    passBack() {
        if (this.from === 'expressionEdition') {
            if (!this.userEvaluatedExpression.id) {
                this.createUserEvaluatedExpression();
            } else {
                this.updateUserEvaluatedExpression();
            }
        } else if (this.expressionTranslation) {
            this.translateUserEvaluatedExpression();
        } else if (this.from === 'blockly') {
            // If call was made from blockly, send back the expression values updated in the modal
            console.log('I WAS CALLED FROM BLOCKLY');
            this.passEntry.emit(this.userEvaluatedExpression);
            this.closeModal();
        }
    }

    getPlaceholderFieldNamesForTranslation() {
        // These placeholders will be placed in the fields that need translation. We then 'erase' the expression values
        // for those fields so that user sees the placeholder and can insert new name.
        this.translationNamePlaceholder = this.userEvaluatedExpression.expression_name;
        this.userEvaluatedExpression.expression_name = null;
    }

    createUserEvaluatedExpression() {
        this.restUserEvaluatedExpressionApi.createUserEvaluatedExpression(this.userEvaluatedExpression)
            .subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.SUCCESS.CREATING'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.CREATING'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant(
                    'USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.CREATING'));
                this.passEntry.emit('error');
            });
    }

    updateUserEvaluatedExpression() {
        this.restUserEvaluatedExpressionApi.updateUserEvaluatedExpression(this.userEvaluatedExpression)
            .subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.SUCCESS.UPDATING'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.UPDATING'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant(
                    'USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.UPDATING'));
                this.passEntry.emit('error');
            });
    }

    translateUserEvaluatedExpression() {
        this.restUserEvaluatedExpressionApi.translateUserEvaluatedExpression(this.userEvaluatedExpression)
            .subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.SUCCESS.TRANSLATING'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant(
                        'USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.TRANSLATING'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant(
                    'USER-EVALUATED-EXPRESSION-MANAGEMENT.ERROR.TRANSLATING'));
                this.passEntry.emit('error');
            });
    }

}
