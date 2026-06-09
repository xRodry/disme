/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-modal-select-instance',
    templateUrl: './modal-select-instance.component.html',
    styleUrls: ['./modal-select-instance.component.css']
})
export class ModalSelectInstanceComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public availableInstances: any = [];
    public backupInstances: any = [];
    private filteredInstances: any = [];

    public instanceType: string;
    public instanceTypeName: string;

    private languageAbbrv: string;
    protected searchTerm = '';

    // Pagination
    public page = 1;
    public pageSize = 10;
    // Sorting
    private last = { column: 'created_at', by: 'asc' };

    constructor(
        private modalRef: BsModalRef,
        public translate: TranslateService
    ) { }

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        this.backupInstances = this.availableInstances;
        this.filteredInstances = this.availableInstances;
    }

    closeModal() {
        this.modalRef.hide();
    }

    passBack(instance) {
        this.passEntry.emit(instance.id);
        this.closeModal();
    }

    sortBy(column) {
        if (this.last.column === column) {
            this.last.by = this.last.by === 'asc' ? 'desc' : 'asc';
        } else {
            this.last.column = column;
            this.last.by = 'asc';
        }
        this.filteredInstances.sort((a, b) => this.sortAuxiliary(a, b));
        this.refreshDisplayingInstances();
    }

    sortAuxiliary(a, b) {
        if (this.last.by === 'desc')  {
            return a[this.last.column] > b[this.last.column] ? -1 : a[this.last.column] < b[this.last.column] ? 1 : 0;
        }
        if (this.last.by === 'asc') {
            return a[this.last.column] > b[this.last.column] ? 1 : a[this.last.column] < b[this.last.column] ? -1 : 0;
        }
    }

    filterInstances() {
        this.page = 1;
        const term = this.searchTerm.toLowerCase();
        this.filteredInstances = this.backupInstances.filter(process =>
            process.internal_id.toString().toLowerCase().includes(term) ||
            process.details.some(detail => detail.toLowerCase().includes(term)) ||
            process.created_at.toString().toLowerCase().includes(term) ||
            process.updated_at.toString().toLowerCase().includes(term)
        );
        this.refreshDisplayingInstances();
    }

    // Allows the update of the elements on each page of the table
    refreshDisplayingInstances() {
        this.availableInstances = this.filteredInstances.slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
    }
}
