/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Property} from '../shared/interfaces/property.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {PropertyApiService} from '../shared/rest-api/property-api.service';
import {PropUnitTypeApiService} from '../shared/rest-api/prop-unit-type-api.service';

@Component({
    selector: 'app-modal-property',
    templateUrl: './modal-property.component.html',
    styleUrls: ['./modal-property.component.css']
})
export class ModalPropertyComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public property: any = {} as Property;
    public properties: any = [];
    public propertyStates: any = [];
    public propertyValueTypes: any = [];
    public propertyScopes: any = [];
    public entityTypes: any = [];
    public propUnitTypes: any = [];
    public referenceSpecificProperty: boolean;
    public possibleFKProperties: any = [];
    public possibleFKEntityTypes: any = [];
    public selectedEntTypeIsHasMany: any = [];
    public selectedEntTypeAlreadyHasPartOfProperty;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restEntityTypeApi: EnttypeApiService,
        private restPropertyApi: PropertyApiService,
        private restPropUnitTypeApi: PropUnitTypeApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
        // If component is opened through the 'edit' button, save the passed property to populate the form's fields
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.property = params;
        }
    }

    loadFormFieldData() {
        this.referenceSpecificProperty = false;
        this.selectedEntTypeIsHasMany = false;
        this.restEntityTypeApi.getEntityTypes().subscribe((data: {}) => {
            this.entityTypes = data;
            this.possibleFKEntityTypes = this.entityTypes;
            this.restPropertyApi.getProperties().subscribe((data2: {}) => {
                this.properties = data2;
                this.restPropUnitTypeApi.getPropUnitTypes().subscribe((data3: {}) => {
                    this.propUnitTypes = data3;
                    if (this.property.id) {
                        this.existingPropertyConfig();
                    }
                });
            });
        });
        this.propertyStates = [
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-STATE.OPTIONS.ACTIVE') , id: 'active'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-STATE.OPTIONS.INACTIVE') , id: 'inactive'}
        ];
        this.propertyScopes = [
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-SCOPE.OPTIONS.ENTITY') , id: 'entity'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-SCOPE.OPTIONS.PROCESS') , id: 'process'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-SCOPE.OPTIONS.GLOBAL') , id: 'global'}
        ];
        this.propertyValueTypes = [
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.TEXT') , id: 'text'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.BOOL') , id: 'bool'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.INT') , id: 'int'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.DOUBLE') , id: 'double'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.ENUM') , id: 'enum'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.DATE') , id: 'date'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.TIME') , id: 'time'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.PROP-REF') , id: 'prop_ref'},
            {name: this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.FILE') , id: 'file'}
        ];
    }

    existingPropertyConfig() {
        this.changeSelectedEntityType(true);
        this.changePossibleFkProperties(true);
    }

    changeSelectedEntityType(existingPropertyConfig = false) {
        if (!existingPropertyConfig) {
            this.property.part_of = false;
        }
        this.selectedEntTypeIsHasMany = false;
        this.possibleFKEntityTypes = this.entityTypes;
        this.selectedEntTypeAlreadyHasPartOfProperty = null;
        // Remove the selected 'entity type' from the possible 'fk entity types' and check if it's a 'has many' ent type
        if (this.property.ent_type_id) {
            this.possibleFKEntityTypes = this.entityTypes.filter(entType => entType.id !== this.property.ent_type_id);
            this.selectedEntTypeIsHasMany = this.entityTypes.find(entType => entType.id === this.property.ent_type_id).has_many;
            this.selectedEntTypeAlreadyHasPartOfProperty = this.properties.find(property => property.id !== this.property.id &&
                property.part_of && property.ent_type_id === this.property.ent_type_id);
        }
        // Check if the selected 'fk entity type' is still an option in the dropdown. In case it isn't, reset the selected entity type
        if (!this.possibleFKEntityTypes.some(possibleFKEntityType => possibleFKEntityType.id === this.property.fk_entity_type_id)) {
            this.property.fk_entity_type_id = null;
            this.referenceSpecificProperty = false;
            this.property.fk_property_id = null;
        }
    }

    changeValueType() {
        this.property.fk_entity_type_id = null;
        this.referenceSpecificProperty = false;
        this.property.fk_property_id = null;
        if (this.property.value_type !== 'text') {
            this.property.requires_translation = false;
        }
        this.property.property_values = this.property.value_type === 'enum' ?
            this.property.property_values = [{id: 0, state: null, value: null}] : null;
    }

    changeReferenceSpecificProperty() {
        if (!this.referenceSpecificProperty) {
            this.property.fk_property_id = null;
        }
    }

    changePossibleFkProperties(existingPropertyConfig = false) {
        this.possibleFKProperties = [];
        if (existingPropertyConfig) {
            this.referenceSpecificProperty = !!this.property.fk_property_id;
        }
        // Get the properties of the selected 'fk entity type' to display in case the user wants to reference a specific property
        if (this.property.fk_entity_type_id) {
            this.possibleFKProperties = this.properties.filter(property => property.ent_type_id === this.property.fk_entity_type_id);
        }
        // Check if the selected 'fk property' is still an option in the dropdown. In case it isn't, reset the selected property
        if (!this.possibleFKProperties.some(possibleFKProperty => possibleFKProperty.id === this.property.fk_property_id)) {
            this.property.fk_property_id = null;
        }
    }

    addPropAllowedValue() {
        this.property.property_values.push({id: 0, state: null , value: null});
    }

    removePropAllowedValue(i: number) {
        if (this.property.property_values.length > 1) {
            this.property.property_values.splice(i, 1);
        }
    }

    // Only allow the user to save the property if the form is correctly filled
    disableSaveButton() {
        if (
            this.property.name &&
            this.property.state &&
            this.property.value_type &&
            this.property.scope &&
            this.property.ent_type_id
        ) {
            // If value_type is 'prop reference', the user has to at least select the 'fk entity type'
            if (this.property.value_type === 'prop_ref') {
                if (this.property.fk_entity_type_id) {
                    // If the 'reference specific property' checkbox is checked, a 'fk property' must be selected
                    return !(this.referenceSpecificProperty && this.property.fk_property_id || !this.referenceSpecificProperty);
                }
                return true;
            } else if (this.property.value_type === 'enum') {
                // If value_type is 'enumerate', the user has to fill all fields in the existing table rows for 'prop allowed values'
                for (const propAllowedValue of this.property.property_values) {
                    for (const key in propAllowedValue) {
                        if (propAllowedValue[key] == null || propAllowedValue[key] === '') {
                            return true;
                        }
                    }
                }
                return false;
            }
            return false;
        }
        return true;
    }

    transformBooleanPropertiesForStorage() {
        this.property.part_of = this.property.part_of ? 1 : 0;
        this.property.requires_translation = this.property.requires_translation ? 1 : 0;
        this.property.editable = this.property.editable ? 1 : 0;
        this.property.soft_delete = this.property.soft_delete ? 1 : 0;
        this.property.is_a = this.property.is_a ? 1 : 0;
        this.property.is_dependent = this.property.is_dependent ? 1 : 0;
        this.property.multiple_values = this.property.multiple_values ? 1 : 0;
    }

    saveData() {
        this.transformBooleanPropertiesForStorage();
        // If property has an id, it means we have opened it through the 'edit' button
        if (this.property.id) {
            this.restPropertyApi.updateProperty(this.property).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('PROPERTY-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('PROPERTY-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROPERTY-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restPropertyApi.createProperty(this.property).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('PROPERTY-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('PROPERTY-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROPERTY-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

}
