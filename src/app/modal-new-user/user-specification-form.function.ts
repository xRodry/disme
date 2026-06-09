/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {FormioUtils} from 'angular-formio';

export function buildUserSpecificationForm(properties, translationService) {
    const myForm = {
        components: []
    };
    // Insert a Banner to include all the form's properties inside it
    myForm.components.push(createBannerComponent());
    // Insert all property fields in the form
    for (const property of properties) {
        myForm.components[0].components.push(createField(property, getFieldType(property), translationService));
    }
    return myForm;
}

function createBannerComponent() {
    return { title: '', theme: 'primary', type: 'panel', label: 'Panel', key: 'panel',
        labelPosition: 'top', components: [] };
}

function getFieldType(property) {
    switch (property.value_type) {
        case 'text':
            return 'textfield';
        case 'enum':
        case 'prop_ref':
            return 'select';
        case 'int':
        case 'double':
            return 'number';
        case 'date':
            return 'datetime';
        case 'time':
            return 'time';
        case 'file':
            return 'file';
        case 'bool':
            return 'radio';
        default:
            return null;
    }
}

// Create each of the possible fields, according to the information from the DB
function createField(property, fieldType, translationService) {
    const component: any = {};
    const propertyID = property.id;
    const propertyName = property.name;
    const valueTypeDB = property.value_type;
    component.label = propertyName;
    component.attributes = {};
    component.key = propertyID;
    component.attributes.propertyID = propertyID;

    component.type = fieldType;
    component.input = true;
    component.multiple = !!property.multiple_values;

    // If it's a select/radio field, load the corresponding possible values
    if (fieldType === 'select') {

        component.widget = 'choicesJS';
        component.data = {};
        component.data.values = [];
        component.data.values = property.property_values;

    } else if (fieldType === 'radio') {

        component.values = [];
        if (valueTypeDB === 'prop_ref' || valueTypeDB === 'enum') {
            component.values = property.property_values;
        } else if (valueTypeDB === 'bool') {
            component.values = [
                {label: translationService.instant('FORMIO.OPTION-TRUE'), value: true},
                {label: translationService.instant('FORMIO.OPTION-FALSE'), value: false}
            ];
        }

    }
    return component;
}

export function loadCurrentValues(properties, myForm) {
    const formSubmission = {
        data: {}
    };
    for (const property of properties) {
        const component = FormioUtils.searchComponents(myForm.components, {key: property.id})[0];
        // In case it's for a user who has had the details previously inserted, pre-fill with current value(s)
        if (component) {
            if (property.current_value) {
                formSubmission.data[property.id] = component.type === 'datetime' || component.type === 'day' ?
                    transformCurrentValueForDateField(component.type, property.current_value) : property.current_value;
                if (!property.editable) {
                    component.disabled = true;
                }
            }
            component.useLocaleSettings = true;
        }
    }
    return formSubmission;
}

function transformCurrentValueForDateField(componentType, currentValue) {
    if (currentValue instanceof Array) {
        // When it's a date field with property flag 'multiple values',
        return transformMultipleValueForDateField(componentType, currentValue);
    } else {
        return transformSingleValueForDateField(componentType, currentValue);
    }
}

function transformMultipleValueForDateField(componentType, multipleDateValues) {
    // When it's a date field with property flag 'multiple values', transform the saved dates into the field's format.
    // Ex: Dates firstly saved as day ['11-25-2022', '12-25-2022'] but the field's type is a timestamp in this form.
    const transformedDates = [];
    for (const dateValue of multipleDateValues) {
        transformedDates.push(this.transformSingleValueForDateField(componentType, dateValue));
    }
    return transformedDates;
}

function transformSingleValueForDateField(componentType, dateValue) {
    // When it's a date field, transform the saved date into the field's format.
    // Ex: Date firstly saved as day [11-25-2022] but we want a timestamp, as the field's type is a timestamp in this form.
    if (componentType === 'datetime') {
        return new Date(dateValue);
    } else if (componentType === 'day') {
        return new Date(dateValue).toLocaleDateString();
    }
}
