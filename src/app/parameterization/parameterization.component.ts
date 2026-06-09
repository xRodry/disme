/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import {GridOptions, ValueFormatterParams, ValueGetterParams} from 'ag-grid-community';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalProcessTypeComponent} from '../modal-processtype/modal-processtype.component';
import {ProcessTypeApiService} from '../shared/rest-api/processtype-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {AgGridTranslateService} from '../shared/common/ag-grid-translate.service';
import {TranslateService} from '@ngx-translate/core';
import {ProcessTypeColorCustomComponent} from '../modal-processtype/processtype_color.component';
import {Token} from '../shared/rest-api/token';
import {TransactionTypeApiService} from '../shared/rest-api/transaction-type-api.service';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';
import {PropertyApiService} from '../shared/rest-api/property-api.service';
import {ParameterizationCellCustomComponent} from './parameterization_cell.component';
import {RoleApiService} from '../shared/rest-api/role-api.service';
import {ModalTransactionTypeComponent} from '../modal-transaction-type/modal-transaction-type.component';
import {ModalEntityTypeComponent} from '../modal-entity-type/modal-entity-type.component';
import {ModalPropertyComponent} from '../modal-property/modal-property.component';
import {PropUnitTypeApiService} from '../shared/rest-api/prop-unit-type-api.service';
import {ModalPropUnitTypeComponent} from '../modal-prop-unit-type/modal-prop-unit-type.component';
import {ModalRoleComponent} from '../modal-role/modal-role.component';
import {RoleInitiatesTransactionApiService} from '../shared/rest-api/role-initiates-transaction-api.service';
import {RoleHasUserApiService} from '../shared/rest-api/role-has-user-api.service';
import {ModalRoleInitiatesTransactionComponent} from '../modal-role-initiates-transaction/modal-role-initiates-transaction.component';
import {ModalRoleHasUserComponent} from '../modal-role-has-user/modal-role-has-user.component';
// tslint:disable-next-line:max-line-length
import {ModalParameterizationTranslationComponent} from '../modal-parameterization-translation/modal-parameterization-translation.component';
import {UserApiService} from '../shared/rest-api/user-api.service';
import {ModalNewUserComponent} from '../modal-new-user/modal-new-user.component';
import {ModalLanguageComponent} from '../modal-language/modal-language.component';
import {LanguageApiService} from '../shared/rest-api/language-api.service';
import {ConstantApiService} from '../shared/rest-api/constant-api.service';
import {ModalConstantComponent} from '../modal-constant/modal-constant.component';
import {ProcessDetailsApiService} from '../shared/rest-api/processDetails-api.service';
import {WaitingLinkApiService} from '../shared/rest-api/waiting-link-api.service';
import {ModalProcessDetailsComponent} from '../modal-process-details/modal-process-details.component';
import {ModalWaitingLinkComponent} from '../modal-waiting-link/modal-waiting-link.component';
import {ModalValueComponent} from '../modal-value/modal-value.component';
import {ValueApiService} from '../shared/rest-api/value-api.service';
import {ModalProcessDiagramComponent} from "../modal-process-diagram/modal-process-diagram.component";
import {ModalFactDiagramComponent} from "../modal-fact-diagram/modal-fact-diagram.component";

@Component({
    selector: 'app-parameterization',
    templateUrl: './parameterization.component.html',
    styleUrls: ['./parameterization.component.css'],
    providers: [ModalProcessTypeComponent, ProcessTypeColorCustomComponent]
})

export class ParameterizationComponent implements OnInit {

    public gridOptions: GridOptions;

    public languageColumnDefs: any = [];
    public usersColumnDefs: any = [];
    public roleColumnDefs: any = [];
    public rolesInitiateTransactionTypeColumnDefs: any = [];
    public rolesHaveUsersColumnDefs: any = [];
    public processTypeColumnDefs: any = [];
    public processDetailsColumnDefs: any = [];
    public transactionTypeColumnDefs: any = [];
    public entityTypeColumnDefs: any = [];
    public propertyColumnDefs: any = [];
    public propUnitTypeColumnDefs: any = [];
    public constantColumnDefs: any = [];
    public waitingLinkColumnDefs: any = [];
    public referencedPropertyColumnDefs: any = [];
    public referencedPropertyValues: any = [];

