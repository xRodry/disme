/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../shared/interfaces/user.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {UserApiService} from '../shared/rest-api/user-api.service';
import {LanguageApiService} from '../shared/rest-api/language-api.service';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';
import {PropertyApiService} from '../shared/rest-api/property-api.service';
import {loadCurrentValues, buildUserSpecificationForm} from './user-specification-form.function';
import formio_lang from '../../assets/i18n/formio_render.json';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-modal-new-user',
    templateUrl: './modal-new-user.component.html',
    styleUrls: ['./modal-new-user.component.css']
})
export class ModalNewUserComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public user: any = {} as User;
    public languages: any = [];
    public userDetailsEntTypes: any = [];
    public propertiesUserDetailsEntTypes: any = [];

    private userInitialEntityTypeId: number;
    private userInitialEntityId: number;

    public userDetailsSpecification: boolean;
    public changePassword: boolean;
    public userLanguage: string;
    public showForm = false;
    public formUserDetails;
    public formUserDetailsOptions: any = {
        disableAlerts: true,
        i18n: formio_lang
    };
    public formUserDetailsSubmission: any = {
        data: {}
    };

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restUserApi: UserApiService,
        private restLanguageApi: LanguageApiService,
        private restEntityTypeApi: EnttypeApiService,
        private restPropertyApi: PropertyApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed user to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.user = params;
            // Save the user's initial entityType & entity to use in case the entity_type is switched to another one and then switched back
            this.userInitialEntityTypeId = this.user.ent_type_id;
            this.userInitialEntityId = this.user.entity_id;
            // For the 'specify user details' checkbox to come predefined according to the user having user details already defined.
            this.userDetailsSpecification = !!this.user.ent_type_id;
            // If the selected user has an entity attached to them, load the form corresponding to that entity's entity_type.
            if (this.userDetailsSpecification) {
                this.getFormForUserDetails(true);
            }
        }
        this.userLanguage = Token.getTokenLanguage();
    }

    loadFormFieldData() {
        this.restLanguageApi.getLanguages().subscribe((data: {}) => {
            this.languages = data;
        });
        this.restEntityTypeApi.getUserDetailsEntityTypes().subscribe((data: {}) => {
            this.userDetailsEntTypes = data;
            console.log(this.userDetailsEntTypes);
        });
        this.changePassword = false;
    }

    resetPasswordOnFalseCheckbox() {
        if (!this.changePassword) {
            this.user.password = undefined;
            this.user.confirm_password = undefined;
        }
    }

    getFormForUserDetails(initialConfig = false) {
        this.showForm = false;
        // On the initial configuration, don't change the user's entity.
        if (!initialConfig) {
            this.user.entity_id = this.user.ent_type_id === this.userInitialEntityTypeId ? this.userInitialEntityId : null;
        }
        // Get properties for the selected ent_type so that we can render the form containing them
        // If the user has an entity assigned to them, from the selected ent_type, load the property values from that entity
        this.restPropertyApi.getPropertiesForEntType(this.user.ent_type_id, this.user.entity_id).subscribe((data: {}) => {
            this.propertiesUserDetailsEntTypes = data;
            // Get the properties from the selected 'entity type' with flag 'user details'
            const propertiesEntTypeSelected = this.propertiesUserDetailsEntTypes.filter(property =>
                property.ent_type_id === this.user.ent_type_id);
            // Build the form to be displayed to the user for details specification depending on the selected entity type
            this.formUserDetails = buildUserSpecificationForm(propertiesEntTypeSelected, this.translate);
            // Load the form's current property values, in case the user had them specified previously
            this.formUserDetailsSubmission = loadCurrentValues(propertiesEntTypeSelected, this.formUserDetails);
            this.showForm = true;
        });
    }

    disableSaveButton() {
        if (this.user.name && this.user.email && this.user.user_name && this.user.language_id) {
            // Disable 'save' button if user is setting/changing password and passwords don't match
            if ((!this.user.id || this.changePassword) && !(this.user.password && this.user.password === this.user.confirm_password)) {
                    return true;
            }
            // When the checkbox for user details specification is checked
            if (this.userDetailsSpecification) {
                // Disable 'save' button if an ent_type hasn't been chosen
                if (!this.user.ent_type_id) {
                    return true;
                }
                for (const property of this.propertiesUserDetailsEntTypes) {
                    // Disable 'save' button if a property is unfilled. In case it's a 'multiple values' property,
                    // its value is saved on an array, so disable if the array is empty (length 0) or has an empty element ('')
                    const propertyValue = this.formUserDetailsSubmission.data[property.id];
                    if (!propertyValue || (propertyValue instanceof Array && (!propertyValue.length ||
                        propertyValue.some(item => item === '')))) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return true;
        }
    }

    saveData() {
        if (!this.userDetailsSpecification) {
            this.user.user_details = null;
        } else {
            this.user.user_details = this.formUserDetailsSubmission.data;
        }
        // If user has an id, it means we have opened it through the 'edit' button
        if (this.user.id) {
            this.restUserApi.updateUser(this.user).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('USERS-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('USERS-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('USERS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restUserApi.createUserFromParameterization(this.user).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('USERS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('USERS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('USERS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

}
