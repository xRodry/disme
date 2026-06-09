/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component } from '@angular/core';

@Component({
    selector: 'app-bi-knowage-login',
    templateUrl: './bi-knowage-login.component.html',
    styleUrls: ['./bi-knowage-login.component.css']
})

export class BiKnowageLoginComponent  {
    protected username: string;
    protected password: string;

    constructor() { }

    saveDataLocal() {
        const data = [{ username: this.username, password: this.password }];
        localStorage.setItem('biKnowageSession', JSON.stringify(data));
    }
}
