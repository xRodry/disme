/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {Delegations} from '../interfaces/delegation';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DelegationsApiService {

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


    getDelegations(): Observable<Delegations> {
        return this.http.get<Delegations>(environment.apiUrl + '/delegation', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getDelegation(delegationId): Observable<Delegations> {
        return this.http.get<Delegations>(environment.apiUrl + '/delegation/' + delegationId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createDelegation(delegation): Observable<Delegations> {
        return this.http.post<Delegations>(environment.apiUrl + '/delegation', JSON.stringify(delegation), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateDelegation(delegation): Observable<Delegations> {
        return this.http.put<Delegations>(environment.apiUrl + '/delegation/' + delegation.id, JSON.stringify(delegation), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteDelegation(delegationId) {
        return this.http.delete<Delegations>(environment.apiUrl + '/delegation/' + delegationId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getTasksToDelegate(): Observable<Delegations> {
        return this.http.get<Delegations>(environment.apiUrl + '/delegation/getTasksToDelegate', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUserRoles(): Observable<Delegations> {
        return this.http.get<Delegations>(environment.apiUrl + '/delegation/getUserRoles', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUsersFromRole(roleId): Observable<Delegations> {
        return this.http.get<Delegations>(environment.apiUrl + '/delegation/getUsersFromRole/' + roleId, this.httpOptions)
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
