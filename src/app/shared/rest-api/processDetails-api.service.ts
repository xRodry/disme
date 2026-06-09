/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '../../../../node_modules/@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ProcessesDetails} from '../interfaces/processDetails';
import {catchError, retry} from 'rxjs/operators';
import {TokenVar} from './token';
import { ProcessTypes } from '../interfaces/processtype';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProcessDetailsApiService {

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


    getProcessesDetails(): Observable<ProcessesDetails> {
        return this.http.get<ProcessesDetails>(environment.apiUrl + '/processDetails', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getProcessDetail(processTypeId, propertyId): Observable<ProcessesDetails> {
        return this.http.get<ProcessesDetails>(environment.apiUrl + '/processDetails/' + processTypeId + '/' + propertyId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createProcessDetail(processDetails): Observable<ProcessesDetails> {
        return this.http.post<ProcessesDetails>(environment.apiUrl + '/processDetails', JSON.stringify(processDetails), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateProcessDetail(processDetails, previousPropertyId): Observable<ProcessesDetails> {
        processDetails.previous_property_id = previousPropertyId;
        return this.http.put<ProcessesDetails>(environment.apiUrl + '/processDetails/' + processDetails.process_type_id + '/' +
            processDetails.property_id, JSON.stringify(processDetails), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteProcessDetail(processTypeId, propertyId) {
        return this.http.delete<ProcessesDetails>(environment.apiUrl + '/processDetails/' + processTypeId +
            '/' + propertyId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getAllPropertiesOfProcessType(processTypeId): Observable<ProcessTypes> {
        return this.http.get<ProcessTypes>(environment.apiUrl + '/processDetails/getPropertiesOfProcessType/' + processTypeId, this.httpOptions)
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
