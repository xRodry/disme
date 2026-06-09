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
export class DynSearchApiService {

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
        })
    };

    saveURL(data): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/dynSearch/save_url', data, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getQueryResults(queryParams): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/dynSearch/get_query_results', queryParams, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    testQueryResults(queryParams): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/dynSearch/test_query_results', queryParams, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getQueries(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/dynSearch/get_queries', this.httpOptions)
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
