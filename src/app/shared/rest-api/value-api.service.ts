/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Value} from '../interfaces/value.model';

@Injectable({
  providedIn: 'root'
})
export class ValueApiService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
    })
  };

    updateValue(value): Observable<Value[]> {
        return this.http.put<Value[]>(environment.apiUrl + '/values/' + value.id, JSON.stringify(value), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteValue(id) {
        return this.http.delete<any>(environment.apiUrl + '/values/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateValue(value) {
        return this.http.post<any>(environment.apiUrl + '/values/translate', JSON.stringify(value),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteAllTestData() {
        return this.http.get<any>(environment.apiUrl + '/values/deleteAllTestData', this.httpOptions)
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
