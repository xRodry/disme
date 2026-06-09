/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import { throwError } from 'rxjs';
import {Users} from '../interfaces/user';
import {TokenVar} from './token';
import {environment} from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class UserApiService {

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

    getUsers(): Observable<Users> {
        return this.http.get<Users>(environment.apiUrl + '/users', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUser(id): Observable<Users> {
        return this.http.get<Users>(environment.apiUrl + '/users/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createUserFromParameterization(user): Observable<Users> {
        return this.http.post<Users>(environment.apiUrl + '/users', JSON.stringify(user),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateUser(user): Observable<Users> {
        return this.http.put<Users>(environment.apiUrl + '/users/' + user.id,
            JSON.stringify(user), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteUser(id) {
        return this.http.delete<Users>(environment.apiUrl + '/users/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

  createUser(user): Observable<Users> {
    return this.http.post<Users>(environment.apiUrl + '/signup', JSON.stringify(user), this.httpOptions)
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
