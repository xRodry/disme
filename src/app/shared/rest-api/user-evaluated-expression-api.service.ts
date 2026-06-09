/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {environment} from 'src/environments/environment';
import {UserEvaluatedExpression} from '../interfaces/user_evaluated_expression.model';

@Injectable({
    providedIn: 'root'
})
export class UserEvaluatedExpressionApiService {

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


    getUserEvaluatedExpressions(): Observable<UserEvaluatedExpression[]> {
        return this.http.get<UserEvaluatedExpression[]>(environment.apiUrl + '/userEvaluatedExpression', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUserEvaluatedExpression(id): Observable<UserEvaluatedExpression[]> {
        return this.http.get<UserEvaluatedExpression[]>(environment.apiUrl + '/userEvaluatedExpression/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createUserEvaluatedExpression(userEvaluatedExpression): Observable<UserEvaluatedExpression[]> {
        return this.http.post<UserEvaluatedExpression[]>(environment.apiUrl + '/userEvaluatedExpression',
            JSON.stringify(userEvaluatedExpression), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateUserEvaluatedExpression(userEvaluatedExpression): Observable<UserEvaluatedExpression[]> {
        return this.http.put<UserEvaluatedExpression[]>(environment.apiUrl + '/userEvaluatedExpression/' + userEvaluatedExpression.id,
            JSON.stringify(userEvaluatedExpression), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteUserEvaluatedExpression(id) {
        return this.http.delete<any>(environment.apiUrl + '/userEvaluatedExpression/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateUserEvaluatedExpression(userEvaluatedExpression) {
        return this.http.post<any>(environment.apiUrl + '/userEvaluatedExpression/translate', JSON.stringify(userEvaluatedExpression),
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
