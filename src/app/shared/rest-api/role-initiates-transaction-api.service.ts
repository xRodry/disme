/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import { RoleInitiatesTransactions } from '../interfaces/role_initiates_transaction';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoleInitiatesTransactionApiService {

    constructor(private http: HttpClient) {
    }

    /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
        })
    };


    getRoleInitiatesTransactions(): Observable<RoleInitiatesTransactions> {
        return this.http.get<RoleInitiatesTransactions>(environment.apiUrl + '/roleInitiatesTransaction', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getRoleInitiatesTransaction(roleId, transactionTypeId): Observable<RoleInitiatesTransactions> {
        return this.http.get<RoleInitiatesTransactions>(environment.apiUrl + '/roleInitiatesTransaction/' + roleId + '/' +
            transactionTypeId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createRoleInitiatesTransaction(roleInitiatesTransaction): Observable<RoleInitiatesTransactions> {
        return this.http.post<RoleInitiatesTransactions>(environment.apiUrl + '/roleInitiatesTransaction',
            JSON.stringify(roleInitiatesTransaction), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateRoleInitiatesTransaction(roleInitiatesTransaction, previousRoleId): Observable<RoleInitiatesTransactions> {
        roleInitiatesTransaction.previous_role_id = previousRoleId;
        return this.http.put<RoleInitiatesTransactions>(environment.apiUrl + '/roleInitiatesTransaction/' +
            roleInitiatesTransaction.role_id + '/' + roleInitiatesTransaction.transaction_type_id,
            JSON.stringify(roleInitiatesTransaction), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteRoleInitiatesTransaction(roleId, transactionTypeId) {
        return this.http.delete<RoleInitiatesTransactions>(environment.apiUrl + '/roleInitiatesTransaction/' + roleId + '/' +
            transactionTypeId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Error handling
    handleError(error) {
        return throwError(error.statusText);
    }

}
