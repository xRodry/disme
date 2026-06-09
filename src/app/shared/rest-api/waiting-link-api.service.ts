/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {WaitingLinks} from '../interfaces/waiting_link';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WaitingLinkApiService {

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


    getWaitingLinks(): Observable<WaitingLinks> {
        return this.http.get<WaitingLinks>(environment.apiUrl + '/waitingLink', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getWaitingLink(id): Observable<WaitingLinks> {
        return this.http.get<WaitingLinks>(environment.apiUrl + '/waitingLink/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createWaitingLink(waitingLink): Observable<WaitingLinks> {
        return this.http.post<WaitingLinks>(environment.apiUrl + '/waitingLink', JSON.stringify(waitingLink),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateWaitingLink(waitingLink): Observable<WaitingLinks> {
        return this.http.put<WaitingLinks>(environment.apiUrl + '/waitingLink/' + waitingLink.id,
            JSON.stringify(waitingLink), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteWaitingLink(id) {
        return this.http.delete<WaitingLinks>(environment.apiUrl + '/waitingLink/' + id, this.httpOptions)
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
