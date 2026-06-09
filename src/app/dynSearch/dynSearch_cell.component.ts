/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {DynSearchComponent} from './dynSearch.component';

@Component({
    template: '<button type="button" class="btn-info" (click)="editQuery()"> ' +
        '{{ \'DYNAMIC-SEARCH.QUERIES.TABLE-COL-4.EDIT\' | translate }} </button>' +
        '<button type="button" class="btn-warning" (click)="deleteQuery()"> ' +
        '{{ \'DYNAMIC-SEARCH.QUERIES.TABLE-COL-4.DELETE\' | translate }} </button>',
})

export class DynamicSearchTableCellComponent {

    rowData: any;

    constructor(private http: HttpClient,
                private router: Router,
                private dynamicSearch: DynSearchComponent
    ) {}

    agInit(params) {
        this.rowData = params.data;
    }

    editQuery() {
        this.dynamicSearch.populateQueryEditingFields(this.rowData);
    }

    deleteQuery() {
        this.dynamicSearch.deleteQuery(this.rowData.id);
    }

}
