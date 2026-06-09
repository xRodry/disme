/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, Injectable, OnInit} from '@angular/core';
import {Field, Option, QueryBuilderConfig} from 'angular2-query-builder';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DynSearchApiService} from '../shared/rest-api/dyn-search-api.service';
import {QueryApiService} from '../shared/rest-api/query-api.service';
import {DynamicSearchTableCellComponent} from './dynSearch_cell.component';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {GridOptions} from 'ag-grid-community';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalDynamicRestApiComponent} from '../modal-dynamic-rest-api/modal-dynamic-rest-api.component';
import {AgGridTranslateService} from '../shared/common/ag-grid-translate.service';
import {Token} from '../shared/rest-api/token';
import {Query} from '../shared/interfaces/query.model';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable()
@Component({
    selector: 'app-dyn-search',
    templateUrl: './dynSearch.component.html',
    styleUrls: ['./dynSearch.component.css'],
})

export class DynSearchComponent implements OnInit {

    // ----------------- NOVO --------------------
    public resultsAvailableInRestAPIInterface = false;
    // -------------------------------------------

    public Query = {} as Query;

    // Indicates the mode the user chose: 1 New query or 2 Load a query already performed
    public mode: any;

    // Used to "hide" the Query Table when the user does not select that option
    public showQueries = false;
    // Saves all queries recovered from the DB
    public Queries: Query[] = [];
    // Variable necessary when the query is loading to not clear the parameters
    private loadingQuery = false;
    // Variables for query table
    public gridOptions: GridOptions;
    public queriesColumnDefs: any = [];

    private languageAbbrv;

    public tablesToShow: any = ['queries-management'];

    // Used to "hide" the Step 1 and Step 2 until the user chooses a query to view or edit
    public showFirstSteps = false;
    // Saves all entity types recovered from the DB along with its attributes (checked, disabled...)
    public entTypes: any = [];

    // Used to "hide" the Step 3 Component until it's been configured after Step 2 (to show QueryBuilder or a warning message)
    public showStep3Component = false;
    public showQueryBuilder = false;
    // Config used for the query builder instance
    public builderConfig: QueryBuilderConfig = { fields: {} };
    // Saves all the query fields that are or are not query parameters with the respective name, rule and ruleset number
    public parameters: any = [];

    // Messages to present in step 3 when there are errors in the configuration of step 2, or when there are no filters
    public messageStep3 = null;
    private messageNoIncProps = '* ' + this.translate.instant('DYNAMIC-SEARCH.STEP-3.ERROR.NO-INCL-PROPS');
    private messageNoConnectionProps = '* ' + this.translate.instant('DYNAMIC-SEARCH.STEP-3.ERROR.NO-CONNECTION-PROPS');

    public showQueryResults = false;
    public queryResults: any = [];
    public queryHeader: any = [];

    // --------------------------------------

