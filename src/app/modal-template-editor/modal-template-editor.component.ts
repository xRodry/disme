/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TemplateApiService} from '../shared/rest-api/template-api.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

import {Template} from '../shared/interfaces/template.model';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';
import {PropertyApiService} from '../shared/rest-api/property-api.service';
import {ConstantApiService} from '../shared/rest-api/constant-api.service';
import {QueryApiService} from '../shared/rest-api/query-api.service';

@Component({
    selector: 'app-modal-template-editor',
    templateUrl: './modal-template-editor.component.html',
    styleUrls: ['./modal-template-editor.component.css']
})

export class ModalTemplateEditorComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public template: any = {} as Template;
    public isModal = true;
    public isToast = false;
    public isClassCustom = false;
    public isDoc = false;

    public from: string;
    public fieldPlaceholder = {} as Template;
    public templateTranslation = false;

    private constants = [];
    private properties = [];
    private queries = [];
    private contextVariables: [{ name: string; id: number }];

    public showSourceCode = false;

    private tinyMCEPanelButtons = [
        {
            type: 'cancel',
            name: 'closeButton',
            disabled: false,
            text:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.BUTTONS.CANCEL'),
        },
        {
            type: 'submit',
            name: 'submitButton',
            text:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.BUTTONS.INSERT'),
            disabled: false,
            primary: true
        }
    ];

    private dialogConfigTabPanel = {
        title:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.MODAL-TITLE'),
        size: 'medium',
        body: {
            type : 'tabpanel',
            tabs: [
                {
                    name: 'constants',
                    title: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.CONSTANTS-TAB.TITLE'),
                    items: [
                        {
                            type: 'selectbox',
                            name: 'constantSelect',
                            label: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.CONSTANTS-TAB.CONSTANT-SELECT'),
                            items: []
                        },
                    ]
                },
                {
                    name: 'properties',
                    title: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.PROPERTIES-TAB.TITLE'),
                    items: [
                        {
                            type: 'selectbox',
                            name: 'entityTypeSelectProperties',
                            label: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.PROPERTIES-TAB.ENTITY-SELECT'),
                            items: []
                        },
                        {
                            type: 'listbox',
                            name: 'propertySelect',
                            label: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.PROPERTIES-TAB.PROPERTY-SELECT'),
                            items: []
                        },
                    ]
                },
                {
                    name: 'queries',
                    title: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.QUERIES-TAB.TITLE'),
                    items: [
                        {
                            type: 'selectbox',
                            name: 'querySelect',
                            label: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.QUERIES-TAB.QUERY-SELECT'),
                            items: []
                        },
                    ]
                },
                {
                    name: 'contextVariables',
                    title: this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.CONTEXT-VARIABLES-TAB.TITLE'),
                    items: [
                        {
                            type: 'selectbox',
                            name: 'contextVariableSelect',
                            label: this.translate.instant(
                                'TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.CONTEXT-VARIABLES-TAB.CONTEXT-VARIABLE-SELECT'
                            ),
                            items: []
                        },
                    ]
                }
            ]
        },
        buttons: this.tinyMCEPanelButtons,
        initialData: {
            constantSelect: '0',
            entityTypeSelectProperties: '0',
            propertySelect: '0',
            querySelect: '0',
            contextVariableSelect: '0'
        },
        // Initial selectedTab. This variable will save the currentSelectedTab, so we know what we have to load when changed
        selectedTab: 'constants',
        // So we know when we have to call the onTabChange method, and when we don't (after loading information to select boxes)
        changingTab: true,
        onTabChange: (dialogApi, details) => {
            // Only execute this function when changingTabs in the editor. Don't execute it when redialing the editor.
            if (this.dialogConfigTabPanel.selectedTab !== details.newTabName && this.dialogConfigTabPanel.changingTab) {
                // Save the new selectedTab when changing tabs
                this.dialogConfigTabPanel.selectedTab = details.newTabName;
                // Show 'loading' info until the new select boxes' options have been loaded and rendered
                dialogApi.block('Loading');
                switch (details.newTabName) {
                    case 'constants':
                        this.getConstantsForTabPanel(dialogApi);
                        break;
                    case 'properties':
                        this.getEntTypesWithPropertiesForTabPanel(dialogApi);
                        break;
                    case 'queries':
                        this.getQueriesForTabPanel(dialogApi);
                        break;
                    case 'contextVariables':
                        this.getContextVariablesForTabPanel(dialogApi);
                        break;
                }
            }
        },
        onChange: (dialogApi, details) => {
            const data = dialogApi.getData();
            // Show 'loading' info until the select boxes' new options have been loaded and rendered
            dialogApi.block('Loading');
            switch (this.dialogConfigTabPanel.selectedTab) {
                case 'constants':
                    // Disable the submit button if no constant is selected
                    data.constantSelect === '0' ? dialogApi.disable('submitButton') : dialogApi.enable('submitButton');
                    dialogApi.unblock();
                    break;
                case 'properties':
                    switch (details.name) {
                        case 'entityTypeSelectProperties':
                            // Save the newly selected entity type.
                            // If the dialogBox is closed and reopened, it will load the previously selected value
                            this.dialogConfigTabPanel.initialData.entityTypeSelectProperties = data.entityTypeSelectProperties;
                            // Get the newly selected entity type's properties and load them in the select box
                            this.getPropertiesForTabPanel(dialogApi, data.entityTypeSelectProperties);
                            break;
                        case 'propertySelect':
                            // Disable the submit button if no property is selected
                            data.propertySelect === '0' ? dialogApi.disable('submitButton') : dialogApi.enable('submitButton');
                            dialogApi.unblock();
                            break;
                    }
                    break;
                case 'queries':
                    // Disable the submit button if no query is selected
                    data.querySelect === '0' ? dialogApi.disable('submitButton') : dialogApi.enable('submitButton');
                    dialogApi.unblock();
                    break;
                case 'contextVariables':
                    // Disable the submit button if no context variable is selected
                    data.contextVariableSelect === '0' ? dialogApi.disable('submitButton') : dialogApi.enable('submitButton');
                    dialogApi.unblock();
                    break;
            }
        },
        onSubmit: (dialogApi) => {
            const data = dialogApi.getData();
            // Add the non-editable text identifying the added dynamic value to the text editor
            switch (this.dialogConfigTabPanel.selectedTab) {
                case 'constants':
                    const selectedConstant = this.constants.find((constant) => constant.id === Number(data.constantSelect));
                    // @ts-ignore: In the context of the tinyMCE plugin
                    tinymce.activeEditor.execCommand('mceInsertContent', false,
                        '<span class="nonedit" contentEditable="false">@constant(["' + selectedConstant.name +
                        '", ' + data.constantSelect + '])</span>');
                    break;
                case 'properties':
                    let propertyName = '';
                    // For when we're selecting a sub-property of the propRef property chosen
                    if (data.propertySelect.includes('.')) {
                        // It will come as, e.g. '45.6', with 45 being the main propRef and 6 the sub-property chosen
                        const propRefSelected = data.propertySelect.split('.', 2);
                        // Get the name of both, so we can insert in into the editor
                        const mainPropRefInfo = this.properties.find((property) => property.id === Number(propRefSelected[0]));
                        const secondaryPropRefName = mainPropRefInfo.fk_entity_type_properties.find(
                            (property) => property.id === Number(propRefSelected[1])
                        ).name;
                        propertyName = mainPropRefInfo.name + ' → ' + secondaryPropRefName;
                    } else {
                        propertyName = this.properties.find((property) => property.id === Number(data.propertySelect)).name;
                    }
                    // @ts-ignore: In the context of the tinyMCE plugin
                    tinymce.activeEditor.execCommand('mceInsertContent', false,
                        '<span class="nonedit" contentEditable="false">@property(["' + propertyName +
                        '", ' + data.propertySelect + '])</span>');
                    break;
                case 'queries':
                    const selectedQuery = this.queries.find((query) => query.id === Number(data.querySelect));
                    // Build the directive in the format of [queryName, queryId, queryParameters]
                    // Ex:  @query(['Name', 8, [[Citizen, '=', ...], [Name, '=', ...]
                    let queryDirective = '<span class="nonedit" contentEditable="true">@query([' +
                        selectedQuery.name + ', ' + data.querySelect;
                    // If the query has parameters, insert them into the directive, but leave '...' in the place where
                    // the user is supposed to fill these parameters
                    if (selectedQuery.propertyParameters) {
                        let firstParameter = true;
                        queryDirective += ', [';
                        for (const parameter of selectedQuery.propertyParameters) {
                            queryDirective += firstParameter ? '[' + parameter.name + ', ' + parameter.id + ', ...]' :
                                ', [' + parameter.name + ', ' + parameter.id + ', ...]';
                            firstParameter = false;
                        }
                        queryDirective += ']';
                    }

                    queryDirective += '])</span>';

                    // @ts-ignore: In the context of the tinyMCE plugin
                    tinymce.activeEditor.execCommand('mceInsertContent', false, queryDirective);
                    break;
                case 'contextVariables':
                    const contextVariableInfo = this.contextVariables.find(
                        (contextVariable) => contextVariable.id === Number(data.contextVariableSelect));
                    // @ts-ignore: In the context of the tinyMCE plugin
                    tinymce.activeEditor.execCommand('mceInsertContent', false,
                        '<span class="nonedit" contentEditable="false">@contextVariable([' + contextVariableInfo.name +
                        ', ' + data.contextVariableSelect + '])</span>');
                    break;
            }
            dialogApi.close();
        },
    };

    public initConfigTemplateEditor: any = {
        inline: false,
        branding: false,
        min_height: 300,
        // TODO check this class and improve it, because it's overlapping the line above.
        //  If it's in the end of a line/wrapping to next line, it's also strange and needs to be improved.
        content_style:
            `.nonedit {
                border: dashed 1px rgb(144, 164, 174);
                padding: 0.25rem;
                position: relative;
                background-color: rgba(207, 216, 220, 0.2);
            }`,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste template noneditable help'
        ],
        // menu: {
        //     dynamicValues: {title: 'Dynamic Values', items: 'constants properties'}
        // },
        menubar: 'file edit insert view format table tools help',
        toolbar:
            ' undo redo | dynamicValuesTabPanel | formatselect | image | bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | table | removeformat | help | charmap | code',
        valid_children : '+body[link]',
        setup: (editor) => {
            editor.ui.registry.addButton('dynamicValuesTabPanel', {
                text:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.MENU-BUTTON-TEXT'),
                onAction: () => {
                    const dialogApi = editor.windowManager.open(this.dialogConfigTabPanel);
                    // Show 'loading' info until the new select boxes' options have been loaded and rendered
                    dialogApi.block('Loading');
                    // Load the last selected tab (or the 'constants' tab if it's the first time opening the modal)
                    switch (this.dialogConfigTabPanel.selectedTab) {
                        case 'constants':
                            this.getConstantsForTabPanel(dialogApi);
                            break;
                        case 'properties':
                            this.getEntTypesWithPropertiesForTabPanel(dialogApi);
                            break;
                        case 'queries':
                            this.getQueriesForTabPanel(dialogApi);
                            break;
                        case 'contextVariables':
                            this.getContextVariablesForTabPanel(dialogApi);
                            break;
                    }
                },
            });
        },
    };

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private alertToast: AlertToastService,
        private restTemplateApi: TemplateApiService,
        private restEntityTypeApi: EnttypeApiService,
        private restConstantApi: ConstantApiService,
        private restPropertyApi: PropertyApiService,
        private restQueryApi: QueryApiService,
        public translate: TranslateService,
        public router: Router
    ) {
        // Initial selections to be presented on select inputs
        this.template.type = 'modal';
        this.template.class = 'success';
        this.template.colour = '#ff4040';
        this.template.text = this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.TEMPLATE-TEXT-DEFAULT');
    }

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.from = params.from;
            this.templateTranslation = params.from === 'templateTranslation';
            // Comes from the Template Editor Page in order to update a Template, get its id and load the Template
            if (this.from === 'templateEdition' || this.from === 'templateTranslation') {
                this.loadTemplateById(params.template_id);
            } else {
                // Comes from Blockly in order to update a Template, get the block field values to load the fields in editor
                this.template = params.blockTemplate;
                // Update the component variables so the select inputs are also updated if necessary
                this.isModal = this.template.type === 'modal';
                this.isToast = this.template.type === 'toast';
                this.isClassCustom = this.template.class === 'custom';
                this.isDoc = this.template.type === 'doc';
            }
        } else {
            this.from = 'templateEdition';
        }
    }

    getConstantsForTabPanel(dialogApi) {
        // TODO Add warning if no constants are defined in the system
        this.restConstantApi.getConstants().subscribe((data) => {
            this.constants = data;
            // Load the system's constants to the select box in the form of an array with {text: '', value: ''} options
            const constants = this.constants.map(item => {
                const constant = {
                    text: null,
                    value: null
                };
                constant.text = item.name;
                constant.value = item.id.toString();
                return constant;
            });
            // Default option on the select box, no constant is selected in this option
            constants.unshift({
                text:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.CONSTANTS-TAB.CONSTANT-PLACEHOLDER'),
                value: '0'
            });
            // tabs[0] because the 'constants' tab is the first tab.
            // items[0] because the 'constant' selectBox is the first/only item inside the tab
            this.dialogConfigTabPanel.body.tabs[0].items[0].items = constants;
            // So that it doesn't trigger the onTabChange methods when redialing the panel to
            // load the new information - would trigger an infinite cycle of onTabChange on the tabs:
            // constants tab - that is the tab loaded when the 'redial(...)' function is called (1st tab),
            // and the constants tab - called when we call the 'showTab(...)' function.
            this.dialogConfigTabPanel.changingTab = false;
            // Redial the tabPanel so that the new options are rendered in the select box
            dialogApi.redial(this.dialogConfigTabPanel);
            dialogApi.showTab('constants');
            this.dialogConfigTabPanel.changingTab = true;
            // Disable the submitButton until a constant is selected
            dialogApi.disable('submitButton');
            dialogApi.unblock();
        });
    }

    getEntTypesWithPropertiesForTabPanel(dialogApi) {
        // Load the system's entTypes to the select box in the form of an array with {text: '', value: ''} options
        this.restEntityTypeApi.getEntityTypes().subscribe((data) => {
            const entTypes = data.map(item => {
                const entTypeOption = {
                    text: null,
                    value: null
                };
                entTypeOption.text = item.name;
                entTypeOption.value = item.id.toString();
                return entTypeOption;
            });
            // tabs[1] because the 'properties' tab is the second tab
            // items[0] because the 'entTypes' selectBox is the first item inside the tab
            this.dialogConfigTabPanel.body.tabs[1].items[0].items = entTypes;
            if (entTypes.length > 0) {
                // Check if there's a previously selected entType. If not, select the first entType on the list
                const selectedEntType = this.dialogConfigTabPanel.initialData.entityTypeSelectProperties === '0' ?
                    entTypes[0].value : this.dialogConfigTabPanel.initialData.entityTypeSelectProperties;
                // Get the selectedEntType's properties to populate the 'properties' select box
                this.getPropertiesForTabPanel(dialogApi, selectedEntType);
            }
        });
    }

    getPropertiesForTabPanel(dialogApi, selectedEntType) {
        // Load the system's properties of the selected entType to the select box in the form of
        // an array with {text: '', items: []} options if it's a 'prop_ref' property, with the fkEntType's properties as items
        // an array with {text: '', value: ''} options for all other properties
        this.restPropertyApi.getPropertiesForEntType(selectedEntType, null).subscribe((dataProp) => {
            this.properties = dataProp;
            const properties = this.properties.map(property => {
                if (property.value_type === 'prop_ref') {
                    const propertyOption = {
                        text: null,
                        items: null,
                    };
                    propertyOption.text = property.name;
                    const propRefOptions = [];
                    for (const fkEntTypeProperty of property.fk_entity_type_properties) {
                        // Insert the value of the option as 'property_id . fkEntityType_property_id' so that we know
                        // which property in the selectedEntType was selected (important to get its value from the DB)
                        // and which property of the fkEntType was selected to be shown
                        propRefOptions.push({text: fkEntTypeProperty.name, value: property.id + '.' + fkEntTypeProperty.id});
                    }
                    propertyOption.items = propRefOptions;
                    return propertyOption;
                } else {
                    const propertyOption = {
                        text: null,
                        value: null,
                    };
                    propertyOption.text = property.name;
                    propertyOption.value = property.id.toString();
                    return propertyOption;
                }
            });
            // Default option, so that no property is selected when the entityType is changed
            properties.unshift({
                text:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.PROPERTIES-TAB.PROPERTY-PLACEHOLDER'),
                value: '0'
            });
            // tabs[1] because the 'properties' tab is the second tab.
            // items[1] because the 'properties' selectBox is the second item inside the tab
            this.dialogConfigTabPanel.body.tabs[1].items[1].items = properties;
            // So that it doesn't trigger the onTabChange methods when redialing the panel to
            // load the new information - would trigger an infinite cycle of onTabChange on the tabs:
            // constants tab - that is the tab loaded when the 'redial(...)' function is called (1st tab),
            // and the properties tab - called when we call the 'showTab(...)' function.
            this.dialogConfigTabPanel.changingTab = false;
            // Redial the tabPanel so that the new options are rendered in the select box
            dialogApi.redial(this.dialogConfigTabPanel);
            // When redialing/reopening the tabPanel, open the 'properties' tab instead of the default tab
            dialogApi.showTab('properties');
            this.dialogConfigTabPanel.changingTab = true;
            // Disable the submitButton until a property is selected
            dialogApi.disable('submitButton');
            dialogApi.unblock();
        });
    }

    getQueriesForTabPanel(dialogApi) {
        // TODO Add warning if no queries are defined in the system
        this.restQueryApi.getQueries().subscribe((data) => {
            this.queries = data;
            console.log('queries', data);
            // Load the system's queries to the select box in the form of an array with {text: '', value: ''} options
            const queries = this.queries.map(item => {
                const query = {
                    text: null,
                    value: null
                };
                query.text = item.name;
                query.value = item.id.toString();
                return query;
            });
            // Default option on the select box, no query is selected in this option
            queries.unshift({
                text:  this.translate.instant('TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.QUERIES-TAB.QUERY-PLACEHOLDER'),
                value: '0'
            });
            // tabs[2] because the 'queries' tab is the third tab.
            // items[0] because the 'query' selectBox is the first/only item inside the tab
            this.dialogConfigTabPanel.body.tabs[2].items[0].items = queries;
            // So that it doesn't trigger the onTabChange methods when redialing the panel to
            // load the new information - would trigger an infinite cycle of onTabChange on the tabs:
            // queries tab - that is the tab loaded when the 'redial(...)' function is called (1st tab),
            // and the queries tab - called when we call the 'showTab(...)' function.
            this.dialogConfigTabPanel.changingTab = false;
            // Redial the tabPanel so that the new options are rendered in the select box
            dialogApi.redial(this.dialogConfigTabPanel);
            dialogApi.showTab('queries');
            this.dialogConfigTabPanel.changingTab = true;
            // Disable the submitButton until a query is selected
            dialogApi.disable('submitButton');
            dialogApi.unblock();
        });
    }

    getContextVariablesForTabPanel(dialogApi) {
        // TODO Add warning if no context variables are defined in the system
        //  and get the context variables through the project's api when its tables are created
        // this.restContextVariablesApi.getContextVariables().subscribe((data) => {
            // this.contextVariables = data;
            this.contextVariables = [{id: 1, name: 'Hearing Request Citizen'}];
            // console.log('context variables', this.contextVariables);
            // Load the system's context variables to the select box in the form of an array with {text: '', value: ''} options
            const contextVariables = this.contextVariables.map(item => {
                const contextVariable = {
                    text: null,
                    value: null
                };
                contextVariable.text = item.name;
                contextVariable.value = item.id.toString();
                return contextVariable;
            });
            // Default option on the select box, no context variable is selected in this option
            contextVariables.unshift({
                text:  this.translate.instant(
                    'TEMPLATES-MANAGEMENT.MODAL.DYNAMIC-VALUES.CONTEXT-VARIABLES-TAB.CONTEXT-VARIABLE-PLACEHOLDER'),
                value: '0'
            });
            // tabs[3] because the 'context variables' tab is the third tab.
            // items[0] because the 'context variable' selectBox is the first/only item inside the tab
            this.dialogConfigTabPanel.body.tabs[3].items[0].items = contextVariables;
            // So that it doesn't trigger the onTabChange methods when redialing the panel to
            // load the new information - would trigger an infinite cycle of onTabChange on the tabs:
            // context variables tab - that is the tab loaded when the 'redial(...)' function is called (1st tab),
            // and the context variables tab - called when we call the 'showTab(...)' function.
            this.dialogConfigTabPanel.changingTab = false;
            // Redial the tabPanel so that the new options are rendered in the select box
            dialogApi.redial(this.dialogConfigTabPanel);
            dialogApi.showTab('contextVariables');
            this.dialogConfigTabPanel.changingTab = true;
            // Disable the submitButton until a context variable is selected
            dialogApi.disable('submitButton');
            dialogApi.unblock();
        // });
    }

    loadTemplateById(templateId) {
        this.restTemplateApi.getTemplate(templateId).subscribe((data: {}) => {
            this.template = data;
            // Update the component variables so the select inputs are also updated if necessary
            this.isModal = this.template.type === 'modal';
            this.isToast = this.template.type === 'toast';
            this.isClassCustom = this.template.class === 'custom';
            this.isDoc = this.template.type === 'doc';
            if (this.from === 'templateTranslation') {
                this.getPlaceholderFieldNamesForTranslation();
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.TEMPLATE-INFORMATION'));
        });
    }

    getPlaceholderFieldNamesForTranslation() {
        // These placeholders will be placed in the fields that need translation. We then 'erase' the this.template values
        // for those fields so that user sees the placeholder and can insert new name.
        this.fieldPlaceholder.name = this.template.name;
        this.template.name = null;
        if (this.template.type === 'modal') {
            this.fieldPlaceholder.header = this.template.header;
            this.template.header = null;
            this.fieldPlaceholder.button = this.template.button;
            this.template.button = null;
        } else if (this.template.type === 'toast') {
            this.fieldPlaceholder.title = this.template.title;
            this.template.title = null;
        }
    }

    onTypeChange(event: any) {
        const newType = event.target.value;
        this.isModal = newType === 'modal';
        this.isToast = newType === 'toast';
        this.isDoc = newType === 'doc';
    }

    onClassChange(event: any) {
        const newClass = event.target.value;
        this.isClassCustom = newClass === 'custom';
    }

    closeModal() {
        this.modalRef.hide();
    }

    clearNonUsedInputs(templateType) {
        if (templateType === 'modal') {
            delete this.template.class;
            delete this.template.title;
            delete this.template.colour;
        } else if (templateType === 'toast') {
            delete this.template.header;
            delete this.template.button;
            if (!this.isClassCustom) {
                delete this.template.colour;
                delete this.template.title;
            }
        } else if (templateType === 'doc') {
            delete this.template.class;
            delete this.template.title;
            delete this.template.colour;
            delete this.template.header;
            delete this.template.button;
        }
    }


    // Change the select background colour depending on the option choice
    changeSelectBackgroundColour() {
        const newColour = this.template.colour;
        const templateColourSelect = (document.getElementById('templateColour')) as HTMLSelectElement;
        templateColourSelect.style.backgroundColor = newColour;
        templateColourSelect.style.color = 'white';
    }

    passBack() {
        // Clear the inputs thar won't be used in the DB depending on the template type
        this.clearNonUsedInputs(this.template.type);
        if (this.from === 'templateEdition') {
            if (!this.template.template_id) {
                this.saveTemplate();
            } else {
                this.updateTemplate();
            }
        } else if (this.templateTranslation) {
            this.translateTemplate();
        } else if (this.from === 'blockly') {
            // If call was made from blockly, send back the template values updated in the modal
            console.log('I WAS CALLED FROM BLOCKLY');
            this.passEntry.emit(this.template);
            this.closeModal();
        }
    }

    isSaveButtonDisabled() {
        if (this.template.type === 'modal') {
            return !this.template.name || !this.template.header || !this.template.button || !this.template.text;
        } else if (this.template.type === 'toast') {
            if (this.template.class === 'custom') {
                return !this.template.name || !this.template.text || !this.template.class ||
                    !this.template.title || !this.template.colour;
            }
            return !this.template.name || !this.template.text || !this.template.class;
        } else if (this.template.type === 'doc') {
            return !this.template.name || !this.template.text;
        }
    }

    saveTemplate() {
        this.restTemplateApi.createTemplate(this.template).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('TEMPLATES-MANAGEMENT.SUCCESS.CREATING'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.CREATING'));
                this.passEntry.emit('error');
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.CREATING'));
            this.passEntry.emit('error');
        });
    }

    updateTemplate() {
        this.restTemplateApi.updateTemplate(this.template).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('TEMPLATES-MANAGEMENT.SUCCESS.UPDATING'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.UPDATING'));
                this.passEntry.emit('error');
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.UPDATING'));
            this.passEntry.emit('error');
        });
    }

    translateTemplate() {
        this.restTemplateApi.translateTemplate(this.template).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('TEMPLATES-MANAGEMENT.SUCCESS.TRANSLATING'));
                this.passEntry.emit('success');
                this.closeModal();
            } else {
                this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.TRANSLATING'));
                this.passEntry.emit('error');
            }
        }, error => {
            this.alertToast.showError(this.translate.instant('TEMPLATES-MANAGEMENT.ERROR.TRANSLATING'));
            this.passEntry.emit('error');
        });
    }
}
