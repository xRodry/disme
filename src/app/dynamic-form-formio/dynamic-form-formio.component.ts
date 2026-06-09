/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, OnInit, Renderer2} from '@angular/core';
import {FormApiService} from '../shared/rest-api/form-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import formio_lang from 'src/assets/i18n/formio_builder.json';
import flatpickr from 'flatpickr';
import flatpickrLang from 'flatpickr/dist/l10n';
import {ActionPropForm} from '../shared/interfaces/action_prop_form.model';
import {EnableConditionLog} from '../shared/interfaces/enable_condition_log.model';
import {FormCalculationLog} from '../shared/interfaces/form_calculation_log.model';
import {Form} from '../shared/interfaces/form.model';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-dynamic-form-formio',
    templateUrl: './dynamic-form-formio.component.html',
    styleUrls: ['./dynamic-form-formio.component.css']
})
export class DynamicFormFormioComponent implements OnInit {

    private actionId;
    public formId;
    private formName;

    public myForm: any = {
        components: []
    };

    public options: any = {};
    private ActionProps: any = [];
    private EntTypesHasMany: any = [];
    private actionPropForms: ActionPropForm[] = [];
    private enableConditionLogs: EnableConditionLog[] = [];
    private formCalculationLogs: FormCalculationLog[] = [];

    private isEntitySpecificationAction: false;
    private ActionEntity: any;

    public showFormEditor = false;
    public hiddenForm = false;

    private languageAbbrv;

    constructor(
        public restFormApi: FormApiService,
        private alertToast: AlertToastService,
        public router: Router,
        public route: ActivatedRoute,
        public translate: TranslateService,
        private renderer: Renderer2
    ) {
        this.loadFormInfo();
    }

    ngOnInit() {
        // Define the date picker's language depending on the user's language
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        flatpickr.localize(flatpickrLang[this.languageAbbrv]);
        // Load the current action's entity / properties
        if (this.isEntitySpecificationAction) {
            this.loadEntityForSpecification();
        } else {
            this.loadActionProperties();
        }
    }

    loadFormInfo() {
        // Get action and form info that were passed by the formManagement component
        const navigation  = this.router.getCurrentNavigation();
        this.actionId = navigation.extras.state.action_id;
        this.formId = navigation.extras.state.form_id;
        this.formName = navigation.extras.state.form_name;
        this.isEntitySpecificationAction = navigation.extras.state.isEntitySpecificationAction;
    }

    loadActionProperties() {
        this.restFormApi.getActionPropertiesForFormEditing(this.actionId).subscribe((data: {}) => {
            const tempActionProps: any = data;
            // Group actionProps from entTypes with flag 'hasMany' by their entType.
            // These actionProps will be inserted grouped by their entType. Each entType will correspond to a dataGrid field.
            this.EntTypesHasMany = this.groupByArray(tempActionProps.filter(actionProp => actionProp.ent_type_has_many), 'ent_type_id');
            // The properties from entTypes without flag 'hasMany'. Each one will be inserted as an individual field.
            this.ActionProps = tempActionProps.filter(actionProp => !actionProp.ent_type_has_many);
            // console.log('Ent  Types Has Many', this.EntTypesHasMany);
            // console.log('Action props', this.ActionProps);
            // Creates the form editor
            this.createBuilder();
        });
    }

    loadEntityForSpecification() {
        this.restFormApi.getActionEntityForFormEditing(this.actionId).subscribe((data: {}) => {
            this.ActionEntity = data;
            // console.log('Action Entity', this.ActionEntity);
            // Creates the form editor
            this.createBuilder();
        });
    }

