/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { BiElement } from '../../../../shared/interfaces/bi_element.model';

@Component({
  selector: 'app-bi-element-details-modal',
  templateUrl: './bi-element-details-modal.component.html',
  styleUrls: ['./bi-element-details-modal.component.css']
})

export class BiElementDetailsModalComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public biElement: BiElement = {} as BiElement;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
    ) { }

    ngOnInit() {
        this.biElement = this.modalService.config.initialState as BiElement;
    }

    closeModal() {
        this.modalRef.hide();
    }

}
