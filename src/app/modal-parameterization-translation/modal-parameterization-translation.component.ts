/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleApiService} from '../shared/rest-api/role-api.service';
import {ParameterizationTranslation} from '../shared/interfaces/parameterization-translation.model';
import {Token} from '../shared/rest-api/token';
import {ProcessTypeApiService} from '../shared/rest-api/processtype-api.service';
import {TransactionTypeApiService} from '../shared/rest-api/transaction-type-api.service';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';
import {PropertyApiService} from '../shared/rest-api/property-api.service';
import {PropUnitTypeApiService} from '../shared/rest-api/prop-unit-type-api.service';
import {ConstantApiService} from '../shared/rest-api/constant-api.service';
import {ValueApiService} from '../shared/rest-api/value-api.service';

@Component({
    selector: 'app-modal-parameterization-translation',
    templateUrl: './modal-parameterization-translation.component.html',
    styleUrls: ['./modal-parameterization-translation.component.css']
})
export class ModalParameterizationTranslationComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public originItem: any = {};
    public originTableTranslationString: string;
    private userLanguage: string;
    public resultingItem: any = {} as ParameterizationTranslation;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private alertToast: AlertToastService,
        private translate: TranslateService,
        private restRoleApi: RoleApiService,
        private restProcessTypeApi: ProcessTypeApiService,
        private restTransactionTypeApi: TransactionTypeApiService,
        private restEntityTypeApi: EnttypeApiService,
        private restPropertyApi: PropertyApiService,
        private restPropUnitTypeApi: PropUnitTypeApiService,
        private restValueApi: ValueApiService,
        private restConstantApi: ConstantApiService

    ) {}

    ngOnInit() {
        this.userLanguage = Token.getTokenLanguage();
        this.originItem = this.modalService.config.initialState;
        console.log('Origin Item', this.originItem);
        // In case origin item is a property, and it has value_type === 'enum', transform its property_values for translation
        this.transformPropertyValuesFromOriginItem();
        // Transform the camelCase table name in the translation service's string type. Ex: 'transactionType' => 'TRANSACTION-TYPE'
        this.originTableTranslationString = this.originItem.originTable.replace(/[A-Z]/g, tableName => '-' + tableName).toUpperCase();
    }

    transformPropertyValuesFromOriginItem() {
        // In case the user has translated the property's name previously and now only needs to translate
        // some propAllowedValues that weren't translated before: Name field already comes pre-filled
        if (this.originItem.language_abbrv === this.userLanguage) {
            this.resultingItem.name = this.originItem.name;
        }
        // Transform Property Values From Origin Item
        if (this.originItem.originTable === 'property' && this.originItem.property_values) {
            // Initialize resulting item's property values array
            this.resultingItem.property_values = [];
            for (const propertyValue of this.originItem.property_values) {
                // If the property value's language is the same as the user's, then save it with its value as the name to be
                // put onto the text input, as it doesn't need translation
                if (propertyValue.language_abbrv === this.userLanguage) {
                    this.resultingItem.property_values.push({id: propertyValue.id, value: propertyValue.value,
                        placeholder: propertyValue.value});
                } else {
                    // If property value's language is different from the user's, then save it with its value as the placeholder
                    // to be put onto the text input, as it needs translation [user will fill the value field]
                    this.resultingItem.property_values.push({id: propertyValue.id, value: null,
                        placeholder: propertyValue.value});
                }
            }
        }
        // Transform Property Values From Origin Item
        // if (this.originItem.originTable === 'constant' && this.originItem.value_type === 'enum') {
        //     // Initialize resulting item's enumValues array
        //     this.resultingItem.enumValues = [];
        //     this.originItem.enumValues = JSON.parse(this.originItem.value);
        //     for (const constantEnumValue of this.originItem.enumValues) {
        //         // Save it with its value as the placeholder to be put onto the text input, as it needs translation
        //         // [user will fill the value field]
        //         this.resultingItem.enumValues.push({value: null,
        //             placeholder: constantEnumValue.value});
        //     }
        // }
    }

    isSaveButtonDisabled() {
        if (this.originItem.originTable === 'role' || this.originItem.originTable === 'processType' ||
            this.originItem.originTable === 'entityType' || this.originItem.originTable === 'propUnitType') {
                return !this.resultingItem.name;
        } else if (this.originItem.originTable === 'transactionType') {
            return !(this.resultingItem.t_name);
        } else if (this.originItem.originTable === 'property') {
            if (!this.resultingItem.name) {
                return true;
            }
            return this.objectHasUntranslatedEnumValues(this.resultingItem.property_values);
        } else if (this.originItem.originTable === 'referencedPropertyValue') {
            return !this.resultingItem.value;
        } else if (this.originItem.originTable === 'constant') {
            if (!this.resultingItem.name) {
                return true;
            }
            // return this.objectHasUntranslatedEnumValues(this.resultingItem.enumValues);
        }
        return false;
    }

    objectHasUntranslatedEnumValues(originItemEnumValues) {
        if (this.originItem.value_type === 'enum') {
            // If value_type is 'enumerate', the user has to translate all enumerate names
            for (const propAllowedValue of originItemEnumValues) {
                if (propAllowedValue.value == null || propAllowedValue.value === '') {
                    return true;
                }
            }
        }
        return false;
    }

    saveData() {
        this.resultingItem.id = this.originItem.id;
        switch (this.originItem.originTable) {
            case 'role':
                this.translateRole();
                break;
            case 'processType':
                this.translateProcessType();
                break;
            case 'transactionType':
                this.translateTransactionType();
                break;
            case 'entityType':
                this.translateEntityType();
                break;
            case 'property':
                this.translateProperty();
                break;
            case 'propUnitType':
                this.translatePropUnitType();
                break;
            case 'referencedPropertyValue':
                this.translateReferencedPropertyValue();
                break;
            case 'constant':
                // this.resultingItem.value = JSON.stringify(this.resultingItem.enumValues);
                this.translateConstant();
                break;
            default:
                break;
        }
    }

    translateRole() {
        this.restRoleApi.translateRole(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translateProcessType() {
        this.restProcessTypeApi.translateProcessType(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translateTransactionType() {
        this.restTransactionTypeApi.translateTransactionType(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translateEntityType() {
        this.restEntityTypeApi.translateEntityType(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translateProperty() {
        this.restPropertyApi.translateProperty(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translatePropUnitType() {
        this.restPropUnitTypeApi.translatePropUnitType(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translateReferencedPropertyValue() {
        this.restValueApi.translateValue(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    translateConstant() {
        this.restConstantApi.translateConstant(this.resultingItem).subscribe((data: {}) => {
            if (data) {
                this.successfulSave();
            } else {
                this.errorOnSaveData();
            }
        }, error => {
            this.errorOnSaveData();
        });
    }

    successfulSave() {
        this.alertToast.showSuccess(this.translate.instant('MODAL-PARAMETERIZATION-TRANSLATION.' +
            this.originTableTranslationString + '.SUCCESS'));
        this.passEntry.emit('success');
        this.closeModal();
    }

    errorOnSaveData() {
        this.alertToast.showError(this.translate.instant('MODAL-PARAMETERIZATION-TRANSLATION.' +
            this.originTableTranslationString + '.ERROR'));
        this.passEntry.emit('error');
    }

    closeModal() {
        this.modalRef.hide();
    }

}
