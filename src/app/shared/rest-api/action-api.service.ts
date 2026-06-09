/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {Actions} from './action';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Action} from '../interfaces/action.model';

@Injectable({
  providedIn: 'root'
})
export class ActionApiService {

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


  getActions(): Observable<Actions> {
    return this.http.get<Actions>(environment.apiUrl + '/actions', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

    getActionsWithFormFacts(deletedActionRule): Observable<Action[]> {
        return this.http.get<Action[]>(environment.apiUrl + '/actions/getActionsWithFormFacts/' + deletedActionRule, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

  getAction(id): Observable<Actions> {
    return this.http.get<Actions>(environment.apiUrl + '/actions/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createAction(property): Observable<Actions> {
    return this.http.post<Actions>(environment.apiUrl + '/actions', JSON.stringify(property), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateAction(property): Observable<Actions> {
    return this.http.put<Actions>(environment.apiUrl + '/actions/' + property.id, JSON.stringify(property), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteAction(id) {
    return this.http.delete<Actions>(environment.apiUrl + '/actions/' + id, this.httpOptions)
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
