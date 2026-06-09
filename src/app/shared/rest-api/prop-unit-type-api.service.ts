/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {PropUnitTypes} from '../interfaces/prop_unit_type';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PropUnitTypeApiService {

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


    getPropUnitTypes(): Observable<PropUnitTypes> {
        return this.http.get<PropUnitTypes>(environment.apiUrl + '/propUnitType', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getPropUnitType(id): Observable<PropUnitTypes> {
        return this.http.get<PropUnitTypes>(environment.apiUrl + '/propUnitType/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createPropUnitType(propUnitType): Observable<PropUnitTypes> {
        return this.http.post<PropUnitTypes>(environment.apiUrl + '/propUnitType', JSON.stringify(propUnitType),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updatePropUnitType(propUnitType): Observable<PropUnitTypes> {
        return this.http.put<PropUnitTypes>(environment.apiUrl + '/propUnitType/' + propUnitType.id,
            JSON.stringify(propUnitType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deletePropUnitType(id) {
        return this.http.delete<PropUnitTypes>(environment.apiUrl + '/propUnitType/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translatePropUnitType(propUnitType): Observable<PropUnitTypes> {
        return this.http.post<PropUnitTypes>(environment.apiUrl + '/propUnitType/translate',
            JSON.stringify(propUnitType), this.httpOptions)
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
