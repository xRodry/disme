/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {Templates} from '../interfaces/template';
import {Template} from '../interfaces/template.model';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TemplateApiService {

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

    httpOptionsPdf = {
        headers: new HttpHeaders({
            Accept: 'application/pdf',
            Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
        }),
        responseType: 'blob' as 'json'
    };

    getTemplates(): Observable<Template[]> {
        return this.http.get<Template[]>(environment.apiUrl + '/templates', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getTemplate(id): Observable<Templates> {
        return this.http.get<Templates>(environment.apiUrl + '/templates/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getPDFFromEDMS(id): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/templates/getPDFFromEDMS/' + id, this.httpOptionsPdf)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createTemplate(template): Observable<Templates> {
        return this.http.post<Templates>(environment.apiUrl + '/templates', JSON.stringify(template), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateTemplate(template): Observable<Templates> {
        return this.http.put<Templates>(environment.apiUrl + '/templates/' + template.id, JSON.stringify(template), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteTemplate(id): Observable<any> {
        return this.http.delete<any>(environment.apiUrl + '/templates/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateTemplate(template): Observable<Templates> {
        return this.http.post<Templates>(environment.apiUrl + '/templates/translate', JSON.stringify(template), this.httpOptions)
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