    // Creates the form editor
    createBuilder() {
        // Defines which parts of the form editor shouldn't be shown
        const componentsToHideDisplayTab = [{key: 'cloneRows', ignore: 1}, {key: 'hidden', ignore: 1}, {key: 'mask', ignore: 1},
            {key: 'tableView', ignore: 1}, {key: 'disabled', ignore: 1}, {key: 'showCharCount', ignore: 1},
            {key: 'showWordCount', ignore: 1}, {key: 'tabindex', ignore: 1}, {key: 'editor', ignore: 1},
            {key: 'displayInTimezone', ignore: 1}, {key: 'useLocaleSettings', ignore: 1}, {key: 'defaultOpen', ignore: 1},
            {key: 'conditionalAddButton', ignore: 1}];
        // Defines which tabs of the form editor shouldn't be shown
        const tabDefinitions = [{key: 'display', ignore: 0, components : componentsToHideDisplayTab}, {key: 'validation', ignore: 1},
            {key: 'data', ignore: 1}, {key: 'conditional', ignore: 1}, {key: 'logic', ignore: 1}, {key: 'layout', ignore: 1},
            {key: 'api', ignore: 1}, {key: 'provider', ignore: 1}];
        this.options = {
            builder: {
                basic: false,
                advanced: false,
                data: false,
                premium: false,
                layout: {
                    components: {
                        well: false,
                        fieldset: false,
                        content: false
                    }
                }
            },
            language: this.languageAbbrv,
            i18n: formio_lang,
            editForm: {
                textfield: tabDefinitions,
                textarea: tabDefinitions,
                email: tabDefinitions,
                address: tabDefinitions,
                password: tabDefinitions,
                radio: tabDefinitions,
                select: tabDefinitions,
                number: tabDefinitions,
                currency: tabDefinitions,
                datetime: tabDefinitions,
                day: tabDefinitions,
                time: tabDefinitions,
                file: tabDefinitions,
                columns: tabDefinitions,
                panel: tabDefinitions,
                table: tabDefinitions,
                tabs: tabDefinitions,
                htmlelement: tabDefinitions,
                datagrid: tabDefinitions
            }
        };
        this.loadFormEditor();
    }

    loadFormEditor() {
        if (this.formId) {
            if (this.isEntitySpecificationAction) {
                this.getFormAndInsertInitialBuilderBoxes();
            } else {
                // Get information about the properties that have already been added to the form.
                this.restFormApi.getActionPropForms(this.formId).subscribe((actionPropForms: any) => {
                    this.actionPropForms = actionPropForms;
                    this.getFormAndInsertInitialBuilderBoxes();
                });
            }
        } else {
            this.insertInitialBuilderBoxes();
        }
    }

    getFormAndInsertInitialBuilderBoxes() {
        // Get the form's json, so we can load the already edited form correctly
        this.restFormApi.getForm(this.formId).subscribe((data: any) => {
            this.myForm = JSON.parse(data.json);
            this.insertInitialBuilderBoxes();
        });
    }

    insertInitialBuilderBoxes() {
        if (this.isEntitySpecificationAction) {
            this.insertInitialBuilderBoxActionEntity();
        } else {
            // Add builder boxes for each single property in the form
            this.ActionProps.forEach(actionProp => {
                this.insertInitialBuilderBoxActionProp(actionProp);
            });
            // Add builder boxes for each ent type 'has many' in the form
            this.EntTypesHasMany.forEach(entTypeHasMany => {
                this.insertInitialBuilderBoxEntTypeHasMany(entTypeHasMany);
            });
        }
        // Show form editor
        this.refreshBuilder();
    }

    insertInitialBuilderBoxEntTypeHasMany(hasManyEntType) {
        const actionPropForm = this.actionPropForms.find(item => item.action_prop_id === hasManyEntType[0].action_prop_id);
        // If the entType is already inserted in the form, create a placeholder indicating it's already in use.
        if (actionPropForm) {
            const entTypeId = 'entType' + hasManyEntType[0].ent_type_id;
            // Create the placeholder indicating it's already in the form
            this.options.builder[entTypeId] = {};
            this.options.builder[entTypeId].title = hasManyEntType[0].ent_type_name + ' - (' +
                this.translate.instant('FORMIO.LABEL-TYPE') + ': datagrid)';
            this.options.builder[entTypeId].weight = hasManyEntType[0].order;
        } else {
            // If it's a new entType that hasn't been added to the form yet, add a box with the entType's possible field types.
            this.createDataGridBox(hasManyEntType);
        }
    }

    insertInitialBuilderBoxActionProp(actionProp) {
        const actionPropForm = this.actionPropForms.find(item => item.action_prop_id === actionProp.action_prop_id);
        // If the property is already inserted in the form, create a placeholder indicating it's already in use.
        if (actionPropForm) {
            // Create the placeholder indicating it's already in the form
            this.options.builder[actionProp.property_id] = {};
            this.options.builder[actionProp.property_id].title = actionProp.property_name + ' - (' +
                this.translate.instant('FORMIO.LABEL-TYPE') + ': ' + actionPropForm.form_field_type + ')';
            this.options.builder[actionProp.property_id].weight = actionProp.order;
        } else {
            // If it's a new property that hasn't been added to the form yet, add a box with the property's possible field types.
            this.createPropertyBoxWithFieldTypes(actionProp);
        }
    }

