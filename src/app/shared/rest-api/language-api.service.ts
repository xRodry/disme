/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '../../../../node_modules/@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Languages} from '../interfaces/language';
import {catchError, retry} from 'rxjs/operators';
import { TokenVar } from './token';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LanguageApiService {

    constructor(private http: HttpClient) { }

    /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
        })
    };


    getLanguages(): Observable<Languages> {
        return this.http.get<Languages>(environment.apiUrl + '/languages', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getLanguage(id): Observable<Languages> {
        return this.http.get<Languages>(environment.apiUrl + '/languages/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createLanguage(language): Observable<Languages> {
        return this.http.post<Languages>(environment.apiUrl + '/languages', JSON.stringify(language), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateLanguage(language): Observable<Languages> {
        return this.http.put<Languages>(environment.apiUrl + '/languages/' + language.id, JSON.stringify(language), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteLanguage(id) {
        return this.http.delete<Languages>(environment.apiUrl + '/languages/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    handleError(error) {
        return throwError(error.statusText);
    }

}
