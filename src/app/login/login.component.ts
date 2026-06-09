/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, NgModule, OnInit, Output} from '@angular/core';
import { MatFormFieldModule } from '@angular/material';
import { AuthService } from '../shared/rest-api/auth.service';
import { Router } from '@angular/router';

@NgModule({
  imports: [MatFormFieldModule],
})
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    loginData: any = {};

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        if (this.auth.isLoggedIn) {
            this.router.navigate(['dashboard']);
        }
    }

    doLogin() {
        console.log('Login Data: ', this.loginData);
        this.auth.getAccessToken(this.loginData).subscribe((data: {}) => {
            this.router.navigate(['dashboard']);
        });
    }

    goToRegister() {
        this.router.navigate(['register']);
    }
}