    insertInitialBuilderBoxActionEntity() {
        if (this.formId) {
            // If the form is being edited, as there is only 1 entitySpecification per action, the field has to be already placed
            // in the form, so we create a placeholder indicating it's already in use.
            const entitySpecificationId = 'entitySpecification' + this.ActionEntity.ent_type_id;
            // Create the placeholder indicating it's already in the form
            this.options.builder[entitySpecificationId] = {};
            this.options.builder[entitySpecificationId].title = this.ActionEntity.ent_type_name + ' - (' +
                this.translate.instant('FORMIO.LABEL-TYPE') + ': select)';
            this.options.builder[entitySpecificationId].weight = 1;
        } else {
            // If it's a new form, add a box with the entitySpecification's possible field types (select only).
            this.createEntitySpecificationBox();
        }
    }

    createDataGridBox(entType) {
        const entTypeId = 'entType' + entType[0].ent_type_id;
        this.options.builder[entTypeId] = {};
        this.options.builder[entTypeId].title = entType[0].ent_type_name;
        this.options.builder[entTypeId].weight = entType[0].order;
        this.options.builder[entTypeId].components = {};
        this.addDataGridComponent(entType, 'dataGridTable');
        this.addDataGridComponent(entType, 'dataGridPanel');
    }

    addDataGridComponent(entTypeProperties, dataGridComponentType) {
        const entTypeId = 'entType' + entTypeProperties[0].ent_type_id;
        const entTypeComponentId = entTypeId + dataGridComponentType;
        this.options.builder[entTypeId].components[entTypeComponentId] = {};
        this.options.builder[entTypeId].components[entTypeComponentId].title = entTypeProperties[0].ent_type_name + ' ' +
            dataGridComponentType;
        this.options.builder[entTypeId].components[entTypeComponentId].icon = 'terminal';
        this.options.builder[entTypeId].components[entTypeComponentId].key = entTypeProperties[0].ent_type_id;
        this.options.builder[entTypeId].components[entTypeComponentId].schema = {};
        this.options.builder[entTypeId].components[entTypeComponentId].schema.label = entTypeProperties[0].ent_type_name;
        this.options.builder[entTypeId].components[entTypeComponentId].schema.attributes = {};
        this.options.builder[entTypeId].components[entTypeComponentId].schema.attributes.entTypeId = entTypeProperties[0].ent_type_id;
        this.options.builder[entTypeId].components[entTypeComponentId].schema.attributes.dataGridType = dataGridComponentType;
        this.options.builder[entTypeId].components[entTypeComponentId].schema.type = 'datagrid';
        this.options.builder[entTypeId].components[entTypeComponentId].schema.input = true;
        this.options.builder[entTypeId].components[entTypeComponentId].schema.tree = false;
        this.options.builder[entTypeId].components[entTypeComponentId].schema.multiple = false;

        let dataGridComponents = [];

        if (dataGridComponentType === 'dataGridTable') {
            dataGridComponents = this.options.builder[entTypeId].components[entTypeComponentId].schema.components = [];
        } else if (dataGridComponentType === 'dataGridPanel') {
            this.options.builder[entTypeId].components[entTypeComponentId].schema.components = [
                {type: 'panel', title: '', label: '', key: entTypeProperties[0].ent_type_id, components: []}
            ];
            dataGridComponents = this.options.builder[entTypeId].components[entTypeComponentId].schema.components[0].components;
        }

        for (const actionProp of entTypeProperties) {
            const component = {};
            dataGridComponents.push(this.createBuilderField(component, actionProp, this.getFieldTypeForDataGrid(actionProp)));
        }
    }

