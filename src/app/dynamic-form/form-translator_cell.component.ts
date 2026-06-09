/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {DynamicFormComponent} from './dynamic-form.component';

@Component({
    selector: 'app-translator-form',
    template: '<button type="button" class="btn-info" (click)="translateForm()"> ' +
        '{{ \'TRANSLATOR.FORM-TRANSLATE-ACTION\' | translate }} </button>',
    styleUrls: ['./dynamic-form.component.css']
})

export class TranslatorFormCellComponent {

    rowData: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private modalService: BsModalService,
        private dynamicFormComp: DynamicFormComponent,
    ) {}

    agInit(params) {
        this.rowData = params.data;
    }

    translateForm() {
        this.dynamicFormComp.openFormsTranslatorModal(this.rowData);
    }
}
