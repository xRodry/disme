/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Properties} from '../interfaces/property';
import {environment} from 'src/environments/environment';
import {Property} from '../interfaces/property.model';

@Injectable({
    providedIn: 'root'
})
export class PropertyApiService {

    constructor(private http: HttpClient) { }

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


    getProperties(): Observable<Properties> {
        return this.http.get<Properties>(environment.apiUrl + '/properties', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getProperty(id): Observable<Properties> {
        return this.http.get<Properties>(environment.apiUrl + '/properties/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createProperty(property): Observable<Properties> {
        return this.http.post<Properties>(environment.apiUrl + '/properties', JSON.stringify(property), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateProperty(property): Observable<Properties> {
        return this.http.put<Properties>(environment.apiUrl + '/properties/' + property.id, JSON.stringify(property), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteProperty(id) {
        return this.http.delete<any>(environment.apiUrl + '/properties/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateProperty(property): Observable<Properties> {
        return this.http.post<Properties>(environment.apiUrl + '/properties/translate', JSON.stringify(property), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getPropertiesForEntType(entTypeId, entityId): Observable<Property[]> {
        const urlExtension = entityId ? '/properties/getPropertiesForEntType/' + entTypeId + '/' + entityId :
            '/properties/getPropertiesForEntType/' + entTypeId;
        return this.http.get<Property[]>(environment.apiUrl + urlExtension, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getReferencedPropertiesWithCreatedValues(): Observable<Property[]> {
        return this.http.get<Property[]>(environment.apiUrl + '/properties/get_referenced_properties', this.httpOptions)
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
