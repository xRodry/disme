/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {Roles} from '../interfaces/role';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoleApiService {

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


    getRoles(): Observable<Roles> {
        return this.http.get<Roles>(environment.apiUrl + '/roles', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getRole(id): Observable<Roles> {
        return this.http.get<Roles>(environment.apiUrl + '/roles/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createRole(role): Observable<Roles> {
        return this.http.post<Roles>(environment.apiUrl + '/roles', JSON.stringify(role),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateRole(role): Observable<Roles> {
        return this.http.put<Roles>(environment.apiUrl + '/roles/' + role.id,
            JSON.stringify(role), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteRole(id) {
        return this.http.delete<Roles>(environment.apiUrl + '/roles/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateRole(role): Observable<Roles> {
        return this.http.post<Roles>(environment.apiUrl + '/roles/translate', JSON.stringify(role), this.httpOptions)
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
