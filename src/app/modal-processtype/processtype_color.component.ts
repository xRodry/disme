/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component} from '@angular/core';

@Component({
    selector: 'app-processtype',
    template: '<span class="badge badge-pill" [style.background-color]= "data">&nbsp;</span> {{data}}',
    styleUrls: ['./modal-processtype.component.css']
})

export class ProcessTypeColorCustomComponent {
    data: any;
    params: any;

    constructor() {
    }

    agInit(params) {
        this.params = params;
        this.data = params.data.color;
    }
}