    getFieldTypeForDataGrid(property) {
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

    createEntitySpecificationBox() {
        const actionEntity = this.ActionEntity;
        const entitySpecificationId = 'entitySpecification' + actionEntity.ent_type_id;
        this.options.builder[entitySpecificationId] = {};
        this.options.builder[entitySpecificationId].title = actionEntity.ent_type_name;
        this.options.builder[entitySpecificationId].weight = 1;
        this.options.builder[entitySpecificationId].components = {};
        // Create only a select field for the entitySpecification
        const component = this.options.builder[entitySpecificationId].components['select' + entitySpecificationId] = {};
        this.createEntitySelectBuilderField(component, actionEntity, 'terminal');
    }

    createEntitySelectBuilderField(component, actionEntity, icon = null) {
        component.key = 'entitySpecification' + actionEntity.ent_type_id;
        component.title = 'Select';
        component.icon = icon;

        component.schema = {};
        // Use the schema for the remaining setup
        component = component.schema;

        component.label = actionEntity.ent_type_name;
        component.attributes = {
            entTypeId: actionEntity.ent_type_id,
            entitySpecificationTerm: actionEntity.entitySpecificationTerm
        };

        component.type = 'select';
        component.input = true;
        component.widget = 'choicesJS';
        component.data = {
            values: []
        };
        component.dataSrc = 'custom';
        component.valueProperty = 'value';
        component.data.custom = 'values = component.entityInstances;';
        this.addChoicesJSandFuseJSCustomOptions(component);

        return component;
    }

    createPropertyBoxWithFieldTypes(property) {
        const propertyID = property.property_id;
        this.options.builder[propertyID] = {};
        this.options.builder[propertyID].title = property.property_name;
        this.options.builder[propertyID].weight = property.order;
        this.options.builder[propertyID].components = {};
        // Create each possible fields for the property
        this.defineFieldType(property);
    }

    // Define which fields will appear in the form editor's property box, depending on the property's value_type
    defineFieldType(property) {
        const possibleFields = this.getPossibleFieldTypes(property);
        for (const fieldType of possibleFields) {
            const component = this.options.builder[property.property_id].components[fieldType + property.property_id] = {};
            this.createBuilderField(component, property, fieldType, 'terminal', true);
        }
    }

    createBuilderField(component, property, fieldType, icon = null, useSchema = false) {
        const propertyID = property.property_id;
        const idActionProp = property.action_prop_id;
        const propertyName = property.property_name;
        const valueTypeDB = property.value_type;

        // These properties are set on the "component." object, no matter if it's inside a dataGrid or not
        component.key = propertyID + '-' + idActionProp;
        // Only set the title and icon properties for fields not belonging to a dataGrid parent.
        if (icon) {
            component.title = fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
            component.icon = icon;
        }

        // Initialize schema if required - for every field not belonging to a dataGrid parent.
        if (useSchema) {
            component.schema = {};
            // Use the schema for the remaining setup
            component = component.schema;
        }

        // Common properties
        component.label = propertyName;
        component.attributes = {
            propertyID,
            idActionProp,
        };

        // For the 'part of' fields belonging to hasMany entTypes (dataGrids)
        if (property.part_of) {
            component.type = 'hidden';
            component.hideLabel = true;
            component.hidden = true;
            return component;
        }

        // Common properties
        component.type = fieldType;
        component.input = true;
        component.multiple = !!property.multiple_values;

        // For the 'unchangeable' fields belonging to an edition of a hasMany entTypes (dataGrids)
        if (property.unchangeable) {
            component.disabled = true;
            return component;
        }

        // Load the field's enableConditions, formCalculations and/or validationConditions
        this.addEnableCondition(component, property);
        this.addFormCalculation(component, property);
        this.createCustomValidation(component, property);

        // Load values based on fieldType
        this.loadFieldValues(component, property, fieldType, valueTypeDB);
        return component;
    }

    loadFieldValues(component, property, fieldType, valueTypeDB) {
        if (fieldType === 'select') {

            component.widget = 'choicesJS';
            component.data = {
                values: property.has_query_options ? [] : property.possible_values,
            };

            if (property.has_query_options) {
                component.dataSrc = 'custom';
                component.valueProperty = 'value';
                component.data.custom = 'values = component.queryValues;';
                this.addChoicesJSandFuseJSCustomOptions(component);
            }

        } else if (fieldType === 'radio') {

            component.values = []; // Initialize values
            if (valueTypeDB === 'prop_ref' || valueTypeDB === 'enum') {
                component.values = property.possible_values;
            } else if (valueTypeDB === 'bool') {
                component.values = [
                    { label: this.translate.instant('FORMIO.OPTION-TRUE'), value: true },
                    { label: this.translate.instant('FORMIO.OPTION-FALSE'), value: false }
                ];
            }
        } else if (fieldType === 'time') {
            component.dataFormat = 'HH:mm';
        }
    }

    addChoicesJSandFuseJSCustomOptions(component) {
        // Custom template to show for every option
        component.template = '<span class="tooltip-container">{{ item.description }}</span>';
        // So that the 'search' function actually works due to the template formatting
        component.fuseOptions = {};
        component.fuseOptions.threshold = 0.2;
        component.fuseOptions.tokenize = true;
        component.fuseOptions.matchAllTokens = true;
        component.fuseOptions.includeScore = true;
        component.fuseOptions.ignoreLocation = true;
        component.fuseOptions.include = 'score';
        // When we do a 'search', the default search result limit is only 4 results. Make sure all results appear.
        component.customOptions = {};
        component.customOptions.searchResultLimit = 100;
    }

    addEnableCondition(component, property) {
        // If property has an 'enable condition', enforce it in the form's json
        if (property.enable_condition) {
            component.conditional = {};
            component.conditional.json = JSON.parse(property.enable_condition);

            // So that we can store the generated json_logic in the enable_condition_log table
            this.storeEnableConditionLog(component, property);
        }
    }

    storeEnableConditionLog(component, property) {
        const enableConditionLog = {} as EnableConditionLog;
        enableConditionLog.action_prop_id = component.attributes.idActionProp;
        enableConditionLog.form_id = this.formId;
        enableConditionLog.json_logic = property.enable_condition;
        this.enableConditionLogs.push(enableConditionLog);
    }

    addFormCalculation(component, property) {
        if (property.form_calculation) {
            // Mark field as disabled as it will be automatically calculated
            component.disabled = true;
            component.calculateValue = JSON.parse(property.form_calculation);

            // So that we can store the generated json_logic in the form_calculation_log table
            this.storeFormCalculationLog(component, property);
        }
    }

    storeFormCalculationLog(component, property) {
        const formCalculationLog = {} as FormCalculationLog;
        formCalculationLog.action_prop_id = component.attributes.idActionProp;
        formCalculationLog.form_id = this.formId;
        formCalculationLog.json_logic = property.form_calculation;
        this.formCalculationLogs.push(formCalculationLog);
    }

    // Builds the validations for each property based on the validation_cond table
    createCustomValidation(component, property) {

        // Creates the start of the validations' string that stores validations and their error messages
        let customValidation = 'let validations=[],messages=[];\nfunction myFunction(item){if(typeof item==="string")' +
            '{messages.push(item)}}\n';
        component.validate = {};

        if (property.validation_conditions) {
            for (const validation of property.validation_conditions) {

                // If validation doesn't have a custom error message, use the default ones
                if (!validation.error_text) {
                    validation.error_text = this.getDefaultValidationErrorMessage(validation);
                }

                switch (validation.type) {
                    case 'required':
                        component.validate.required = true;
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
                            component.validate.minLength = validation.param_1;
                        }
                        break;
                    case 'maxLength':
                        if (!validation.neg) {
                            component.validate.maxLength = validation.param_1;
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
                            component.validate.minWords = validation.param_1;
                        }
                        break;
                    case 'maxWordLength':
                        if (!validation.neg) {
                            component.validate.maxWords = validation.param_1;
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
                        component.enableMaxDateInput = true;
                        component.datePicker = {};
                        if (validation.param_1 === 'CURRENT_DATE') {
                            component.datePicker.maxDate = 'moment()';
                        } else {
                            // TODO try to enforce maxDate, so that calendar blocks dates after that one
                            // component.datePicker.maxDate = 'moment(data[' + validation.param_1 + '])';
                            component.validate.json = {};
                            component.validate.json = this.getJsonLogicDateValidation(validation);
                        }
                        break;
                    case 'afterDate':
                        component.datePicker = {};
                        component.enableMinDateInput = true;
                        if (validation.param_1 === 'CURRENT_DATE') {
                            component.datePicker.minDate = 'moment()';
                        } else {
                            // TODO try to enforce minDate, so that calendar blocks dates before that one
                            component.validate.json = {};
                            component.validate.json = this.getJsonLogicDateValidation(validation);
                        }
                        break;
                    case 'maxChoice':
                        // TODO fix multiple validation message printing when last input is duplicated somewhere in the data array
                        customValidation += 'valid = ((data[' + property.property_id + '].length <= ' + validation.param_1 + ') || ' +
                            '(data[' + property.property_id + '][(data[' + property.property_id + '].length - 1)] != input)) ? true : \''
                            + validation.error_text + '\';\n';
                        customValidation += 'validations.push(valid);\n';
                        break;
                    case 'minChoice':
                        customValidation += 'valid = ((data[' + property.property_id + '].length >= ' + validation.param_1 + ') || ' +
                            '(data[' + property.property_id + '][(data[' + property.property_id + '].length - 1)] != input)) ? true : \''
                            + validation.error_text + '\';\n';
                        customValidation += 'validations.push(valid);\n';
                        break;
                }
            }
        }
        // At the end a for loop is added which goes through all the validations and checks if there are any error messages to be displayed
        customValidation += 'validations.forEach(myFunction),0===messages.length?valid=!0:valid=messages[0];';
        // Adds the validation to the field
        component.validate.custom = customValidation;

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

    getPossibleFieldTypes(property) {
        switch (property.value_type) {
            case 'text':
                return property.multiple_values ? ['textfield', 'textarea', 'email', 'address'] :
                    ['textfield', 'textarea', 'email', 'address', 'password'];
            case 'enum':
            case 'prop_ref':
                return property.multiple_values || property.has_query_options ? ['select'] :
                    ['radio', 'select'];
            case 'int':
            case 'double':
                return ['number', 'currency'];
            case 'date':
                return property.multiple_values ? ['datetime'] :
                    ['datetime', 'day'];
            case 'time':
                return ['time'];
            case 'file':
                return ['file'];
            case 'bool':
                return ['radio'];
            default:
                return null;
        }
    }

    onChange(event) {
        // When a component is dragged, if it´s not a design element, save it in the ActionPropForm array
        if (event.type === 'addComponent') {
            this.addComponent(event.component);
            this.refreshBuilder();
        } else if (event.type === 'deleteComponent') {
            this.deleteComponent(event.component);
            this.refreshBuilder();
        } else if (event.type === 'saveComponent') {
            this.refreshBuilder();
        }
    }

    addComponent(component) {
        if (component.type === 'datagrid') {
            const propertySubComponents = component.components === 'dataGridPanel' ?
                component.components[0].components : component.components;
            for (const subComponent of propertySubComponents) {
                // So that the key returned by the submit button is the propertyId and not the label of the field
                subComponent.key = subComponent.attributes.propertyID;
            }
            // So that the key returned by the submit button is the 'entType' + entTypeId and not the label of the field
            component.key = 'entType' + component.attributes.entTypeId;
            this.insertDataGrid(component, propertySubComponents);
        } else if (component.attributes.entitySpecificationTerm) {
            // So that the key returned by the submit button is the 'entitySpecification' + entTypeId and not the label of the field
            component.key = 'entitySpecification' + component.attributes.entTypeId;
            this.insertEntitySpecificationField(component);
        } else if (component.type && component.type !== 'columns' && component.type !== 'tabs' && component.type !== 'table' &&
            component.type !== 'panel' && component.type !== 'button' && component.type !== 'htmlelement') {
            // So that the key returned by the submit button is the propertyId and not the label of the field
            component.key = component.attributes.propertyID;
            this.insertActionProp(component);
        }
    }

    insertActionProp(component) {
        // Get the actionProp's information
        const actionPropId = component.attributes.idActionProp;
        const actionProp = this.ActionProps.find(item => item.action_prop_id === actionPropId);
        // Add the actionPropForm object to the corresponding array
        // If a component, after being inserted in the form, is moved to another location in the form, it is considered as an 'addComponent'
        // event, hence why we check if the actionProp has already been added to the form.
        if (!this.actionPropForms.find(item => item.action_prop_id === actionPropId)) {
            this.addActionPropForm(component.type, actionPropId);
            // Delete the property box's component fields and insert a string indicating that the property is already assigned
            delete this.options.builder[actionProp.property_id].components;
            this.options.builder[actionProp.property_id].title = component.label + ' - (' + this.translate.instant('FORMIO.LABEL-TYPE') +
                ': ' + component.type + ')';
        }
    }

    insertDataGrid(component, propertySubComponents) {
        const entTypeId = 'entType' + component.attributes.entTypeId;
        for (const subComponent of propertySubComponents) {
            // Get the actionProp's information
            const actionPropId = subComponent.attributes.idActionProp;
            // So that action prop forms aren't inserted for disabled properties of 'has many' ent types in 'edit forms'
            if (subComponent.attributes.idActionProp) {
                this.addActionPropForm(subComponent.type, actionPropId);
            }
        }
        // Delete the property box's component fields and insert a string indicating that the property is already assigned
        delete this.options.builder[entTypeId].components;
        this.options.builder[entTypeId].title = component.label + ' - (' + this.translate.instant('FORMIO.LABEL-TYPE') +
            ': ' + component.type + ')';
    }

    insertEntitySpecificationField(component) {
        const entTypeId = 'entitySpecification' + component.attributes.entTypeId;
        // Delete the entitySpecification box's component fields and insert a string indicating that it's already assigned
        delete this.options.builder[entTypeId].components;
        this.options.builder[entTypeId].title = component.label + ' - (' + this.translate.instant('FORMIO.LABEL-TYPE') +
            ': ' + component.type + ')';
    }

    addActionPropForm(componentType, actionPropId) {
        // Add the actionPropForm object to the corresponding array
        // If a component, after being inserted in the form, is moved to another location in the form, it is considered as an 'addComponent'
        // event, hence why we check if the actionProp has already been added to the form.
        if (!this.actionPropForms.find(item => item.action_prop_id === actionPropId)) {
            const actionPropForm = {} as ActionPropForm;
            actionPropForm.action_prop_id = actionPropId;
            actionPropForm.form_id = this.formId;
            actionPropForm.form_field_type = componentType;
            this.actionPropForms.push(actionPropForm);
        }
    }

    deleteComponent(component) {
        // When a component is removed and it´s not a design element, delete if from the ActionPropForm array
        // Also re-insert the builder fields on the left side tab
        if (component.type === 'datagrid') {
            this.deleteDataGrid(component.attributes.entTypeId);
        } else if (component.attributes.entitySpecificationTerm) {
            this.deleteEntitySpecificationField();
        } else if (component.type && component.type !== 'columns' && component.type !== 'tabs' && component.type !== 'table' &&
            component.type !== 'panel' && component.type !== 'button' && component.type !== 'htmlelement') {
            this.deleteActionProp(component.attributes.idActionProp);
        } else {
            this.deleteSubComponents(component);
        }
    }

    deleteSubComponents(component) {
        if (component.type === 'columns') {
            for (const subComponent of component.columns) {
                this.deleteComponent(subComponent);
            }
        } else if (component.type === 'table') {
            for (const line of component.rows) {
                for (const column of line) {
                    this.deleteComponent(column);
                }
            }
        } else if (component.components) {
            for (const subComponent of component.components) {
                this.deleteComponent(subComponent);
            }
        }
    }

    deleteActionProp(actionPropId) {
        // Delete the actionPropForm from the corresponding array
        this.actionPropForms = this.actionPropForms.filter(item => item.action_prop_id !== actionPropId);
        // Get the corresponding actionProp's information
        const deletedProperty = this.ActionProps.find(item => item.action_prop_id === actionPropId);
        this.createPropertyBoxWithFieldTypes(deletedProperty);
    }

    deleteDataGrid(entTypeId) {
        const entTypeActionProps = this.EntTypesHasMany.find(item => item.find(subItem => subItem.ent_type_id === entTypeId));
        for (const actionProp of entTypeActionProps) {
            // Delete the actionPropForm from the corresponding array
            this.actionPropForms = this.actionPropForms.filter(item => item.action_prop_id !== actionProp.action_prop_id);
        }
        const selectedEntType = this.EntTypesHasMany.find(entType => entType[0].ent_type_id === entTypeId);
        this.createDataGridBox(selectedEntType);
    }

    deleteEntitySpecificationField() {
        this.createEntitySpecificationBox();
    }

    // Update the builder and force it to be re-rendered
    refreshBuilder() {
        this.showFormEditor = false;
        // Update Form Options
        setTimeout(() => {
            this.hiddenForm = true;
            this.showFormEditor = true;
            setTimeout(() => {
                this.removeDataGridUnwantedBehaviour();
                this.removeFieldsExtraContextButton();
                this.removeSearchFieldsInputSidebar();
                this.hiddenForm = false;
            }, 500);
        }, 4);
    }

    // Get all dataGrids in the form editor and remove unwanted behaviour from each one of them
    removeDataGridUnwantedBehaviour() {
        const dataGridComponents = document.getElementsByClassName('formio-component-datagrid');
        for (const dataGridComponent of dataGridComponents) {
            // Remove last column of dataGrid that has a drag and drop warning/input [1st row and header]
            dataGridComponent.getElementsByClassName('drag-and-drop-alert')[0].parentElement.remove();
            const tableHeaders = dataGridComponent.querySelectorAll('table > thead > tr > th');
            if (tableHeaders.length) {
                tableHeaders[tableHeaders.length - 1].remove();
            }
            // Get all components/properties inside the DataGrid element
            const builderComponents = dataGridComponent.getElementsByClassName('builder-component');
            for (const builderComponent of builderComponents) {
                // Make dataGrid component unmovable.
                this.renderer.addClass(builderComponent, 'no-drag');
                // Don't allow the drop/insertion of new fields inside the dataGrid component
                this.renderer.addClass(builderComponent.parentElement, 'no-drop');
                // Remove 'delete', 'move' context buttons ['edit json', 'copy' and 'paste' are removed for all fields].
                builderComponent.getElementsByClassName('component-settings-button-remove')[0].remove();
                builderComponent.getElementsByClassName('component-settings-button-move')[0].remove();
            }
        }
    }

    removeFieldsExtraContextButton() {
        // Get all components/properties inside the form
        const builderComponents = document.getElementsByClassName('builder-component');
        for (const builderComponent of builderComponents) {
            // Remove 'edit json', 'copy' and 'paste' context buttons.
            builderComponent.getElementsByClassName('component-settings-button-edit-json')[0].remove();
            builderComponent.getElementsByClassName('component-settings-button-copy')[0].remove();
            builderComponent.getElementsByClassName('component-settings-button-paste')[0].remove();
        }
        // Delete 'remove' context button for submit button
        const submitButton = document.getElementsByClassName('formio-component-submit')[0].parentElement;
        submitButton.getElementsByClassName('component-settings-button-remove')[0].remove();
    }

    removeSearchFieldsInputSidebar() {
        // Delete 'search field' input in the sidebar
        const searchFieldInput = document.getElementsByClassName('builder-sidebar_search');
        if (searchFieldInput) {
            searchFieldInput[0].remove();
        }
    }

    // Save/Update Form when all properties have been inserted in the editor
    saveForm() {
        const canSave = this.allFormFieldsInserted();
        if (canSave) {
            const formSave = this.createFormObject();
            // Depending on if it's the creation of a new form or the update of an existing one, act accordingly
            if (this.formId) {
                // Update Form
                this.restFormApi.updateForm(formSave).subscribe((success: any) => {
                    if (success) {
                        this.alertToast.showSuccess(this.translate.instant('FORMIO.UPDATE-SUCCESS'));
                        this.router.navigate(['/formsManagement']);
                    } else {
                        this.alertToast.showError(this.translate.instant('FORMIO.UPDATE-ERROR'));
                    }
                });
            } else {
                // Create new Form
                this.restFormApi.createForm(formSave).subscribe((success: any) => {
                    if (success) {
                        this.alertToast.showSuccess(this.translate.instant('FORMIO.SAVE-SUCCESS'));
                        this.router.navigate(['/formsManagement']);
                    } else {
                        this.alertToast.showError(this.translate.instant('FORMIO.SAVE-ERROR'));
                    }
                });
            }
        } else {
            // Show warning to user stating that the form can't be saved.
            this.alertToast.showWarning(this.translate.instant('FORMIO.ERROR-INSERT-ALL-FIELDS'));
        }
    }

    allFormFieldsInserted() {
        if (this.isEntitySpecificationAction) {
            // User must have inserted a field for the entitySpecification in the form before saving it
            if (this.options.builder['entitySpecification' + this.ActionEntity.ent_type_id].components !== undefined) {
                return false;
            }
        } else {
            for (const property of this.ActionProps) {
                // User must have inserted all properties in the form before saving it
                if (this.options.builder[property.property_id].components !== undefined) {
                    return false;
                }
            }
            for (const entTypeHasMany of this.EntTypesHasMany) {
                if (this.options.builder['entType' + entTypeHasMany[0].ent_type_id].components !== undefined) {
                    return false;
                }
            }
        }
        return true;
    }

    createFormObject() {
        const newForm = {} as Form;
        newForm.id = this.formId;
        newForm.name = this.formName;
        newForm.action_id = this.actionId;
        newForm.json = JSON.stringify(this.myForm);
        newForm.actionPropForms = this.actionPropForms;
        newForm.enableConditionLogs = this.enableConditionLogs;
        newForm.formCalculationLogs = this.formCalculationLogs;
        return newForm;
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
                    const afterProperty = this.ActionProps.find(actionProp =>
                        actionProp.property_id === Number(validation.param_1)).property_name;
                    return this.translate.instant('DEFAULT-VALIDATION-ERROR.AFTER-DATE', {param1: afterProperty});
                } else {
                    return null;
                }
            case 'beforeDate':
                if (validation.param_1 !== 'CURRENT_DATE') {
                    const beforeProperty = this.ActionProps.find(actionProp =>
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

    private groupByArray(data, key) {
        return Array.from(data
            .reduce((m, o) => m.set(o[key], [...(m.get(o[key]) || []), o]), new Map())
            .values()
        );
    }
}
