/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {FactDiagrams} from '../interfaces/fact_diagram';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FactDiagramApiService {

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


    getFactDiagrams(): Observable<FactDiagrams> {
        return this.http.get<FactDiagrams>(environment.apiUrl + '/factDiagram', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateOrCreateFactDiagram(factDiagram): Observable<FactDiagrams> {
        return this.http.post<FactDiagrams>(environment.apiUrl + '/factDiagram/save', JSON.stringify(factDiagram),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    saveFactDiagramBulk(payload: { entityTypes: any[]; properties: any[] }) {
        return this.http.post<any>(environment.apiUrl + '/factDiagram/bulk-save', payload,
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
