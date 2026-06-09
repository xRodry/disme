/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import { RoleHasUsers } from '../interfaces/role_has_user';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoleHasUserApiService {

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


    getRoleHasUsers(): Observable<RoleHasUsers> {
        return this.http.get<RoleHasUsers>(environment.apiUrl + '/roleHasUser', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getRoleHasUser(roleId, userId): Observable<RoleHasUsers> {
        return this.http.get<RoleHasUsers>(environment.apiUrl + '/roleHasUser/' + roleId + '/' +
            userId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createRoleHasUser(roleHasUser): Observable<RoleHasUsers> {
        return this.http.post<RoleHasUsers>(environment.apiUrl + '/roleHasUser', JSON.stringify(roleHasUser),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateRoleHasUser(roleHasUser, previousRoleId): Observable<RoleHasUsers> {
        roleHasUser.previous_role_id = previousRoleId;
        return this.http.put<RoleHasUsers>(environment.apiUrl + '/roleHasUser/' + roleHasUser.role_id +
            '/' + roleHasUser.user_id, JSON.stringify(roleHasUser), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteRoleHasUser(roleId, userId) {
        return this.http.delete<RoleHasUsers>(environment.apiUrl + '/roleHasUser/' + roleId + '/' +
            userId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUsers() {
        return this.http.get<RoleHasUsers>(environment.apiUrl + '/roleHasUser/getUsers', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUserRoles() {
        return this.http.get<RoleHasUsers>(environment.apiUrl + '/roleHasUser/get_user_roles', this.httpOptions)
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
