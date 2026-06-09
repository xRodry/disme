/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {FormApiService} from '../shared/rest-api/form-api.service';
import {TranslateService} from '@ngx-translate/core';
import formio_lang from 'src/assets/i18n/formio_render.json';
import flatpickr from 'flatpickr';

import flatpickrLang from 'flatpickr/dist/l10n';
import {FormioUtils} from 'angular-formio';
import {Token} from '../shared/rest-api/token';
import {ExecutionStorageApiService} from '../shared/rest-api/execution-storage-api.service';

@Component({
    selector: 'app-modal-form-dashboard',
    templateUrl: './modal-form-dashboard.component.html',
    styleUrls: ['./modal-form-dashboard.component.css']
})

export class ModalFormDashboardComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public myForm: any = {
        components: []
    };
    public showForm = false;

    private detailingUserId: any = null;

    private formId: any;
    private formDetails: any;
    private actionId: any;
    private transactionId: any;
    private transactionStateId: any;
    private processId: any;
    private selectedEntity: any = null;

    private assignExpressionAction = false;

    public formSubmission: any = {
        data: {}
    };
    public languageAbbrv;
    private success: boolean;

    private actionProps: any = [];

    public options: any = {
        disableAlerts: true,
        i18n: formio_lang
    };

    private selectBoxesOverflowHidden = false;

    constructor(
        private modalRef: BsModalRef,
        private alertToast: AlertToastService,
        public restFormApi: FormApiService,
        public executionStorageApi: ExecutionStorageApiService,
        public translate: TranslateService
    ) {}

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        flatpickr.localize(flatpickrLang[this.languageAbbrv]);
        this.renderDynamicForm();
    }

    renderDynamicForm() {
        this.myForm = JSON.parse(this.formDetails.json);
        this.fillFormWithCurrentValues(this.formDetails.action_id);
    }

    onSubmit(event) {
        // Construct data to be passed to server side to store form submission data
        const submittedValues = {
            submittedValues: this.getTransformSubmittedValues(event.data),
            transactionId: this.transactionId,
            transactionStateId: this.transactionStateId,
            processId: this.processId,
            actionId: this.actionId,
            formId: this.formId,
            entityId: this.selectedEntity,
            detailingUserId: this.detailingUserId
        };
        if (this.assignExpressionAction) {
            this.storeAssignExpressionExecution(submittedValues);
        } else {
            this.storeFormData(submittedValues);
        }
    }

    storeAssignExpressionExecution(submittedValues) {
        return this.executionStorageApi.storeFactSpecificationTermAssignExpressionExecution(submittedValues).subscribe((data: {}) => {
            if (data) {
                if (typeof data === 'object') {
                    this.alertValidationErrors(data);
                } else {
                    this.alertToast.showSuccess(this.translate.instant('FORM-RENDER.DATA-SAVED-SUCCESS'));
                    this.passBack();
                }
            } else {
                this.alertToast.showError(this.translate.instant('FORM-RENDER.DATA-SAVED-ERROR'));
            }
        });
    }

    storeFormData(submittedValues) {
        return this.executionStorageApi.storeFormData(submittedValues).subscribe((data: {}) => {
            if (data) {
                if (typeof data === 'object') {
                    this.alertValidationErrors(data);
                } else {
                    this.alertToast.showSuccess(this.translate.instant('FORM-RENDER.DATA-SAVED-SUCCESS'));
                    this.passBack();
                }
            } else {
                this.alertToast.showError(this.translate.instant('FORM-RENDER.DATA-SAVED-ERROR'));
            }
        });
    }

    getTransformSubmittedValues(submittedData) {
        // Delete the "['submit', true]" entry in the submission data, which corresponds to the submission button
        delete submittedData.submit;
        // Transform the returned object's own enumerable string-keyed property key-value pairs
        submittedData = Object.entries(submittedData);
        // Transforms the date submitted values into the format that we want to save: "yyyy-mm-dd", except when the date has a time
        this.transformDateSubmittedValues(submittedData);
        return submittedData;
    }

    transformDateSubmittedValues(submittedData) {
        // When it's a 'day' field or a 'datetime' field with the time disabled, transform into the format 'yyyy-mm-dd'
        // When it's a 'datetime' field with time enabled, leave it in its normal format of 'yyyy-mm-ddThh:mm:ss+01:00'
        for (const submittedValue of submittedData) {
            if (submittedValue[0].includes('entType')) {
                // If it's a hasManyEntType, represented by a dataGrid in the form, transform all rows of the dataGrid
                // containing dates
                this.transformDateValuesInDataGrids(submittedValue);
            } else if (!submittedValue[0].includes('entitySpecification')) {
                // As entitySpecification fields are only select boxes, no need to check if it's a date field
                // If it's a "normal" field, transform dateFields if necessary
                submittedValue[1] = this.transformDateValue(submittedValue[0], submittedValue[1]);
            }
        }
        return submittedData;
    }

    transformDateValuesInDataGrids(submittedValue) {
        // Each row represents an entity (agglomerate of the entType's properties' values)
        for (const entTypeRow of submittedValue[1]) {
            // In each row, we have, for example: {prop1Id: value1, prop2Id: value2}. Scan each property in the row
            // and transform dateFields if necessary
            for (const entTypePropertyId in entTypeRow) {
                if (entTypeRow.hasOwnProperty(entTypePropertyId)) {
                    entTypeRow[entTypePropertyId] = this.transformDateValue(entTypePropertyId, entTypeRow[entTypePropertyId]);
                }
            }
        }
    }

    transformDateValue(fieldKey, submittedValue) {
        // Can be a single field or a field with the flag 'multiple'
        let formattedDate: string | string[];
        // Get the form component which contains the fieldKey (propertyId)
        const field = FormioUtils.searchComponents(this.myForm.components, {key: Number(fieldKey)})[0];
        // Check if the field is a 'datetime' field without the 'time' input or if it's a 'day' field
        if ((field.type === 'datetime' && field.enableTime === false) || field.type === 'day') {
            // If the field has multiple values assigned, means it's a multipleValues property
            if (Array.isArray(submittedValue)) {
                formattedDate = [];
                // In this case, transform every date propertyValue found
                for (const singleValue of submittedValue) {
                    formattedDate.push(new Date(singleValue).toLocaleDateString('zh-Hans-CN'));
                }
            } else {
                // If it's not a multipleValues property, transform the single value assigned
                formattedDate = new Date(submittedValue).toLocaleDateString('zh-Hans-CN');
            }
        }
        // If there have been formattedDate(s): return it/them, if not: return the normal fieldValue(s)
        return formattedDate ? formattedDate : submittedValue;
    }

    // To alert server-side validations that failed
    alertValidationErrors(data) {
        for (const actionProp in data) {
            if (data.hasOwnProperty(actionProp)) {
                // Presents 1 notification per property failed, even if it has several validation conditions failed
                let errorMessage = '';
                for (const error in data[actionProp]) {
                    if (data[actionProp].hasOwnProperty(error)) {
                        errorMessage += data[actionProp][error] + ' ';
                    }
                }
                this.alertToast.showError(errorMessage);
            }
        }
    }

    closeModal() {
        this.success = false;
        this.passEntry.emit(this.success);
        this.modalRef.hide();
    }

    passBack() {
        this.success = true;
        this.passEntry.emit(this.success);
        this.modalRef.hide();
    }

    // Insert current values if applicable
    fillFormWithCurrentValues(actionId) {
        this.restFormApi.getActionPropertiesForFormRendering(actionId, this.selectedEntity).subscribe((data: {}) => {
            this.actionProps = data;
            // Load each property's previous values if applicable
            this.fillSinglePropertiesWithCurrentValues();
            // Load dataGrids properties' previous values if applicable
            this.fillDataGridComponentsWithCurrentValues();
            console.log('Form Submission on Initialization', this.formSubmission);
            // Show the form to the user once all fields have been loaded with their current values, if applicable.
            this.showForm = true;
            this.alertToast.showSuccess(this.translate.instant('FORM-RENDER.OPERATION-SUCCESS'));
        }, error => {
            this.alertToast.showError(this.translate.instant('FORM-RENDER.OPERATION-ERROR'));
        });
    }



    // Apply the CSS style to hide the 'description' of selected options in 'select boxes'
    applyOverflowHiddenToSelects() {
        if (!this.selectBoxesOverflowHidden) {
            // Select all elements with class '.form-control.ui.fluid.selection.dropdown' within the form [where the selected option is]
            const selectElements = document.querySelectorAll('.form-control.ui.fluid.selection.dropdown');
            // Loop through each select element and apply the overflow hidden style
            selectElements.forEach((element) => {
                (element as HTMLElement).style.overflow = 'hidden';
            });
            this.selectBoxesOverflowHidden = true;
        }
    }

    fillSinglePropertiesWithCurrentValues() {
        for (const actionProp of this.actionProps) {
            // In case it's form an 'edit entity instance' action, pre-fill with current value(s)
            // Properties inside dataGrids (ent types has many) are treated separately
            if (!actionProp.ent_type_has_many && actionProp.current_value) {
                const component = FormioUtils.searchComponents(this.myForm.components, {key: actionProp.property_id})[0];
                if (component) { this.preFillWithCurrentValues(component, actionProp); }
            }
        }
    }

    preFillWithCurrentValues(component, actionProp) {
        let componentValue = null;
        if (actionProp.value_type === 'bool') {
            // Transform the boolean property's DB value (1 or 0) into formio's expected format (true/false)
            componentValue = Boolean(Number(actionProp.current_value)) || String(actionProp.current_value).toLowerCase() === 'true';
        } else if (component.type === 'datetime' || component.type === 'day') {
            // When it's a date field, transform the saved date into the field's format.
            componentValue = this.transformCurrentValueForDateField(component, actionProp.current_value);
        } else {
            componentValue = actionProp.current_value;
        }
        this.formSubmission.data[actionProp.property_id] = componentValue;
        component.useLocaleSettings = false;
    }

    transformCurrentValueForDateField(component, currentValue) {
        if (currentValue instanceof Array) {
            // When it's a date field with property flag 'multiple values',
            return this.transformMultipleValueForDateField(component, currentValue);
        } else {
            return this.transformSingleValueForDateField(component, currentValue);
        }
    }

    transformSingleValueForDateField(component, dateValue) {
        // When it's a date field, transform the saved date into the field's format.
        // Ex: Date firstly saved as a timestamp, but now the field is a 'day' field, so we want 'mm-dd-yyyy'.
        if (component.type === 'datetime') {
            return new Date(dateValue);
        } else if (component.type === 'day') {
            return new Date(dateValue).toLocaleDateString('en-US');
        }
        return dateValue;
    }

    transformMultipleValueForDateField(component, multipleDateValues) {
        // When it's a date field with property flag 'multiple values', transform the saved dates into the field's format.
        // Ex: Dates firstly saved as day ['11-25-2022', '12-25-2022'] but the field's type is a timestamp in this form.
        const transformedDates = [];
        for (const dateValue of multipleDateValues) {
            transformedDates.push(this.transformSingleValueForDateField(component, dateValue));
        }
        return transformedDates;
    }

    fillDataGridComponentsWithCurrentValues() {
        // Get all dataGrid components present in the form
        const dataGridComponents = FormioUtils.searchComponents(this.myForm.components, {type: 'datagrid'});
        for (const dataGrid of dataGridComponents) {
            // On editing forms, disable the option to add/remove rows from the dataGrid
            dataGrid.disableAddingRemovingRows = !!this.selectedEntity;
            // Add current values to the submission array so that they are loaded in the form. The format needs to be as follows:
            // Form Submission: 'entType16: [{34: 'GPS', 35:['Red', 'Green']}, {...}]
            this.preFillDataGridWithCurrentValues(dataGrid);
        }
    }

    preFillDataGridWithCurrentValues(dataGrid) {
        const propertyValuesGroupedByEntity = this.groupPropertyValuesByEntity(dataGrid);
        this.formSubmission.data[dataGrid.key] = [];
        for (const entity of propertyValuesGroupedByEntity) {
            this.formSubmission.data[dataGrid.key].push(entity);
        }
    }

    groupPropertyValuesByEntity(dataGrid) {
        // Get the  actionProps that are in this dataGrid
        const dataGridActionProps = this.actionProps.filter(actionProp => actionProp.ent_type_id === dataGrid.attributes.entTypeId);
        // Form Submission for dataGrids has the format: 'entType16: [{34: 'GPS', 35:['Red', 'Green']}, {...}]
        const groupedByEntities = [];
        // Group the different properties' values by entity, so that we have something like
        // ['entityId': {propertyId: value, property2Id: value2}, 'entity2Id': {propertyId: value, property2Id: value2}]
        for (const actionProp of dataGridActionProps) {
            if (actionProp.current_value) {
                const component = FormioUtils.searchComponents(this.myForm.components, {key: actionProp.property_id})[0];
                for (const currentValue of actionProp.current_value) {
                    if (currentValue.value) {
                        // Transform stored values for date fields if necessary [ex: saved as type 'day' but current form has 'datetime']
                        const valueForField = component.type === 'datetime' || component.type === 'day' ?
                            this.transformCurrentValueForDateField(component, currentValue.value) : currentValue.value;
                        if (!groupedByEntities[currentValue.entity_id]) {
                            groupedByEntities[currentValue.entity_id] = {};
                            groupedByEntities[currentValue.entity_id].entity_id = currentValue.entity_id;
                        }
                        if (!groupedByEntities[currentValue.entity_id][actionProp.property_id]) {
                            groupedByEntities[currentValue.entity_id][actionProp.property_id] = actionProp.multiple_values ?
                                [valueForField] : valueForField;
                        } else {
                            groupedByEntities[currentValue.entity_id][actionProp.property_id].push(valueForField);
                        }
                    }
                }
            }
        }
        // Return array that groups values by entities & removes null elements
        // [null elements are due to the index being the entity id -> not sequential index]
        return groupedByEntities.filter(element => element);
    }
}
