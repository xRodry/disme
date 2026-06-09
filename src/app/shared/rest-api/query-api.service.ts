/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QueryApiService {

    constructor(private http: HttpClient) { }

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


    getQueries(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/queries', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getQuery(queryId): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/queries/' + queryId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createQuery(query): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/queries', JSON.stringify(query), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateQuery(query): Observable<any> {
        return this.http.put<any>(environment.apiUrl + '/queries/' + query.id, JSON.stringify(query), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteQuery(queryId) {
        return this.http.delete<any>(environment.apiUrl + '/queries/' + queryId, this.httpOptions)
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
