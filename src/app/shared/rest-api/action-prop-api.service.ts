/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {ActionsProp} from './action-prop';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionPropApiService {

  constructor(private http: HttpClient) { }

  /*========================================
  CRUD Methods for consuming RESTful API
=========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
    })
  };


  getActionsProp(): Observable<ActionsProp> {
    return this.http.get<ActionsProp>(environment.apiUrl + '/actions_prop', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getActionProp(id): Observable<ActionsProp> {
    return this.http.get<ActionsProp>(environment.apiUrl + '/actions_prop/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createActionProp(property): Observable<ActionsProp> {
    return this.http.post<ActionsProp>(environment.apiUrl + '/actions_prop', JSON.stringify(property), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateActionProp(property): Observable<ActionsProp> {
    return this.http.put<ActionsProp>(environment.apiUrl + '/actions_prop/' + property.id, JSON.stringify(property), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteActionProp(id) {
    return this.http.delete<ActionsProp>(environment.apiUrl + '/actions_prop/' + id, this.httpOptions)
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