    public languages: any = [];
    public users: any = [];
    public roles: any = [];
    public roleInitiatesTransactionTypes: any = [];
    public roleHasUsers: any = [];
    public processTypes: any = [];
    public processDetails: any = [];
    public transactionTypes: any = [];
    public entityTypes: any = [];
    public properties: any = [];
    public propUnitTypes: any = [];
    public constants: any = [];
    public waitingLinks: any = [];
    public referencedProperties: any = [];
    public selectedReferencedProperty: number;

    public tablesToShow: any = [];

    private languageAbbrv;

    constructor(
        private modalService: BsModalService,
        private modal: ModalProcessTypeComponent,
        private restLanguageApi: LanguageApiService,
        private restUsersApi: UserApiService,
        private restRoleApi: RoleApiService,
        private restRoleInitiatesTransactionApi: RoleInitiatesTransactionApiService,
        private restRoleHasUserApi: RoleHasUserApiService,
        private restProcessTypeApi: ProcessTypeApiService,
        private restProcessDetailApi: ProcessDetailsApiService,
        private restTransactionTypeApi: TransactionTypeApiService,
        private restEntityTypeApi: EnttypeApiService,
        private restPropertyApi: PropertyApiService,
        private restPropUnitTypeApi: PropUnitTypeApiService,
        private restValueApi: ValueApiService,
        private restConstantApi: ConstantApiService,
        private restWaitingLinkApi: WaitingLinkApiService,
        private alertToast: AlertToastService,
        private agGridTranslate: AgGridTranslateService,
        public translate: TranslateService
    ) { }

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        // Load the tables' configuration data
        this.loadComponentData();
        // Load the data needed for the tables displayed in the component
        this.loadParameterizationData();
    }

    loadComponentData() {
        this.gridOptions = {
            context: {
                ProcessTypeColorCustomComponent: this.processTypes
            },
            localeText: this.agGridTranslate.localeText(this.languageAbbrv),
            defaultColDef: {
                resizable: true,
                wrapText: true,
                autoHeight: true,
            }
        } as GridOptions;

        this.languageColumnDefs = this.languageTableColumns();
        this.usersColumnDefs = this.usersTableColumns();
        this.roleColumnDefs = this.roleTableColumns();
        this.rolesInitiateTransactionTypeColumnDefs = this.rolesInitiateTransactionTypesColumnDefs();
        this.rolesHaveUsersColumnDefs = this.rolesHaveUsersTableColumns();
        this.processTypeColumnDefs = this.processTypeTableColumns();
        this.processDetailsColumnDefs = this.processDetailsTableColumns();
        this.transactionTypeColumnDefs = this.transactionTypeTableColumns();
        this.entityTypeColumnDefs = this.entityTypeTableColumns();
        this.propertyColumnDefs = this.propertyTableColumns();
        this.propUnitTypeColumnDefs = this.propUnitTypeTableColumns();
        this.constantColumnDefs = this.constantTableColumns();
        this.waitingLinkColumnDefs = this.waitingLinkTableColumns();
        this.referencedPropertyColumnDefs = this.referencedPropertyTableColumns();
    }

    loadParameterizationData() {
        this.restLanguageApi.getLanguages().subscribe((data: {}) => {
            this.languages = data;
            this.setOriginTable(this.languages, 'language');
        });
        this.restUsersApi.getUsers().subscribe((data: {}) => {
            this.users = data;
            this.setOriginTable(this.users, 'users');
        });
        this.restRoleApi.getRoles().subscribe((data: {}) => {
            this.roles = data;
            this.setOriginTable(this.roles, 'role');
        });
        this.restRoleInitiatesTransactionApi.getRoleInitiatesTransactions().subscribe((data: {}) => {
            this.roleInitiatesTransactionTypes = data;
            this.setOriginTable(this.roleInitiatesTransactionTypes, 'roleInitiatesTransaction');
        });
        this.restRoleHasUserApi.getRoleHasUsers().subscribe((data: {}) => {
            this.roleHasUsers = data;
            this.setOriginTable(this.roleHasUsers, 'roleHasUser');
        });
        this.restProcessTypeApi.getProcessTypes().subscribe((data: {}) => {
            this.processTypes = data;
            this.setOriginTable(this.processTypes, 'processType');
        });
        this.restProcessDetailApi.getProcessesDetails().subscribe((data: {}) => {
            this.processDetails = data;
            this.setOriginTable(this.processDetails, 'processDetails');
        });
        this.restTransactionTypeApi.getTransactionTypes().subscribe((data: {}) => {
            this.transactionTypes = data;
            this.setOriginTable(this.transactionTypes, 'transactionType');
        });
        this.restEntityTypeApi.getEntityTypes().subscribe((data: {}) => {
            this.entityTypes = data;
            this.setOriginTable(this.entityTypes, 'entityType');
        });
        this.restPropertyApi.getProperties().subscribe((data: {}) => {
            this.properties = data;
            this.setOriginTable(this.properties, 'property');
        });
        this.restPropUnitTypeApi.getPropUnitTypes().subscribe((data: {}) => {
            this.propUnitTypes = data;
            this.setOriginTable(this.propUnitTypes, 'propUnitType');
        });
        this.restConstantApi.getConstants().subscribe((data: {}) => {
            this.constants = data;
            this.setOriginTable(this.constants, 'constant');
        });
        this.restWaitingLinkApi.getWaitingLinks().subscribe((data: {}) => {
            this.waitingLinks = data;
            this.setOriginTable(this.waitingLinks, 'waitingLink');
        });
        this.restPropertyApi.getReferencedPropertiesWithCreatedValues().subscribe((data) => {
            this.referencedProperties = data;
            this.selectedReferencedProperty = this.referencedProperties[0] ? this.referencedProperties[0].property_id : null;
            this.getSelectedReferencedPropertyValues();
        });
    }

    getSelectedReferencedPropertyValues() {
        const referencedProperty = this.referencedProperties.find(
            (property) => property.property_id === this.selectedReferencedProperty
        );
        this.referencedPropertyValues = referencedProperty ? [...referencedProperty.propertyValues] : [];
        this.setOriginTable(this.referencedPropertyValues, 'referencedPropertyValue');
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

    setOriginTable(data, originTable) {
        for (const instance of data) {
            instance.originTable = originTable;
        }
    }

    openLanguageModal(params = {}) {
        const modalRef = this.modalService.show(ModalLanguageComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openUsersModal(params = {}) {
        const modalRef = this.modalService.show(ModalNewUserComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openRolesModal(params = {}) {
        const modalRef = this.modalService.show(ModalRoleComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openRoleInitiatesTransactionModal(params = {}) {
        // @ts-ignore
        params.attributedRoleInitiatesTransaction = this.roleInitiatesTransactionTypes;
        const modalRef = this.modalService.show(ModalRoleInitiatesTransactionComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openRoleHasUserModal(params = {}) {
        // @ts-ignore
        params.attributedUserRoles = this.roleHasUsers;
        const modalRef = this.modalService.show(ModalRoleHasUserComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openProcessTypeModal(params = {}) {
        const modalRef = this.modalService.show(ModalProcessTypeComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openProcessDetailsModal(params = {}) {
        // @ts-ignore
        params.attributedProcessDetails = this.processDetails;
        const modalRef = this.modalService.show(ModalProcessDetailsComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openTransactionTypeModal(params = {}) {
        const modalRef = this.modalService.show(ModalTransactionTypeComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openEntityTypeModal(params = {}) {
        const modalRef = this.modalService.show(ModalEntityTypeComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openPropertyModal(params = {}) {
        const modalRef = this.modalService.show(ModalPropertyComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openPropUnitTypeModal(params = {}) {
        const modalRef = this.modalService.show(ModalPropUnitTypeComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openReferencedPropertyValueModal(params = {}) {
        const modalRef = this.modalService.show(ModalValueComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openConstantModal(params = {}) {
        const modalRef = this.modalService.show(ModalConstantComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openWaitingLinkModal(params = {}) {
        const modalRef = this.modalService.show(ModalWaitingLinkComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    openProcessDiagramModal(params = {}) {
        const modalRef = this.modalService.show(ModalProcessDiagramComponent, {class: 'modal-lg'});
    }

    openFactDiagramModal(params = {}) {
        const modalRef = this.modalService.show(ModalFactDiagramComponent, {class: 'modal-lg'});
    }

    deleteAllTestData() {
        if (window.confirm(this.translate.instant('PARAMETERIZATION.RESET-DATA.CONFIRMATION'))) {
            if (window.confirm(this.translate.instant('PARAMETERIZATION.RESET-DATA.DOUBLE-CONFIRMATION'))) {
                this.restValueApi.deleteAllTestData().subscribe(data => {
                    this.loadParameterizationData();
                    this.alertToast.showSuccess(this.translate.instant('PARAMETERIZATION.RESET-DATA.SUCCESS'));
                }, error => {
                    this.alertToast.showError(this.translate.instant('PARAMETERIZATION.RESET-DATA.ERROR'));
                });
            }
        }
    }

    deleteUser(id) {
        if (window.confirm(this.translate.instant('USERS-MODAL.DELETE.CONFIRMATION'))) {
            this.restUsersApi.deleteUser(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('USERS-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('USERS-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteLanguage(id) {
        if (window.confirm(this.translate.instant('LANGUAGE-MODAL.DELETE.CONFIRMATION'))) {
            this.restLanguageApi.deleteLanguage(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('LANGUAGE-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('LANGUAGE-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteRole(id) {
        if (window.confirm(this.translate.instant('ROLES-MODAL.DELETE.CONFIRMATION'))) {
            this.restRoleApi.deleteRole(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('ROLES-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLES-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteRoleInitiatesTransaction(userId, transactionTypeId) {
        if (window.confirm(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.DELETE.CONFIRMATION'))) {
            this.restRoleInitiatesTransactionApi.deleteRoleInitiatesTransaction(userId, transactionTypeId).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLE-INITIATES-TRANSACTIONS-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteRoleHasUser(roleId, userId) {
        if (window.confirm(this.translate.instant('ROLE-HAS-USERS-MODAL.DELETE.CONFIRMATION'))) {
            this.restRoleHasUserApi.deleteRoleHasUser(roleId, userId).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('ROLE-HAS-USERS-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('ROLE-HAS-USERS-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteProcessType(id) {
        if (window.confirm(this.translate.instant('PROCESS-TYPES-MODAL.DELETE.CONFIRMATION'))) {
            this.restProcessTypeApi.deleteProcessType(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('PROCESS-TYPES-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('PROCESS-TYPES-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteProcessDetail(processTypeId, propertyId) {
        if (window.confirm(this.translate.instant('PROCESS-DETAILS-MODAL.DELETE.CONFIRMATION'))) {
            this.restProcessDetailApi.deleteProcessDetail(processTypeId, propertyId).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('PROCESS-DETAILS-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('PROCESS-DETAILS-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteTransactionType(id) {
        if (window.confirm(this.translate.instant('TRANSACTION-TYPES-MODAL.DELETE.CONFIRMATION'))) {
            this.restTransactionTypeApi.deleteTransactionType(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('TRANSACTION-TYPES-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('TRANSACTION-TYPES-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteEntityType(id) {
        if (window.confirm(this.translate.instant('ENTITY-TYPES-MODAL.DELETE.CONFIRMATION'))) {
            this.restEntityTypeApi.deleteEntityType(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('ENTITY-TYPES-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('ENTITY-TYPES-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteProperty(id) {
        if (window.confirm(this.translate.instant('PROPERTY-MODAL.DELETE.CONFIRMATION'))) {
            this.restPropertyApi.deleteProperty(id).subscribe(data => {
                if (data.inUsage) {
                    if (data.usageIn === 'actionsAndQueries') {
                        this.alertToast.showWarning(this.translate.instant('PROPERTY-MODAL.DELETE.IN-USAGE-ACTIONS-QUERIES'));
                    } else if (data.usageIn === 'actions') {
                        this.alertToast.showWarning(this.translate.instant('PROPERTY-MODAL.DELETE.IN-USAGE-ACTIONS'));
                    } else if (data.usageIn === 'queries') {
                        this.alertToast.showWarning(this.translate.instant('PROPERTY-MODAL.DELETE.IN-USAGE-QUERIES'));
                    }
                } else {
                    this.loadParameterizationData();
                    this.alertToast.showSuccess(this.translate.instant('PROPERTY-MODAL.DELETE.SUCCESS'));
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROPERTY-MODAL.DELETE.ERROR'));
            });
        }
    }

    deletePropUnitType(id) {
        if (window.confirm(this.translate.instant('PROP-UNIT-TYPES-MODAL.DELETE.CONFIRMATION'))) {
            this.restPropUnitTypeApi.deletePropUnitType(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('PROP-UNIT-TYPES-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('PROP-UNIT-TYPES-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteReferencedPropertyValue(id) {
        if (window.confirm(this.translate.instant('VALUE-MODAL.DELETE.CONFIRMATION'))) {
            this.restValueApi.deleteValue(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('VALUE-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('VALUE-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteConstant(id) {
        if (window.confirm(this.translate.instant('CONSTANTS-MODAL.DELETE.CONFIRMATION'))) {
            this.restConstantApi.deleteConstant(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('CONSTANTS-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('CONSTANTS-MODAL.DELETE.ERROR'));
            });
        }
    }

    deleteWaitingLink(id) {
        if (window.confirm(this.translate.instant('WAITING-LINKS-MODAL.DELETE.CONFIRMATION'))) {
            this.restWaitingLinkApi.deleteWaitingLink(id).subscribe(data => {
                this.loadParameterizationData();
                this.alertToast.showSuccess(this.translate.instant('WAITING-LINKS-MODAL.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('WAITING-LINKS-MODAL.DELETE.ERROR'));
            });
        }
    }

    openTranslationModal(params = {}) {
        const modalRef = this.modalService.show(ModalParameterizationTranslationComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                this.loadParameterizationData();
            }
        });
    }

    booleanFormatter(params: ValueFormatterParams) {
        return params.value === 1 ? this.translate.instant('PARAMETERIZATION.BOOLEAN-FORMATTER.TRUE') :
            this.translate.instant('PARAMETERIZATION.BOOLEAN-FORMATTER.FALSE');
    }

    languageAbbrvFormatter(params: ValueFormatterParams) {
        return params.value ? params.value.toUpperCase() : null;
    }

    stateFormatter(params: ValueFormatterParams) {
        const dbValueType = params.value.toUpperCase();
        return this.translate.instant('PROPERTY-MODAL.SELECT-STATE.OPTIONS.' + dbValueType);
    }

    propertyValueTypeFormatter(params: ValueFormatterParams) {
        const dbValueType = params.value.toUpperCase().replace('_', '-');
        return this.translate.instant('PROPERTY-MODAL.SELECT-VALUE-TYPE.OPTIONS.' + dbValueType);
    }

    waitingTransactionStepGetter(params: ValueGetterParams) {
        return params.data.waiting_t_name + ' ' +  this.translate.instant('PARAMETERIZATION.WAITING-LINK.TABLE.IS') +
            ' ' + params.data.waiting_act_name;
    }

    waitedTransactionStepGetter(params: ValueGetterParams) {
        return params.data.waited_t_name + ' ' +  this.translate.instant('PARAMETERIZATION.WAITING-LINK.TABLE.HAS-BEEN') +
            ' ' + params.data.waited_act_name;
    }

    referencedByProperties(referencedProperty) {
        let referencedBy = '';
        for (const referencedByProperty of referencedProperty.referencedBy) {
            const entTypeAndPropertyName = referencedByProperty.ent_type_name + ' → ' + referencedByProperty.name;
            if (referencedBy === '') {
                referencedBy += entTypeAndPropertyName;
            } else {
                referencedBy += ' | ' + entTypeAndPropertyName;
            }
        }
        return referencedBy;
    }

    private languageTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.LANGUAGE.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.LANGUAGE.TABLE.ABBRV'),
                field: 'abbrv',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.LANGUAGE.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.LANGUAGE.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.LANGUAGE.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
        ];
    }

    private usersTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.EMAIL'),
                field: 'email',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.NIF'),
                field: 'nif',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.USER-NAME'),
                field: 'user_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.USERS.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private roleTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private rolesInitiateTransactionTypesColumnDefs() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLE-INITIATES-TRANSACTION-TYPE.TABLE.TRANSACTION-TYPE'),
                field: 'transaction_type_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLE-INITIATES-TRANSACTION-TYPE.TABLE.ROLE'),
                field: 'role_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLE-INITIATES-TRANSACTION-TYPE.TABLE.OWN-USER-ACCESS-ONLY'),
                field: 'own_user_access_only',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLE-INITIATES-TRANSACTION-TYPE.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLE-INITIATES-TRANSACTION-TYPE.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            }
        ];
    }

    private rolesHaveUsersTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES-HAVE-USERS.TABLE.USER'),
                field: 'user_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES-HAVE-USERS.TABLE.ROLE'),
                field: 'role_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES-HAVE-USERS.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ROLES-HAVE-USERS.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            }
        ];
    }

    private processTypeTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-TYPES.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-TYPES.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.stateFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-TYPES.TABLE.COLOR'),
                cellRendererFramework: ProcessTypeColorCustomComponent,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-TYPES.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-TYPES.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-TYPES.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private processDetailsTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-DETAILS.TABLE.PROCESS-TYPE'),
                field: 'process_type_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-DETAILS.TABLE.PROPERTY'),
                field: 'property_name',
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-DETAILS.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROCESS-DETAILS.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            }
        ];
    }

    private transactionTypeTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left',
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75,
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.T-NAME'),
                field: 't_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.stateFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.PROCESS-TYPE'),
                field: 'process_type_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.EXECUTER-ROLE'),
                field: 'executer_role_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.OWN-USER-ACCESS-ONLY'),
                field: 'own_user_access_only',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.TRANSACTION-TYPES.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private entityTypeTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.ID-NAME'),
                field: 'id_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.stateFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.TRANSACTION-TYPE'),
                field: 'transaction_type_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.NR-ENTITIES'),
                field: 'last_internal_id',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.HAS-MANY'),
                field: 'has_many',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.AUTO-GENERATED'),
                field: 'auto_generated',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.EXTERNAL'),
                field: 'external',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.USER-DETAILS'),
                field: 'user_details',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.ENTITY-TYPES.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private propertyTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.stateFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.ENT-TYPE'),
                field: 'ent_type_name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.VALUE-TYPE'),
                field: 'value_type',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.propertyValueTypeFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.REQUIRES-TRANSLATION'),
                field: 'requires_translation',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.EDITABLE'),
                field: 'editable',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.SOFT-DELETE'),
                field: 'soft_delete',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.IS-A'),
                field: 'is_a',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.IS-DEPENDENT'),
                field: 'is_dependent',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.MULTIPLE-VALUES'),
                field: 'multiple_values',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.booleanFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private propUnitTypeTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 100,
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROP-UNIT-TYPES.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROP-UNIT-TYPES.TABLE.ABBRV'),
                field: 'abbrv',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROP-UNIT-TYPES.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
                valueFormatter: this.stateFormatter.bind(this)
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROP-UNIT-TYPES.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROP-UNIT-TYPES.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROP-UNIT-TYPES.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private constantTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 100,
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.CONSTANTS.TABLE.NAME'),
                field: 'name',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.CONSTANTS.TABLE.VALUE-TYPE'),
                field: 'value_type',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.CONSTANTS.TABLE.VALUE'),
                field: 'value',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.CONSTANTS.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.CONSTANTS.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.CONSTANTS.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

    private waitingLinkTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: 'ID',
                field: 'id',
                sortable: true, filter: true,
                flex: 1,
                minWidth: 75
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.WAITING-LINK.TABLE.WAITING-TRANSACTION-STEP'),
                field: 'waiting_t_name&waiting_act_name',
                valueGetter: this.waitingTransactionStepGetter.bind(this),
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.WAITING-LINK.TABLE.WAITED-TRANSACTION-STEP'),
                field: 'waited_t_name&waited_act_name',
                valueGetter: this.waitedTransactionStepGetter.bind(this),
                sortable: true, filter: true,
                flex: 4,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.WAITING-LINK.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.WAITING-LINK.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            }
        ];
    }

    private referencedPropertyTableColumns() {
        return [
            {
                headerName: this.translate.instant('PARAMETERIZATION.TABLE-ACTIONS.TITLE'),
                field: 'edit',
                cellRendererFramework: ParameterizationCellCustomComponent,
                flex: 3,
                minWidth: 125,
                maxWidth: 150,
                pinned: 'left'
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.REFERENCED-PROPERTY-VALUES.TABLE.VALUE'),
                field: 'value',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100,
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.STATE'),
                field: 'state',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.UPDATED-AT'),
                field: 'updated_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.CREATED-AT'),
                field: 'created_at',
                sortable: true, filter: true,
                flex: 3,
                minWidth: 100
            },
            {
                headerName: this.translate.instant('PARAMETERIZATION.PROPERTY.TABLE.LANGUAGE'),
                field: 'language_abbrv',
                sortable: true, filter: true,
                flex: 2,
                minWidth: 100,
                valueFormatter: this.languageAbbrvFormatter
            }
        ];
    }

}