    constructor(
        public queryApi: QueryApiService,
        public restDynSearchApi: DynSearchApiService,
        public restEntTypeApi: EnttypeApiService,
        public translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private alertToast: AlertToastService,
        private modalService: BsModalService,
        private agGridTranslate: AgGridTranslateService
    ) {}

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.mode = params.id;
            this.initiate();
            this.loadEntityTypes();
        });
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    // ////////////////////////////////////// INITIATE ///////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////

    initiate() {
        if (this.mode === '1') {
            this.showQueries = false;
            this.showFirstSteps = true;
        } else {
            this.loadQueries();
            this.showQueries = true;
            this.showFirstSteps = false;
            this.languageAbbrv = Token.getTokenLanguage();
            this.translate.use(this.languageAbbrv);
            this.gridOptions = {
                localeText: this.agGridTranslate.localeText(this.languageAbbrv),
                defaultColDef: {
                    resizable: true,
                    wrapText: true,
                    autoHeight: true,
                }
            } as GridOptions;
            this.queriesColumnDefs = this.columnDefs();
        }
        this.Query = {} as Query;
        this.showStep3Component = false;
        this.showQueryResults = false;
    }

    private columnDefs() {
        return [
            {
                headerName: this.translate.instant('DYNAMIC-SEARCH.QUERIES.TABLE-COL-1'),
                field: 'name',
                sortable: true, filter: true,
                flex: 10,
                cellRenderer: params => {
                    let hasFilters = '';
                    let filters = '';
                    let moreFilters = '';
                    if (params.data.automatedName.filters) {
                        hasFilters = this.translate.instant('DYNAMIC-SEARCH.QUERIES.FILTERS');
                        filters = params.data.automatedName.filters;
                    }
                    if (params.data.automatedName.more_filters) {
                        moreFilters = this.translate.instant('DYNAMIC-SEARCH.QUERIES.MORE-FILTERS',
                            {number: params.data.automatedName.more_filters});
                    }

                    const time = new Date().getTime() - new Date(params.data.created_at).getTime();
                    let queryName = '';
                    if (time < 600000000) {
                        queryName += '<span class="badge badge-primary">' + this.translate.instant('SIDE-BAR.DASHBOARD-NEW') + '</span>'
                            + '&nbsp;';
                    }

                    if (params.data.name) {
                        queryName += '<span style="color:#770ca4; text-underline: auto">' + params.data.name + ': </span>';
                    }

                    queryName += '<span style="color:#f7a156">' + this.translate.instant('DYNAMIC-SEARCH.QUERIES.GET') + '</span>' +
                        '<span>' + params.data.automatedName.entTypes + '</span>' +
                        '<span style="color:#f7a156">' + this.translate.instant('DYNAMIC-SEARCH.QUERIES.PROPERTIES') + '</span>' +
                        '<span>' + params.data.automatedName.properties + '</span>' +
                        '<span style="color:#f7a156">' + hasFilters + '</span>' +
                        '<span>' + filters + '</span>' +
                        '<span style="color:#f7a156">' + moreFilters + '</span>';

                    return queryName;
                }
            },
            {
                headerName: this.translate.instant('DYNAMIC-SEARCH.QUERIES.TABLE-COL-2'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 2.5,
            },
            {
                headerName: this.translate.instant('DYNAMIC-SEARCH.QUERIES.TABLE-COL-3'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 2.5,
            },
            {
                headerName: this.translate.instant('DYNAMIC-SEARCH.QUERIES.TABLE-COL-4.TITLE'),
                field: 'actions',
                width: 180,
                cellRendererFramework: DynamicSearchTableCellComponent,
            }
        ];
    }

    goToCreateQueryPage() {
        this.router.navigate(['/dynSearch/1']);
    }

    showOrHideTable(clickedTableName) {
        if (this.tablesToShow.includes(clickedTableName)) {
            this.tablesToShow = this.tablesToShow.filter( table => {
                return table !== clickedTableName;
            });
        } else {
            this.tablesToShow.push(clickedTableName);
        }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////// LOAD QUERIES /////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////

    loadQueries() {
        this.queryApi.getQueries().subscribe((data) => {
            this.Queries = data;
        });
    }

    deleteQuery(id) {
        this.queryApi.deleteQuery(id).subscribe((data) => {
            if (data) {
                this.initiate();
                this.alertToast.showSuccess(this.translate.instant('DYNAMIC-SEARCH.SUCCESS.DELETE-QUERY'));
            } else {
                this.alertToast.showError(this.translate.instant('DYNAMIC-SEARCH.ERROR.DELETE-QUERY'));
            }
        });
    }

    populateQueryEditingFields(queryData) {
        this.initiate();
        this.Query = queryData;
        this.loadFistStep();
        this.showFirstSteps = true;
        this.loadSecondStep();
        this.loadingQuery = true;
        this.loadThirdStep();
    }

    loadFistStep() {
        // Clean entity types array - no entity type is selected at first
        this.entTypes.forEach((entType) => {
            entType.checked = false;
            entType.disabled = false;
            entType.isBaseTable = false;
        });
        // Firstly check the query's base table's entity type
        this.entTypes.find(entType => entType.id === this.Query.base_ent_type_id).checked = true;
        this.toggleEntType();
        // Then check the remaining selected entity types
        for (const queryEntityType of this.Query.selectedEntityTypes) {
            this.entTypes.find(entType => entType.id === queryEntityType).checked = true;
        }
    }

    loadSecondStep() {
        this.getPropertiesToDisplay(true);
    }

    loadThirdStep() {
        this.setupBuilder();
        this.Query.queryBuilder = JSON.parse(this.Query.query_builder);
    }


    // ///////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////// STEP 1 -> LOAD ENTITY TYPES /////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////


    loadEntityTypes() {
        this.entTypes = [];
        this.Query.selectedEntityTypes = [];
        this.restEntTypeApi.getEntTypesWithProperties().subscribe((data) => {
            for (const entityType of data) {
                // The entity types the current one points to: Obtained through propRef properties current entType that
                // have a fk_property (with that fk_property belonging to another entType)
                const parEntTypes = [];
                for (const property of entityType.properties) {
                    if (property.fk_entity_type_id) {
                        const fkEntTypeId = property.fk_entity_type_id;
                        if (!parEntTypes.includes(fkEntTypeId)) {
                            parEntTypes.push(fkEntTypeId);
                        }
                    }
                }
                // Save the entTypes to be presented in the page with its respective attributes
                const entType = {id: entityType.id, name: entityType.name, parEntTypes,
                    properties: entityType.properties, displayProperties: null, isBaseTable: false, checked: false,
                    disabled: false};
                this.entTypes.push(entType);
            }
        });
    }

    // Function called every time the value of one of the checkboxes is changed (when its clicked) for that entity type
    toggleEntType() {
        // Check how many of the entTypes have been selected
        const nrSelectedEntTypes = this.entTypes.filter(entType => entType.checked).length;
        // If no entType is selected, mark all entTypes as available for selecting
        if (!nrSelectedEntTypes) {
            this.entTypes.forEach((entType) => { entType.disabled = false; entType.isBaseTable = false; });
        } else if (nrSelectedEntTypes === 1) {
            const selectedEntType = this.entTypes.find(entType => entType.checked);
            // First entType selected will have the label of 'Base Table'
            selectedEntType.isBaseTable = true;
            this.Query.base_ent_type_id = selectedEntType.id;
            // Clean possible labels of entTypes that aren't the first selected and mark them as disabled for selection
            for (const entType of this.entTypes.filter(item => item !== selectedEntType)) {
                entType.isBaseTable = false;
                entType.disabled = true;
            }
            // Make the related entTypes of the first selected entType available for selection
            const parEntTypes = this.entTypes.filter(item => selectedEntType.parEntTypes.includes(item.id));
            parEntTypes.forEach((parEntType) => { parEntType.disabled = false; });
        }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////// STEP 2 -> PROPERTIES ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////

    // Collects the selected entity types and resets several class variables in case this is not the first search
    getPropertiesToDisplay(loadingQuery = false) {
        this.resetQueryVariables(true);
        // -----------------------------------
        // -----------------------------------
        if (!loadingQuery) {
            this.Query.includedProperties = {};
            this.Query.filterProperties = {};
        }
        // Push the baseTableEntType to the beginning of the array and the rest of them after it
        // This way, in Step 2, the first EntType displayed will always be the baseTableEntType
        this.Query.selectedEntityTypes.push(this.entTypes.find(entType => entType.isBaseTable));
        this.Query.selectedEntityTypes.push(...this.entTypes.filter(entType => entType.checked && !entType.isBaseTable));
        // Get the properties that are fk_properties for the base table's "prop_ref" properties
        const fkPropsBaseTable = this.getFKPropertiesBaseTable();
        for (const entityType of this.Query.selectedEntityTypes) {
            entityType.displayProperties = this.getEntityTypeDisplayProperties(entityType, fkPropsBaseTable);
        }
    }

    getEntityTypeDisplayProperties(entityType, fkPropsBaseTable) {
        // For entTypes that aren't baseTable -> In the Step 2 properties' dropdowns [include and filter properties]
        // Only display properties that aren't fk_properties for the base table's "prop_ref" properties
        // So we don't have the same property in 2 different dropdowns [ex: Rental - Car Type & Car Type - Type]
        let displayProperties;
        if (entityType.isBaseTable) {
            // The EntType that is marked as BaseTable will display all of its properties
            displayProperties = entityType.properties;
        } else {
            const availableProperties = [];
            for (const property of entityType.properties) {
                // Check if the property is inside the base table's fk_properties AND
                // Check if the properties of type "prop_ref" have its fk_property inside the base table's fk_properties
                if (!fkPropsBaseTable.includes(property.id) && !fkPropsBaseTable.includes(property.fk_property_id)) {
                    availableProperties.push(property);
                }
            }
            displayProperties = availableProperties;
        }
        return displayProperties;
    }

    resetQueryVariables(loadingQuery = false) {
        if (!loadingQuery) {
            this.Query.includedProperties = {};
            this.Query.filterProperties = {};
        }
        this.Query.selectedEntityTypes = [];
        this.showStep3Component = false;
        this.showQueryResults = false;
    }

    getFKPropertiesBaseTable() {
        const baseTableEntType = this.entTypes.find(entType => entType.isBaseTable);
        const fkProps = [];
        for (const property of baseTableEntType.properties) {
            if (property.value_type === 'prop_ref' && property.fk_property_id) {
                fkProps.push(property.fk_property_id);
            }
        }
        return fkProps;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    // ////////////////////////////// STEP 3 -> SPECIFY FILTERS //////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////

    setupBuilder() {
        this.resetQueryBuilder();
        this.verifyErrors();
        if (!this.messageStep3) {
            this.setupBuilderConfig();
        }
    }

    resetQueryBuilder() {
        this.Query.queryBuilder = { condition: 'and', rules: [] };
        this.queryResults = [];
        this.queryHeader = [];
        this.showStep3Component = true;
        this.showQueryBuilder = false;
        this.showQueryResults = false;
        this.builderConfig = { fields: {} };
        this.parameters = [];
        this.resultsAvailableInRestAPIInterface = false;
    }

    verifyErrors() {
        this.messageStep3 = null;
        // Check if every selected entType has selected 'Included Properties'
        this.checkAllSelectedEntTypesHaveIncludedProperties();
        // Do the following verification below if there were no errors found in the check above
        if (!this.messageStep3) {
            // Check if the 'included Properties' of associatedEntTypes have referenced properties
            // in the 'included Properties' of the BaseTable
            this.checkConnectionBetweenEntTypesProperties();
        }
    }

    // Check if every selected entType has selected 'Included Properties'
    checkAllSelectedEntTypesHaveIncludedProperties() {
        let allSelectedEntTypesHaveIncludedProperties = true;
        for (const selectedEntType of this.Query.selectedEntityTypes) {
            // Check if every selected entType has selected 'Included Properties'
            if (!this.Query.includedProperties[selectedEntType.id] || !this.Query.includedProperties[selectedEntType.id].length) {
                this.messageStep3 = this.messageNoIncProps;
                allSelectedEntTypesHaveIncludedProperties = false;
                break;
            }
        }
        return allSelectedEntTypesHaveIncludedProperties;
    }

    // Check if the 'included Properties' of associatedEntTypes have referenced properties in the 'included Properties' of the BaseTable
    checkConnectionBetweenEntTypesProperties() {
        let hasConnection = true;
        const baseTable = this.entTypes.find(entType => entType.isBaseTable);
        for (const selectedEntType of this.Query.selectedEntityTypes) {
            // When a property with no connection is found, stop analysing other properties
            if (selectedEntType.id !== baseTable.id) {
                for (const selectedProperty of this.Query.includedProperties[selectedEntType.id]) {
                    hasConnection = !!baseTable.properties.filter(
                        property => this.Query.includedProperties[baseTable.id].includes(property.id) &&
                            property.value_type === 'prop_ref' && property.fk_entity_type_id === selectedEntType.id
                    ).length;
                    // If a property with no connection is found, there's no need to analyse more properties
                    if (!hasConnection) {
                        this.messageStep3 = this.messageNoConnectionProps;
                        break;
                    }
                }
            }
        }
        return hasConnection;
    }

    // Implements dynamically the query builder config from the properties selected in step 2 and replaces
    // the values set up in the function below (setExpressionParam)
    setupBuilderConfig() {
        let hasFilters = false;
        for (const [entTypeId, properties] of Object.entries(this.Query.filterProperties)) {
            const propertiesArray: any = properties;
            for (const propertyId of propertiesArray) {
                hasFilters = true;
                const entType = this.entTypes.find(item => item.id === Number(entTypeId));
                const property = entType.properties.find(item => item.id === Number(propertyId));
                let builderField: Field;
                if (property.value_type === 'enum' || property.value_type === 'prop_ref') {
                    builderField = {name: property.name, type: this.getBuilderValueType(property.value_type),
                        options: this.getPropertyValues(property), value: propertyId, entity: entTypeId,
                        operators: this.getBuilderOperators(property.value_type)};
                    builderField.defaultValue = builderField.options.length ? builderField.options[0].value : null;
                } else {
                    builderField = {name: property.name, type: this.getBuilderValueType(property.value_type),
                        value: propertyId, operators: this.getBuilderOperators(property.value_type),
                        entity: entTypeId };
                    builderField.defaultValue = builderField.type === 'boolean' ? false : null;
                }
                this.builderConfig.fields[propertyId] = builderField;
            }
        }
        this.showQueryBuilder = hasFilters;
    }

    // Get the possible queryBuilder's operators for each property's valueType
    getBuilderOperators(valType): string[] {
        switch (valType) {
            case 'int':
            case 'double':
            case 'date':
            case 'time':
                return ['=', '!=', '<', '<=', '>', '>='];
            case 'enum':
            case 'prop_ref':
                return ['=', '!=', 'in', 'not in'];
            case 'text':
                return ['=', '!=', 'contains'];
            case 'boolean':
                return ['='];
            default:
                return null;
        }
    }

    // Get the queryBuilder's valueType depending on the property's valueType
    getBuilderValueType(valType): string {
        switch (valType) {
            case 'int':
            case 'double':
                return 'number';
            case 'text':
                return 'string';
            case 'bool':
                return 'boolean';
            case 'prop_ref':
            case 'enum':
                return 'category';
            case 'date':
                return 'date';
            case 'time':
                return 'time';
            default:
                return null;
        }
    }

    // Get the possible Property Values, formatted as Option[], to present in the queryBuilder
    getPropertyValues(property) {
        const builderOptions: Option[] = [];
        for (const value of property.values) {
            const builderOption: Option = {name: value.value, value: value.id};
            builderOptions.push(builderOption);
        }
        return builderOptions;
    }

    // ****************** Query Builder - Parameters ******************

    addParameterToQuery() {
        this.parameters = [];
        this.readQuery(this.Query.queryBuilder.rules, true);
        this.loadingQuery = false;
    }

    readQuery(obj: any, addParameters, pad: number = 0, rulesetNumber: number = 1) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (obj[key].hasOwnProperty('field')) {
                    let ruleNumber = this.parameters.length + 1;
                    if (this.loadingQuery || !addParameters) {
                        ruleNumber = obj[key].ruleNumber;
                    }
                    obj[key].isParameter = this.verifyIfIsParameter(ruleNumber, obj[key].isParameter);
                    obj[key].ruleNumber = ruleNumber;
                    if (addParameters) {
                        let defaultValue = '';
                        if (obj[key].hasOwnProperty('value')) {
                            defaultValue = obj[key].value;
                        }
                        const parameterName = this.builderConfig.fields[obj[key].field].name + ' - Rule '
                            + ruleNumber;
                        const parameter = {name: parameterName, checked: obj[key].isParameter, rule: ruleNumber,
                            ruleSet: rulesetNumber, padding: pad, value: defaultValue};
                        this.parameters.push(parameter);
                    }
                }
                if (obj[key].hasOwnProperty('condition')) {
                    this.readQuery(obj[key], addParameters, pad + 1, rulesetNumber + 1);
                } else {
                    this.readQuery(obj[key], addParameters, pad, rulesetNumber);
                }
            }
        }
    }

    verifyIfIsParameter(ruleNumber, oldValue: boolean = false) {
        let isParameter = false;
        if (!this.loadingQuery) {
            this.parameters.forEach((param) => {
                if (param.checked && param.rule === ruleNumber) {
                    isParameter = true;
                }
            });
        } else {
            isParameter = oldValue;
        }
        return isParameter;
    }

    // ****************** Parameter Checkbox ******************

    organizeParameterCheckboxes() {
        this.parameters.forEach((param, index) => {
            // ------------------
            let pad: number;
            let previousParameter = 0;
            if (index !== 0) { previousParameter = index - 1; }
            const differenceActualPadAndPreviousPad = param.padding - this.parameters[previousParameter].padding;
            const differencePreviousPadAndActualPad = this.parameters[previousParameter].padding - param.padding;
            const differenceActualRulesetAndPreviousRuleset = param.ruleSet - this.parameters[previousParameter].ruleSet;
            // ------------------
            switch (true) {
                case (differenceActualPadAndPreviousPad === 0):
                    switch (param.rule) {
                        case 1:
                            if (param.padding === 0) { pad = 9; } else { pad = 10 + (45 * param.padding); }
                            break;
                        default:
                            if (param.ruleSet === this.parameters[previousParameter].ruleSet) { pad = 14; } else {
                                pad = 18 + (48 * differenceActualRulesetAndPreviousRuleset); }
                    }
                    break;
                case (differenceActualPadAndPreviousPad > 0):
                    pad = 14 + (48 * differenceActualRulesetAndPreviousRuleset);
                    break;
                default:
                    if (param.ruleSet === this.parameters[previousParameter].ruleSet) {
                        pad = 9 + (11 * differencePreviousPadAndActualPad);
                    } else {
                        pad = (9 + (11 * differencePreviousPadAndActualPad)) + (16 + (45 * differenceActualRulesetAndPreviousRuleset));
                    }
            }
            document.getElementById('ParameterColumn' + index).style.paddingTop = pad + 'px';
        });
    }

    toggleParameterCheckbox() {
        this.parameters.forEach((param) => {
            if (param.checked) {
                param.disabled = false;
            }
        });
        this.readQuery(this.Query.queryBuilder.rules, false);
    }

    // ****************** Save and update Query ******************

    saveQuery() {
        console.log('query to save', this.Query);
        this.queryApi.createQuery(this.Query).subscribe((data: any) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('DYNAMIC-SEARCH.SUCCESS.SAVE-QUERY'));
            } else {
                this.alertToast.showError(this.translate.instant('DYNAMIC-SEARCH.ERROR.SAVE-QUERY'));
            }
        });
    }

    updateQuery() {
        console.log('query to update', this.Query);
        this.queryApi.updateQuery(this.Query).subscribe((data: any) => {
            if (data) {
                this.initiate();
                this.alertToast.showSuccess(this.translate.instant('DYNAMIC-SEARCH.SUCCESS.UPDATE-QUERY'));
            } else {
                this.alertToast.showError(this.translate.instant('DYNAMIC-SEARCH.ERROR.UPDATE-QUERY'));
            }
        });
    }

    // ****************** Rest Api ******************

    openRestApiModal() {
        this.Query.parameters = this.parameters;
        const modalRef = this.modalService.show(ModalDynamicRestApiComponent, {class: 'modal-lg', initialState: this.Query});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            this.resultsAvailableInRestAPIInterface = receivedEntry === 'SUCCESS';
        });
    }

    // /////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////// STEP 4 -> LOAD QUERY RESULTS //////////////////////////
    // /////////////////////////////////////////////////////////////////////////////////

    loadResults() {
        this.restDynSearchApi.getQueryResults(this.Query).subscribe((data: any) => {
            this.queryHeader = data.header;
            this.queryResults = Object.values(data.resultRows);
            this.showQueryResults = true;
        });
    }

    // /////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////// EXPORT QUERY RESULTS AS XLSX //////////////////////////
    // /////////////////////////////////////////////////////////////////////////////////

    exportAsXLSX(): void {
        const json: any = [];
        for (const row of this.queryResults) {
            const pushedItems: { [id: string]: any; } = {};
            for (const [index, header] of this.queryHeader.entries()) {
                pushedItems[header] = row[index];
            }
            json.push(pushedItems);
        }
        this.exportAsExcelFile(json, 'Results');
    }

    exportAsExcelFile(json: any[], excelFileName: string): void {
        const header = Object.keys(json[0]);
        const worksheetColumns = [];
        for (let i = 0; i < header.length; i++) {
            let maxLength = 0;
            for (const k of json) {
                const rowValues = Object.values(k);
                const aux = rowValues[i].toString().length + 2;
                if (aux > maxLength) { maxLength = aux; }
            }
            if (header[i].length + 2 > maxLength) { maxLength = header[i].length + 2; }
            worksheetColumns.push({ wch: maxLength });
            maxLength = 0;
        }
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        worksheet['!cols'] = worksheetColumns;
        const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
}
