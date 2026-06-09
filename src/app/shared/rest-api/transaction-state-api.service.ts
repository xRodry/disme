/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {TransactionStates} from '../interfaces/transaction_state';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransactionStateApiService {

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


    getTransactionStates(): Observable<TransactionStates> {
        return this.http.get<TransactionStates>(environment.apiUrl + '/tstates', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getTransactionState(id): Observable<TransactionStates> {
        return this.http.get<TransactionStates>(environment.apiUrl + '/tstates/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createTransactionState(transactionState): Observable<TransactionStates> {
        return this.http.post<TransactionStates>(environment.apiUrl + '/tstates', JSON.stringify(transactionState),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateTransactionState(transactionState): Observable<TransactionStates> {
        return this.http.put<TransactionStates>(environment.apiUrl + '/tstates/' + transactionState.id,
            JSON.stringify(transactionState), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteTransactionState(id) {
        return this.http.delete<TransactionStates>(environment.apiUrl + '/tstates/' + id, this.httpOptions)
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
