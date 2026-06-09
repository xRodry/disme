/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ProcessTypes} from '../interfaces/processtype';
import {ProcessTypeStates} from '../interfaces/processtypestate';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import {environment} from 'src/environments/environment';
import {Query} from '../interfaces/query.model';

@Injectable({
    providedIn: 'root'
})
export class ProcessTypeApiService {

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


    getProcessTypes(): Observable<ProcessTypes> {
        return this.http.get<ProcessTypes>(environment.apiUrl + '/processtypes', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getProcessTypeStates(): Observable<ProcessTypeStates> {
        return this.http.get<ProcessTypeStates>(environment.apiUrl + '/processtypestates', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getProcessType(id): Observable<ProcessTypes> {
        return this.http.get<ProcessTypes>(environment.apiUrl + '/processtypes/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createProcessType(processType): Observable<ProcessTypes> {
        return this.http.post<ProcessTypes>(environment.apiUrl + '/processtypes', JSON.stringify(processType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateProcessType(processType): Observable<ProcessTypes> {
        return this.http.put<ProcessTypes>(environment.apiUrl + '/processtypes/' + processType.id, JSON.stringify(processType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteProcessType(id) {
        return this.http.delete<ProcessTypes>(environment.apiUrl + '/processtypes/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateProcessType(processType): Observable<ProcessTypes> {
        return this.http.post<ProcessTypes>(environment.apiUrl + '/processtypes/translate',
            JSON.stringify(processType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getQueriesOfProcessType(processTypeId) {
        return this.http.get<Query[]>(environment.apiUrl + '/processtypes/getQueriesOfProcessType/' + processTypeId, this.httpOptions)
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
