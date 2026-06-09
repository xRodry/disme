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
import {Queries} from '../interfaces/query';
import {environment} from 'src/environments/environment';
import {ActionRuleDraft} from '../interfaces/action_rule_draft.model';

@Injectable({
    providedIn: 'root'
})

export class BlocklyApiService {

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

    getQueries(): Observable<Queries> {
        return this.http.get<Queries>(environment.apiUrl + '/blockly/get_queries', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionRules(): Observable<ActionRules> {
        return this.http.get<ActionRules>(environment.apiUrl + '/blockly/get_action_rules', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionRule(id): Observable<ActionRules> {
        return this.http.get<ActionRules>(environment.apiUrl + '/blockly/get_action_rule/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeActionRule(actionRule): Observable<ActionRules> {
        return this.http.post<ActionRules>(environment.apiUrl + '/blockly/store_action_rule', JSON.stringify(actionRule), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteActionRule(actionRuleId): Observable<ActionRules> {
        return this.http.delete<ActionRules>(environment.apiUrl + '/blockly/delete_action_rule/' + actionRuleId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionRuleDrafts(): Observable<ActionRuleDraft[]> {
        return this.http.get<ActionRuleDraft[]>(environment.apiUrl + '/actionRuleDraft', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionRuleDraft(id): Observable<ActionRuleDraft> {
        return this.http.get<ActionRuleDraft>(environment.apiUrl + '/actionRuleDraft/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeActionRuleDraft(actionRuleDraft): Observable<ActionRuleDraft> {
        return this.http.post<ActionRuleDraft>(environment.apiUrl + '/actionRuleDraft', JSON.stringify(actionRuleDraft), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateActionRuleDraft(actionRuleDraft): Observable<ActionRuleDraft> {
        return this.http.put<ActionRuleDraft>(environment.apiUrl + '/actionRuleDraft/' + actionRuleDraft.id,
            JSON.stringify(actionRuleDraft), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteActionRuleDraft(actionRuleDraftId): Observable<ActionRuleDraft> {
        return this.http.delete<ActionRuleDraft>(environment.apiUrl + '/actionRuleDraft/' + actionRuleDraftId, this.httpOptions)
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
