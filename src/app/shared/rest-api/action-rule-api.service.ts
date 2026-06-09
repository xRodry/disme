/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {ActionRules} from '../interfaces/action_rule';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ActionRuleApiService {

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


    getActionRules(): Observable<ActionRules> {
        return this.http.get<ActionRules>(environment.apiUrl + '/actionRule', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionRule(id): Observable<ActionRules> {
        return this.http.get<ActionRules>(environment.apiUrl + '/actionRule/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createActionRule(actionRule): Observable<ActionRules> {
        return this.http.post<ActionRules>(environment.apiUrl + '/actionRule', JSON.stringify(actionRule),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateActionRule(actionRule): Observable<ActionRules> {
        return this.http.put<ActionRules>(environment.apiUrl + '/actionRule/' + actionRule.id,
            JSON.stringify(actionRule), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteActionRule(id) {
        return this.http.delete<ActionRules>(environment.apiUrl + '/actionRule/' + id, this.httpOptions)
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
