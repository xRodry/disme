/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {CausalLinks} from '../interfaces/causal_link';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CausalLinkApiService {

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


    getCausalLinks(): Observable<CausalLinks> {
        return this.http.get<CausalLinks>(environment.apiUrl + '/causalLink', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getCausalLink(id): Observable<CausalLinks> {
        return this.http.get<CausalLinks>(environment.apiUrl + '/causalLink/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createCausalLink(causalLink): Observable<CausalLinks> {
        return this.http.post<CausalLinks>(environment.apiUrl + '/causalLink', JSON.stringify(causalLink),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateCausalLink(causalLink): Observable<CausalLinks> {
        return this.http.put<CausalLinks>(environment.apiUrl + '/causalLink/' + causalLink.id,
            JSON.stringify(causalLink), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteCausalLink(id) {
        return this.http.delete<CausalLinks>(environment.apiUrl + '/causalLink/' + id, this.httpOptions)
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
