/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {ValidationConds} from './validation-cond';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidationCondApiService {

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


  getValidationConds(): Observable<ValidationConds> {
    return this.http.get<ValidationConds>(environment.apiUrl + '/validation_cond', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getValidationCond(id): Observable<ValidationConds> {
    return this.http.get<ValidationConds>(environment.apiUrl + '/validation_cond/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createValidationCond(validationCond): Observable<ValidationConds> {
    return this.http.post<ValidationConds>(environment.apiUrl + '/validation_cond', JSON.stringify(validationCond), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateValidationCond(validationCond): Observable<ValidationConds> {
    return this.http.put<ValidationConds>(environment.apiUrl + '/validation_cond/' +
      validationCond.id, JSON.stringify(validationCond), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteValidationCond(id) {
    return this.http.delete<ValidationConds>(environment.apiUrl + '/validation_cond/' + id, this.httpOptions)
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
