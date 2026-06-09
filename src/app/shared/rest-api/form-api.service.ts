/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenVar} from './token';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Forms} from './form';
import {ActionPropForms} from '../interfaces/action_prop_form';
import {environment} from 'src/environments/environment';
import {Form} from '../interfaces/form.model';

@Injectable({
    providedIn: 'root'
})
export class FormApiService {

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

    // Get all forms
    getForms(): Observable<Form[]> {
        return this.http.get<Form[]>(environment.apiUrl + '/forms', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Get a form through its id
    getForm(id): Observable<Forms> {
        return this.http.get<Forms>(environment.apiUrl + '/forms/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Get the actionPropForms associated with a form
    getActionPropForms(idForm): Observable<ActionPropForms> {
        return this.http.get<ActionPropForms>(environment.apiUrl + '/forms/action_prop_forms_form/' + idForm, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Create a form
    createForm(form): Observable<Forms> {
        return this.http.post<Forms>(environment.apiUrl + '/forms', JSON.stringify(form), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Update a form
    updateForm(form): Observable<Forms> {
        return this.http.put<Forms>(environment.apiUrl + '/forms', JSON.stringify(form), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Delete a form
    deleteForm(id) {
        return this.http.delete<Forms>(environment.apiUrl + '/forms/' + id, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Delete all retired forms
    deleteAllRetiredForms(retiredForms): Observable<Forms> {
        return this.http.post<Forms>(environment.apiUrl + '/forms/delete_all_retired_forms', JSON.stringify(retiredForms), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionPropertiesForFormEditing(actionId) {
        return this.http.get<Forms>(environment.apiUrl + '/forms/get_action_properties_form_editing/' + actionId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionEntityForFormEditing(actionId) {
        return this.http.get<Forms>(environment.apiUrl + '/forms/get_action_entity_form_editing/' + actionId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionPropertiesForFormRendering(actionId, entityId = null) {
        const route = entityId ?
            '/forms/get_action_properties_form_rendering/' + actionId + '/' + entityId :
            '/forms/get_action_properties_form_rendering/' + actionId;
        return this.http.get<Forms>(environment.apiUrl + route, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getActionPropertiesForFormTranslation(actionId, originalFormLanguageId) {
        return this.http.get<Forms>(environment.apiUrl + '/forms/get_action_properties_form_translation/' + actionId +
            '/' + originalFormLanguageId, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Get forms that are suitable for translation
    getFormsToTranslate() {
        return this.http.get<Forms>(environment.apiUrl + '/formsToTranslate', this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Get the data from the form to be translated
    getFormToTranslate(idForm, idLang) {
        return this.http.get<Forms>(environment.apiUrl + '/formToTranslate/' + idForm + '/' + idLang, this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    // Create a form after it has been translated
    createTranslatedForm(form): Observable<Forms> {
        return this.http.post<Forms>(environment.apiUrl + '/forms/create_translated_form', JSON.stringify(form), this.httpOptions)
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
