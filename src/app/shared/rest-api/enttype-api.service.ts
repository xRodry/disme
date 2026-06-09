/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {EntityTypes} from '../interfaces/enttype';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {EntityType} from '../interfaces/enttype.model';
import {EntType} from '../interfaces/ent_type.model';

@Injectable({
    providedIn: 'root'
})
export class EnttypeApiService {

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
        })
    };

    getEntityTypes(): Observable<EntityType[]> {
        return this.http.get<EntityType[]>(environment.apiUrl + '/entitytypes', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getEntityType(id): Observable<EntityTypes> {
        return this.http.get<EntityTypes>(environment.apiUrl + '/entitytypes/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    createEntityType(entityType): Observable<EntityTypes> {
        return this.http.post<EntityTypes>(environment.apiUrl + '/entitytypes', JSON.stringify(entityType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateEntityType(entityType): Observable<EntityTypes> {
        return this.http.put<EntityTypes>(environment.apiUrl + '/entitytypes/' + entityType.id, JSON.stringify(entityType),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteEntityType(id): Observable<EntityTypes> {
        return this.http.delete<EntityTypes>(environment.apiUrl + '/entitytypes/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    translateEntityType(entityType): Observable<EntityTypes> {
        return this.http.post<EntityTypes>(environment.apiUrl + '/entitytypes/translate', JSON.stringify(entityType),
            this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getUserDetailsEntityTypes(): Observable<EntityTypes> {
        return this.http.get<EntityTypes>(environment.apiUrl + '/entitytypes/userDetails', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getEntTypesWithProperties(): Observable<EntType[]> {
        return this.http.get<EntType[]>(environment.apiUrl + '/entitytypes/getEntTypesWithProperties', this.httpOptions)
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
