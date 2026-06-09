/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormApiService} from '../shared/rest-api/form-api.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ActionPropForm} from '../shared/interfaces/action_prop_form.model';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {FormioUtils} from 'angular-formio';
import {Form} from '../shared/interfaces/form.model';

@Component({
    selector: 'app-modal-form-translator',
    templateUrl: './modal-form-translator.component.html',
    styleUrls: ['./modal-form-translator.component.css']
})

export class ModalFormTranslatorComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public formBeingTranslated: any = {} as Form;
    private newTranslatedForm: any;
    private actionProps: any = [];
    private actionPropForms: ActionPropForm[] = [];
    public oldFormName;

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private formRestApi: FormApiService,
        public router: Router,
        private alertToast: AlertToastService,
        public translate: TranslateService
    ) {}

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.formBeingTranslated = params;
            this.formBeingTranslated.hasTranslatedActionName = this.formBeingTranslated.action_name_user_language ? 1 : 0;
            this.loadFormToTranslate();
        }
    }

    // Get the data from the form to be translated
    loadFormToTranslate() {
        return this.formRestApi.getFormToTranslate(this.formBeingTranslated.id, this.formBeingTranslated.language_id)
            .subscribe((data: {}) => {
            // @ts-ignore
            this.formBeingTranslated.json = data.json;
            // So that the 'form to be translated' form_name will appear only as a placeholder.
            this.oldFormName = this.formBeingTranslated.name;
            this.formBeingTranslated.name = '';
        });
    }

    // Function that performs the translation process itself, loading all the information and translating labels, validations
    // and DB data in order to create the new form
    saveData() {
        this.formRestApi.getActionPropertiesForFormTranslation(this.formBeingTranslated.action_id, this.formBeingTranslated.language_id)
            .subscribe((data: {}) => {
                this.actionProps = data;
                this.translateForm();
                this.saveTranslatedForm();
        });
    }

    closeModal() {
        this.modalRef.hide();
    }

    translateForm() {
        this.createActionPropForms();
        this.newTranslatedForm = JSON.parse(this.formBeingTranslated.json);
        // For each property in the form, translate its name/label, customValidation messages
        // and propertyValues(when prop is 'enum' or 'prop_ref')
        this.updateSinglePropComponents();
        this.updateDataGridComponents();
        // Translate the submit button text
        this.translateSubmitButton();
    }

    createActionPropForms() {
        this.actionPropForms = [];
        // Create an actionPropForm record for each actionProp and add it to the form's data
        for (const actionProp of this.actionProps) {
            if (actionProp.action_prop_id) {
                const newActionPropForm = {} as ActionPropForm;
                newActionPropForm.action_prop_id = actionProp.action_prop_id;
                newActionPropForm.form_id = this.formBeingTranslated.id;
                this.actionPropForms.push(newActionPropForm);
            }
        }
    }

    updateSinglePropComponents() {
        for (const actionProp of this.actionProps) {
            const component = FormioUtils.searchComponents(this.newTranslatedForm.components, {key: actionProp.property_id})[0];
            if (component) {
                this.changePropertyLabel(component, actionProp);
                this.changePropertyCustomValidation(component, actionProp);
                this.changePropertyValues(component, actionProp);
            }
        }
    }

    // Change the label of a given field
    changePropertyLabel(field, actionProp) {
        field.label = actionProp.property_name;
        // Save the type of the field so that we can insert it in the 'action_prop_form' table -> 'form_field_type' field
        const actionPropForm = this.actionPropForms.find(item => item.action_prop_id === actionProp.action_prop_id);
        actionPropForm.form_field_type = field.type;
    }

    // Change the label of a dataGrid, i.e. the ent type name of a dataGrid
    updateDataGridComponents() {
        const dataGridComponents = FormioUtils.searchComponents(this.newTranslatedForm.components, {type: 'datagrid'});
        for (const dataGrid of dataGridComponents) {
            dataGrid.label = this.actionProps.find(actionProp => actionProp.ent_type_id === dataGrid.attributes.entTypeId).ent_type_name;
            dataGrid.addAnother = this.translate.instant('FORMIO.ADD-ANOTHER-BUTTON');
        }
    }

    // Assigns the data to properties of type 'prop_ref' and 'enum'
    changePropertyValues(field, actionProp) {
        if (actionProp.value_type === 'prop_ref' || actionProp.value_type === 'enum') {
            if (field.type === 'radio') {
                field.values = actionProp.possible_values;
            } else if (field.type === 'select') {
                field.data.values = actionProp.possible_values;
            }
        } else if (actionProp.value_type === 'bool') {
            field.values = [
                {label: this.translate.instant('FORMIO.OPTION-TRUE'), value: true},
                {label: this.translate.instant('FORMIO.OPTION-FALSE'), value: false}
            ];
        }
    }

    changePropertyCustomValidation(field, actionProp) {
        const validConditions = actionProp.validation_conditions;

        let customValidation = 'let validations=[],messages=[];\n' +
            'function myFunction(item){if(typeof item==="string"){messages.push(item)}}\n';

        if (validConditions) {
            for (const validation of validConditions) {
                if (!validation.error_text) {
                    validation.error_text = this.getDefaultValidationErrorMessage(validation);
                }
                switch (validation.type) {
                    case 'required':
                        field.validate.required = true;
                        break;
                    case 'isInteger':
                        if (!validation.neg) {
                            customValidation += 'valid = (Number.isInteger(Number(input))) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (!Number.isInteger(Number(input))) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'equalTo':
                        if (!validation.neg) {
                            customValidation += 'valid = (input == ' + validation.param_1 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (input != ' + validation.param_1 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'lessEqual':
                        if (!validation.neg) {
                            customValidation += 'valid = (input <= ' + validation.param_1 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (!(input <= ' + validation.param_1 + ')) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'higherEqual':
                        if (!validation.neg) {
                            customValidation += 'valid = (input >= ' + validation.param_1 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (!(input >= ' + validation.param_1 + ')) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'higherThan':
                        if (!validation.neg) {
                            customValidation += 'valid = (input > ' + validation.param_1 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (!(input > ' + validation.param_1 + ')) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'lessThan':
                        if (!validation.neg) {
                            customValidation += 'valid = (input < ' + validation.param_1 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (!(input < ' + validation.param_1 + ')) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'minLength':
                        if (!validation.neg) {
                            field.validate.minLength = validation.param_1;
                        }
                        break;
                    case 'maxLength':
                        if (!validation.neg) {
                            field.validate.maxLength = validation.param_1;
                        }
                        break;
                    case 'belongsRange':
                        if (!validation.neg) {
                            customValidation += 'valid = (input > ' + validation.param_1 + ' && input < ' + validation.param_2 + ') ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'valid = (!(input > ' + validation.param_1 + ' && input < ' + validation.param_2 + ')) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'minWordLength':
                        if (!validation.neg) {
                            field.validate.minWords = validation.param_1;
                        }
                        break;
                    case 'maxWordLength':
                        if (!validation.neg) {
                            field.validate.maxWords = validation.param_1;
                        }
                        break;
                    case 'hasCharacter':
                        if (!validation.neg) {
                            customValidation += 'let regExpression =/' + validation.param_1 + '/';
                            // Case sensitive flag
                            if (!validation.param_2) {
                                customValidation += 'i';
                            }
                            customValidation += ';\nvalid = (regExpression.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'let regExpression =/' + validation.param_1 + '/';
                            if (!validation.param_2) {
                                customValidation += 'i';
                            }
                            customValidation += ';\nvalid = (!regExpression.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'hasWord':
                        if (!validation.neg) {
                            customValidation += 'let regExpression =/\\b' + validation.param_1 + '\\b/';
                            // Case sensitive flag
                            if (!validation.param_2) {
                                customValidation += 'i';
                            }
                            customValidation += ';\nvalid = (regExpression.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'let regExpression =/\\b' + validation.param_1 + '\\b/';
                            if (!validation.param_2) {
                                customValidation += 'i';
                            }
                            customValidation += ';\nvalid = (!regExpression.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'regExpression':
                        if (!validation.neg) {
                            customValidation += 'let regExpression = ' + validation.param_1 + ';\nvalid = (regExpression.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'let regExpression = ' + validation.param_1 + ';\nvalid = (!regExpression.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'isEmail' :
                        if (!validation.neg) {
                            customValidation += 'let regexEmail = /^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;\nvalid = (regexEmail.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'let regexEmail = /^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;\nvalid = (!regexEmail.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'isURL':
                        if (!validation.neg) {
                            customValidation += 'let regexURL = /^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$/;\nvalid = (regexURL.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        } else {
                            customValidation += 'let regexURL = /^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$/;\nvalid = (!regexURL.test(input)) ? true : \'' + validation.error_text + '\';\n';
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'customValidation':
                        if (!validation.neg) {
                            customValidation += validation.custom_validation;
                            customValidation += 'validations.push(valid);\n';
                        }
                        break;
                    case 'beforeDate':
                        field.enableMaxDateInput = true;
                        field.datePicker = {};
                        if (validation.param_1 === 'CURRENT_DATE') {
                            field.datePicker.maxDate = 'moment()';
                        } else {
                            // TODO try to enforce maxDate, so that calendar blocks dates after that one
                            // component.datePicker.maxDate = 'moment(data[' + validation.param_1 + '])';
                            field.validate.json = {};
                            field.validate.json = this.getJsonLogicDateValidation(validation);
                        }
                        break;
                    case 'afterDate':
                        field.datePicker = {};
                        field.enableMinDateInput = true;
                        if (validation.param_1 === 'CURRENT_DATE') {
                            field.datePicker.minDate = 'moment()';
                        } else {
                            // TODO try to enforce minDate, so that calendar blocks dates before that one
                            field.validate.json = {};
                            field.validate.json = this.getJsonLogicDateValidation(validation);
                        }
                        break;
                    case 'maxChoice':
                        // TODO fix multiple validation message printing when last input is duplicated somewhere in the data array
                        customValidation += 'valid = ((data[' + actionProp.property_id + '].length <= ' + validation.param_1 + ') || ' +
                            '(data[' + actionProp.property_id + '][(data[' + actionProp.property_id + '].length - 1)] != input)) ? true : \''
                            + validation.error_text + '\';\n';
                        customValidation += 'validations.push(valid);\n';
                        break;
                    case 'minChoice':
                        customValidation += 'valid = ((data[' + actionProp.property_id + '].length >= ' + validation.param_1 + ') || ' +
                            '(data[' + actionProp.property_id + '][(data[' + actionProp.property_id + '].length - 1)] != input)) ? true : \''
                            + validation.error_text + '\';\n';
                        customValidation += 'validations.push(valid);\n';
                        break;
                }
            }
        }
        // At the end a for loop is added which goes through all the validations and checks if there are any error messages to be displayed
        customValidation += 'validations.forEach(myFunction),0===messages.length?valid=!0:valid=messages[0];';
        // Adds the validation to the field
        field.validate.custom = customValidation;
    }

    getJsonLogicDateValidation(validationObject) {
        if (validationObject.type === 'afterDate') {
            return {
                if: [
                    {
                        '>': [
                            {
                                var: 'input'
                            },
                            {
                                var: 'data.' + validationObject.param_1
                            }
                        ]
                    },
                    true,
                    validationObject.error_text
                ]
            };
        } else {
            return {
                if: [
                    {
                        '<': [
                            {
                                var: 'input'
                            },
                            {
                                var: 'data.' + validationObject.param_1
                            }
                        ]
                    },
                    true,
                    validationObject.error_text
                ]
            };
        }
    }

    private getDefaultValidationErrorMessage(validation) {
        switch (validation.type) {
            case 'isInteger':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.IS-INTEGER-NEGATION') :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.IS-INTEGER');
            case 'isEmail':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.IS-EMAIL-NEGATION') :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.IS-EMAIL');
            case 'isURL':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.IS-URL-NEGATION') :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.IS-URL');
            case 'equalTo':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.EQUAL-TO-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.EQUAL-TO', {param1: validation.param_1});
            case 'maxWordLength':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.MAX-WORD-LENGTH', {param1: validation.param_1});
            case 'minWordLength':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.MIN-WORD-LENGTH', {param1: validation.param_1});
            case 'lessEqual':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.LESS-EQUAL-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.LESS-EQUAL', {param1: validation.param_1});
            case 'higherEqual':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.HIGHER-EQUAL-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.HIGHER-EQUAL', {param1: validation.param_1});
            case 'higherThan':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.HIGHER-THAN-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.HIGHER-THAN', {param1: validation.param_1});
            case 'lessThan':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.LESS-THAN-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.LESS-THAN', {param1: validation.param_1});
            case 'minLength':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.MIN-LENGTH', {param1: validation.param_1});
            case 'maxLength':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.MAX-LENGTH', {param1: validation.param_1});
            case 'belongsRange':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.BELONGS-RANGE-NEGATION', {param1: validation.param_1, param2: validation.param_2}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.BELONGS-RANGE', {param1: validation.param_1, param2: validation.param_2});
            case 'hasCharacter':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.HAS-CHARACTER-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.HAS-CHARACTER', {param1: validation.param_1});
            case 'hasWord':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.HAS-WORD-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.HAS-WORD', {param1: validation.param_1});
            case 'regExpression':
                return validation.neg ? this.translate.instant('DEFAULT-VALIDATION-ERROR.REG-EXPRESSION-NEGATION', {param1: validation.param_1}) :
                    this.translate.instant('DEFAULT-VALIDATION-ERROR.REG-EXPRESSION', {param1: validation.param_1});
            case 'customValidation':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.CUSTOM-VALIDATION', {param1: validation.custom_validation});
            case 'afterDate':
                if (validation.param_1 !== 'CURRENT_DATE') {
                    const afterProperty = this.actionProps.find(actionProp =>
                        actionProp.property_id === Number(validation.param_1)).property_name;
                    return this.translate.instant('DEFAULT-VALIDATION-ERROR.AFTER-DATE', {param1: afterProperty});
                } else {
                    return null;
                }
            case 'beforeDate':
                if (validation.param_1 !== 'CURRENT_DATE') {
                    const beforeProperty = this.actionProps.find(actionProp =>
                        actionProp.property_id === Number(validation.param_1)).property_name;
                    return this.translate.instant('DEFAULT-VALIDATION-ERROR.BEFORE-DATE', {param1: beforeProperty});
                } else {
                    return null;
                }
            case 'minChoice':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.MIN-CHOICE', {param1: validation.param_1});
            case 'maxChoice':
                return this.translate.instant('DEFAULT-VALIDATION-ERROR.MAX-CHOICE', {param1: validation.param_1});
            default:
                return 'error';
        }
    }

    // Translate the 'submit' text button to the intended language
    translateSubmitButton() {
        const component = FormioUtils.searchComponents(this.newTranslatedForm.components, {key: 'submit'})[0];
        component.label = this.translate.instant('FORMIO.SUBMIT-BUTTON');
    }

    private saveTranslatedForm() {
        this.formBeingTranslated.json = JSON.stringify(this.newTranslatedForm);
        this.formBeingTranslated.actionPropForms = this.actionPropForms;
        // Create the new translated form, storing it in the database
        this.formRestApi.createTranslatedForm(this.formBeingTranslated).subscribe((success: any) => {
            if (success) {
                this.alertToast.showSuccess(this.translate.instant('FORMIO.SAVE-SUCCESS'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('FORMIO.SAVE-ERROR'));
            }
        }, error => {
            this.passEntry.emit('error');
        });
    }
}
