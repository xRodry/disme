/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Entities} from '../interfaces/entity';
import {catchError, retry} from 'rxjs/operators';
import { TokenVar } from './token';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityApiService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
    })
  };

  getEntities(): Observable<Entities> {
    return this.http.get<Entities>(environment.apiUrl + '/entities', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getEntity(id): Observable<Entities> {
    return this.http.get<Entities>(environment.apiUrl + '/entities/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createEntity(entity): Observable<Entities> {
    return this.http.post<Entities>(environment.apiUrl + '/entities', JSON.stringify(entity), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateEntity(entity): Observable<Entities> {
    return this.http.put<Entities>(environment.apiUrl + '/entities/' + entity.id, JSON.stringify(entity), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteEntity(id) {
    return this.http.delete<Entities>(environment.apiUrl + '/entities/' + id, this.httpOptions)
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
