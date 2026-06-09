/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-modal-user-evaluated-expression',
  templateUrl: './modal-user-evaluated-expression.component.html',
  styleUrls: ['./modal-user-evaluated-expression.component.css']
})
export class ModalUserEvaluatedExpressionComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public userEvaluatedExpressionText: string;

    constructor(private modalService: BsModalService,
                private modalRef: BsModalRef,
                public translate: TranslateService) {}

    ngOnInit() {
    }

    closeModal() {
        this.passEntry.emit(0);
        this.modalRef.hide();
    }

    passBack(success) {
        this.passEntry.emit(success);
        this.modalRef.hide();
    }

}
