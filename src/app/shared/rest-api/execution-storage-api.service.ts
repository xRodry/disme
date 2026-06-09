/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {ActionLog} from '../interfaces/action_log.model';
import {UserEvaluatedExpressionLog} from '../interfaces/user_evaluated_expression_log.model';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ExecutionStorageApiService {

    constructor(private http: HttpClient) { }

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
        })
    };

    storeActionLog(actionLog): Observable<ActionLog> {
        return this.http.post<ActionLog>(environment.apiUrl + '/executionStorage/store_action_log', JSON.stringify(actionLog),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeFormData(submittedValues): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/executionStorage/store_form_data',  JSON.stringify(submittedValues)
            , this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeFactSpecificationTermAssignExpressionExecution(submittedValues): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/executionStorage/store_fact_specification_ae_data',
            JSON.stringify(submittedValues), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeUserEvaluatedExpressionLog(userEvaluatedExpressionLog): Observable<UserEvaluatedExpressionLog> {
        return this.http.post<UserEvaluatedExpressionLog>(environment.apiUrl + '/executionStorage/store_uee_log',
            JSON.stringify(userEvaluatedExpressionLog), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeActionWithDerivedPropertiesOnly(actionInfo): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/executionStorage/store_derived_properties_only',
            JSON.stringify(actionInfo), this.httpOptions)
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
