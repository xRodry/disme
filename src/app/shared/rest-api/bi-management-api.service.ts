/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { TokenVar } from './token';
import { BiElement } from '../interfaces/bi_element.model';
import { BiEngine } from '../interfaces/bi_engine.model';
import { BiKnowage } from '../interfaces/bi_knowage.model';
import { BiElementType } from '../interfaces/bi_element_type.model';
import {environment} from 'src/environments/environment';
import { BiElementCollection } from '../interfaces/bi_element_collection.model';
import { BiWidgetCounter } from '../interfaces/bi_widget_counter.model';

@Injectable({
    providedIn: 'root'
})

export class BiManagementApiService {

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

    // -----------------------------------------
    // ------------- BI Element ----------------

    getAllBiElements(): Observable<BiElement[]> {
        return this.http.get<BiElement[]>(environment.apiUrl + '/biElement', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getBiElement(biElementId): Observable<BiElement> {
        return this.http.get<BiElement>(environment.apiUrl + '/biElement/' + biElementId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeBiElement(biElement): Observable<BiElement> {
        return this.http.post<BiElement>(environment.apiUrl + '/biElement', JSON.stringify(biElement), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateBiElement(biElement): Observable<BiElement> {
        return this.http.put<BiElement>(environment.apiUrl + '/biElement/' + biElement.id,
            JSON.stringify(biElement), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteBiElement(biElementId) {
        return this.http.delete<BiElement>(environment.apiUrl + '/biElement/' + biElementId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // -----------------------------------------
    // ------------- BI Element Type -----------

    getBiElementsTypes(): Observable<BiElementType[]> {
        return this.http.get<BiElementType[]>(environment.apiUrl + '/biElementType', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getBiElementType(biElementTypeId): Observable<BiElementType> {
        return this.http.get<BiElementType>(environment.apiUrl + '/biElementType/' + biElementTypeId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeBiElementType(biElementType): Observable<BiElementType> {
        return this.http.post<BiElementType>(environment.apiUrl + '/biElementType', JSON.stringify(biElementType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateBiElementType(biElementType): Observable<BiElementType> {
        return this.http.put<BiElementType>(environment.apiUrl + '/biElementType/' + biElementType.id,
            JSON.stringify(biElementType), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteBiElementType(biElementTypeId) {
        return this.http.delete<BiElement>(environment.apiUrl + '/biElementType/' + biElementTypeId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // -----------------------------------------
    // ------------- BI Element Collection -----

    getBiUserCollection(): Observable<BiElementCollection[]> {
        return this.http.get<BiElementCollection[]>(environment.apiUrl + '/biElementCollection', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getSpecificBiUserCollection(userId): Observable<BiElement> {
        return this.http.get<BiElement>(environment.apiUrl + '/biElementCollection/' + userId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeBiUserCollection(biElement): Observable<BiElement> {
        return this.http.post<BiElement>(environment.apiUrl + '/biElementCollection',  JSON.stringify(biElement), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteBiUserCollection(biElementId) {
        return this.http.delete<BiElement>(environment.apiUrl + '/biElementCollection' + biElementId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // -----------------------------------------
    // ------------- BI Engine -----------------

    getAllBiEngines(): Observable<BiEngine[]> {
        return this.http.get<BiEngine[]>(environment.apiUrl + '/biEngine', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getBiEngine(biEngineId): Observable<BiEngine> {
        return this.http.get<BiEngine>(environment.apiUrl + '/biEngine/' + biEngineId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getBiEngineWithElements(biEngineId): Observable<BiEngine> {
        return this.http.get<BiEngine>(environment.apiUrl + '/biEngine/getBiEngineBiElements/' + biEngineId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }


    storeBiEngine(biEngine): Observable<BiEngine> {
        return this.http.post<BiEngine>(environment.apiUrl + '/biEngine',
            JSON.stringify(biEngine), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateBiEngine(biEngine): Observable<BiEngine> {
        return this.http.put<BiEngine>(environment.apiUrl + '/biEngine/' + biEngine.id, JSON.stringify(biEngine), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteBiEngine(biEngineId) {
        return this.http.delete<BiEngine>(environment.apiUrl + '/biEngine/' + biEngineId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // -----------------------------------------
    // ------------- BI Knowage -----------------

    getAllBiKnowage(): Observable<BiKnowage[]> {
        return this.http.get<BiKnowage[]>(environment.apiUrl + '/biKnowage', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getBiKnowage(biKnowageId): Observable<BiKnowage> {
        return this.http.get<BiKnowage>(environment.apiUrl + '/biKnowage/' + biKnowageId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    storeBiKnowage(biKnowage): Observable<BiKnowage> {
        return this.http.post<BiKnowage>(environment.apiUrl + '/biKnowage', JSON.stringify(biKnowage), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    updateBiKnowage(biKnowage): Observable<BiKnowage> {
        return this.http.put<BiKnowage>(environment.apiUrl + '/biKnowage/' + biKnowage.id, JSON.stringify(biKnowage), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    deleteBiKnowage(biKnowageId) {
        return this.http.delete<BiKnowage>(environment.apiUrl + '/biKnowage/' + biKnowageId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // -----------------------------------------
    // ------------- BI Widgets -----------------

    getBiWidgetCounts(): Observable<BiWidgetCounter> {
        return this.http.get<BiWidgetCounter>(environment.apiUrl + '/biElement/getBiWidgetCounts', this.httpOptions)
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
