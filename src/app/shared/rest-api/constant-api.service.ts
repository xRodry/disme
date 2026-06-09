/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {environment} from 'src/environments/environment';
import {ConstantDB} from '../interfaces/constant.model';

@Injectable({
    providedIn: 'root'
})
export class ConstantApiService {

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


    getConstants(): Observable<ConstantDB[]> {
        return this.http.get<ConstantDB[]>(environment.apiUrl + '/constant', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getConstant(id): Observable<ConstantDB[]> {
        return this.http.get<ConstantDB[]>(environment.apiUrl + '/constant/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createConstant(constant): Observable<ConstantDB[]> {
        return this.http.post<ConstantDB[]>(environment.apiUrl + '/constant', JSON.stringify(constant), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateConstant(constant): Observable<ConstantDB[]> {
        return this.http.put<ConstantDB[]>(environment.apiUrl + '/constant/' + constant.id, JSON.stringify(constant), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteConstant(id) {
        return this.http.delete<any>(environment.apiUrl + '/constant/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateConstant(constant) {
        return this.http.post<any>(environment.apiUrl + '/constant/translate', JSON.stringify(constant),
            this.httpOptions)
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
