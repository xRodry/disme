/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {TransactionTypes} from '../interfaces/transaction_type';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransactionTypeApiService {

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


    getTransactionTypes(): Observable<TransactionTypes> {
        return this.http.get<TransactionTypes>(environment.apiUrl + '/transactionType', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getTransactionType(id): Observable<TransactionTypes> {
        return this.http.get<TransactionTypes>(environment.apiUrl + '/transactionType/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createTransactionType(transactionType): Observable<TransactionTypes> {
        return this.http.post<TransactionTypes>(environment.apiUrl + '/transactionType', JSON.stringify(transactionType),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateTransactionType(transactionType): Observable<TransactionTypes> {
        return this.http.put<TransactionTypes>(environment.apiUrl + '/transactionType/' + transactionType.id,
            JSON.stringify(transactionType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteTransactionType(id) {
        return this.http.delete<TransactionTypes>(environment.apiUrl + '/transactionType/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateTransactionType(transactionType): Observable<TransactionTypes> {
        return this.http.post<TransactionTypes>(environment.apiUrl + '/transactionType/translate',
            JSON.stringify(transactionType), this.httpOptions)
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
