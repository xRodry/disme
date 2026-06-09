/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {environment} from 'src/environments/environment';
import {ContextVariable} from '../interfaces/context_variable.model';

@Injectable({
    providedIn: 'root'
})
export class ContextVariableApiService {

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


    getContextVariables(): Observable<ContextVariable[]> {
        return this.http.get<ContextVariable[]>(environment.apiUrl + '/contextVariable', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getContextVariable(id): Observable<ContextVariable> {
        return this.http.get<ContextVariable>(environment.apiUrl + '/contextVariable/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createContextVariable(contextVariable): Observable<ContextVariable> {
        return this.http.post<ContextVariable>(environment.apiUrl + '/contextVariable', JSON.stringify(contextVariable), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateContextVariable(contextVariable): Observable<ContextVariable> {
        return this.http.put<ContextVariable>(environment.apiUrl + '/contextVariable/' + contextVariable.id,
            JSON.stringify(contextVariable), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteContextVariable(id) {
        return this.http.delete<any>(environment.apiUrl + '/contextVariable/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateContextVariable(contextVariable) {
        return this.http.post<any>(environment.apiUrl + '/contextVariable/translate', JSON.stringify(contextVariable),
            this.httpOptions)
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
