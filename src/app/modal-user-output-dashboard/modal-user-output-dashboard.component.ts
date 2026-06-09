/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-modal-user-output-dashboard',
    templateUrl: './modal-user-output-dashboard.component.html',
    styleUrls: ['./modal-user-output-dashboard.component.css']
})

export class ModalUserOutputDashboardComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public templateType: string;
    public templateHeader: string;
    public templateText: string;
    public templateButton: string;
    public pdfInfo: any;
    private success: boolean;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public translate: TranslateService,
        private route: ActivatedRoute,
        public router: Router,
        private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
    }

    getPdfLink() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfInfo);
    }

    closeModal() {
        this.success = false;
        this.passEntry.emit(this.success);
        this.modalRef.hide();
    }

    passBack() {
        this.success = true;
        this.passEntry.emit(this.success);
        this.modalRef.hide();
    }
}
