import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {DynSearchApiService} from '../shared/rest-api/dyn-search-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-modal-dynamic-rest-api',
    templateUrl: './modal-dynamic-rest-api.component.html',
    styleUrls: ['./modal-dynamic-rest-api.component.css']
})
export class ModalDynamicRestApiComponent implements OnInit {
    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public urlForRestApi: any;
    public queryName: any;
    public auth: any;
    private defaultValues: any = [];
    public checkedParameters: any;
    public parametersForRestApi: any;
    private baseURL = 'http://127.0.0.1:8001/api/';
    public showMessageRestApi = false;
    public parameters: any = [];
    private Query: any = [];
    private success = false;
    public results: any = '';

    public myForm: any;

    constructor(
        public dynSearchApi: DynSearchApiService,
        public translate: TranslateService,
        private alertToast: AlertToastService,
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router
    ) {}

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        /*const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
          this.loadActorById(params.id);
        }*/
        this.Query = params;
        this.urlForRestApi = this.baseURL;
        this.queryName = '';
        this.auth = 'auth/dynamic/query/';
        this.parametersForRestApi = [];
        this.parameters = params.parameters;

        // Put checked parameters in the array
        this.checkedParameters = [];
        this.parameters.forEach((param) => {
            if (param.checked) {
                // param.disabled = false;
                this.checkedParameters.push(param);
            }
        });

        this.checkedParameters.forEach((parameter) => {
            let value = parameter.value;
            if (parameter.value === undefined) {
                value = '';
            }
            this.defaultValues.push(value);
            this.parametersForRestApi.push({parameter: parameter.name, parameterName: '', defaultValue: value});
        });

        // Form:
        this.myForm = this.getForm();
    }

    updateURL($event) {
        console.log($event);
        if ($event.hasOwnProperty('data')) {
            this.queryName = $event.data.query_action;
            if ($event.data.authorization === 'bearer_token') {
                this.auth = 'auth/dynamic/query/';
            } else {
                this.auth = 'dynamic/query/';
            }
            this.parametersForRestApi.forEach((parameter, index) => {
                const textField = 'param-' + index;
                parameter.parameterName = $event.data[textField];
            });


            this.defaultValues.forEach((value, index) => {
                const key = 'param-test-' + index as keyof typeof status;
                this.defaultValues[index] = $event.data[key];
            });
        }
        this.urlForRestApi = this.baseURL;
        this.urlForRestApi += this.auth;
        this.urlForRestApi += this.queryName;
        let first = true;
        this.parametersForRestApi.forEach((parameter, index) => {
            if (first) {
                this.urlForRestApi += '?' + parameter.parameterName + '=' + this.defaultValues[index];
                first = false;
            } else {
                this.urlForRestApi += '&' + parameter.parameterName + '=' + this.defaultValues[index];
            }
        });
        this.updateKeys();
        this.myForm.components[2].components[2].components[2].placeholder = this.results;
        console.log(this.myForm.components[2].components[2].components[2].placeholder);
    }

    updateKeys() {
        if (this.checkedParameters.length) {
            const column = this.myForm.components[2].components[2].components[0].columns[0].components;
            this.parametersForRestApi.forEach((parameter, index) => {
                index += 1;
                column[index].placeholder = parameter.parameterName;
            });
        }
    }

    onSubmit($event) {
        const queryParams = {includedProperties: this.Query.includedProperties,
            baseTableId: this.Query.base_ent_type_id, query: this.Query.queryBuilder, url: this.urlForRestApi,
            params: this.parameters};
        console.log(queryParams);
        this.dynSearchApi.testQueryResults(queryParams).subscribe((data: any) => {
            console.log(data);
            if (data !== undefined) {
                this.results = data[0];
                this.updateURL($event);
            }
        });
        this.updateURL($event);
    }

    verifyErrorsInsertURL() {
        let hasError = false;
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        this.parametersForRestApi.forEach((parameter, index) => {
            if (parameter.parameterName === '') {
                this.alertToast.showError('"Parameter Name ' + (index + 1) + '" field is not filled in!');
                hasError = true;
            } else if (format.test(parameter.parameterName)) {
                this.alertToast.showError('"Parameter Name ' + (index + 1) + '" cannot contain special characters!');
                hasError = true;
            }
            if (parameter.parameter === '') {
                this.alertToast.showError('"Parameter ' + (index + 1) + '" field is not filled in!');
                hasError = true;
            }
        });
        if (this.queryName === '') {
            this.alertToast.showError('The Query Action field is not filled in!');
            hasError = true;
        } else if (format.test(this.queryName)) {
            this.alertToast.showError('The Query Action name cannot contain special characters!');
            hasError = true;
        }
        if (this.checkedParameters.length !== this.parametersForRestApi.length) {
            this.alertToast.showError('Endpoint parameters missing!');
            hasError = true;
        }
        if (!hasError) {
            console.log('save url');
            this.insertURL();
        }
    }

    insertURL() {
        const data = {query: this.Query, queryName: this.queryName,
            parametersForRestApi: this.parametersForRestApi, parameters: this.parameters,
            auth: this.auth};
        console.log(data);
        this.dynSearchApi.saveURL(data).subscribe((response: any) => {
            console.log(response);
            if (response === 0) {
                this.alertToast.showError('Endpoint already exists!');
            } else {
                this.success = true;
                this.alertToast.showSuccess('Endpoint successfully saved!');
                this.showMessageRestApi = true;
            }
        });
    }

    closeModal() {
        if (this.success === true) {
            this.passEntry.emit('SUCCESS');
        } else {
            this.passEntry.emit('NO SUCCESS');
        }
        this.modalRef.hide();
    }

    getForm() {
        return {
            components: [
                {
                    label: 'Query Action',
                    placeholder: 'Query action',
                    tooltip: 'Do not use special characters',
                    applyMaskOn: 'change',
                    tableView: true,
                    validate: {
                        required: true
                    },
                    key: 'query_action',
                    type: 'textfield',
                    input: true,
                    labelWidth: 18
                },
                {
                    label: 'Description',
                    placeholder: 'Endpoint description',
                    applyMaskOn: 'change',
                    autoExpand: false,
                    tableView: true,
                    key: 'description',
                    type: 'textarea',
                    input: true
                },
                {
                    label: 'Parameters',
                    components: [
                        {
                            label: 'Parameters',
                            key: 'tab1',
                            components: [
                                this.getParameters()
                            ]
                        },
                        {
                            label: 'Header and Auth',
                            key: 'headerAndAuth',
                            components: [
                                {
                                    label: 'Authorization',
                                    widget: 'choicesjs',
                                    tableView: true,
                                    data: {
                                        values: [
                                            {
                                                label: 'None',
                                                value: 'none'
                                            },
                                            {
                                                label: 'Bearer Token',
                                                value: 'bearer_token'
                                            }
                                        ]
                                    },
                                    validate: {
                                        required: true
                                    },
                                    key: 'authorization',
                                    type: 'select',
                                    input: true,
                                    defaultValue: 'bearer_token'
                                }
                            ]
                        },
                        {
                            label: 'Test',
                            key: 'test',
                            components: [
                                this.getParametersToTest(),
                                {
                                    label: 'Test',
                                    action: 'submit',
                                    showValidations: false,
                                    disabled: false,
                                    tableView: false,
                                    key: 'test',
                                    type: 'button',
                                    input: true,
                                },
                                {
                                    label: 'Response Body',
                                    placeholder: '',
                                    applyMaskOn: 'change',
                                    hideLabel: false,
                                    disabled: false,
                                    tableView: true,
                                    redrawOn: 'data',
                                    allowCalculateOverride: true,
                                    key: 'response',
                                    type: 'textarea',
                                    input: true
                                }
                            ]
                        }
                    ],
                    key: 'parameters',
                    type: 'tabs',
                    input: false,
                    tableView: false
                },
            ]
        };
    }

    getParameters() {
        if (this.checkedParameters.length) {
            return {
                label: 'Table',
                cellAlignment: 'left',
                striped: true,
                bordered: true,
                condensed: true,
                hideLabel: true,
                key: 'table',
                type: 'table',
                numCols: 3,
                numRows: (this.checkedParameters.length + 1),
                input: false,
                tableView: false,
                rows: this.getRows(),
            };
        } else {
            return {
                content: 'No Parameters',
                refreshOnChange: false,
                key: 'no_parameters',
                type: 'htmlelement',
                input: false,
                tableView: false
            };
        }
    }

    getRows() {
        const rows = [];
        if (this.checkedParameters.length) {
            const row = [
                {
                    components: [
                        {
                            content: '<b>Parameter</b>',
                            refreshOnChange: false,
                            key: 'parameter',
                            type: 'htmlelement',
                            input: false,
                            tableView: false
                        }
                    ]
                },
                {
                    components: [
                        {
                            content: '<b>Parameter Name</b>',
                            refreshOnChange: false,
                            key: 'parameter_name',
                            type: 'htmlelement',
                            input: false,
                            tableView: false
                        }
                    ]
                },
                {
                    components: [
                        {
                            content: '<b>Default Value</b>',
                            refreshOnChange: false,
                            key: 'html3',
                            type: 'htmlelement',
                            input: false,
                            tableView: false
                        }
                    ]
                }
            ];

            rows.push(row);

            this.checkedParameters.forEach((p, i) => {
                const r = [
                    {
                        components: [
                            {
                                content: p.name,
                                refreshOnChange: false,
                                key: ('name-' + i),
                                type: 'htmlelement',
                                input: false,
                                tableView: false
                            }
                        ]
                    },
                    {
                        components: [
                            {
                                placeholder: this.translate.instant('DYNAMIC-SEARCH.STEP-3.PLACEHOLDER-PARAMETER-NAME'),
                                applyMaskOn: 'change',
                                hideLabel: true,
                                tableView: false,
                                key: ('param-' + i),
                                type: 'textfield',
                                input: true
                            }
                        ]
                    },
                    {
                        components: [
                            {
                                content: p.value,
                                refreshOnChange: false,
                                key: ('default-' + i),
                                type: 'htmlelement',
                                input: false,
                                tableView: false
                            }
                        ]
                    }
                ];
                rows.push(r);
            });
        }
        return rows;
    }

    getParametersToTest() {
        if (this.checkedParameters.length) {
            return {
                label: 'Columns',
                columns: [
                    {
                        components: this.getKeys(),
                        width: 6,
                        offset: 0,
                        push: 0,
                        pull: 0,
                        size: 'md',
                        currentWidth: 6
                    },
                    {
                        components: this.getValues(),
                        width: 6,
                        offset: 0,
                        push: 0,
                        pull: 0,
                        size: 'md',
                        currentWidth: 6
                    }
                ],
                key: 'columns',
                type: 'columns',
                input: false,
                tableView: false
            };
        } else {
            return {
                content: 'No Parameters',
                refreshOnChange: false,
                key: 'no_parameters',
                type: 'htmlelement',
                input: false,
                tableView: false
            };
        }
    }

    getKeys() {
        const keys = [];
        const key = {
            content: '<b>Key</b>',
            refreshOnChange: false,
            key: 'html',
            type: 'htmlelement',
            input: false,
            tableView: false
        };
        keys.push(key);
        this.parametersForRestApi.forEach((p) => {
            const k = {
                placeholder: p.parameterName,
                applyMaskOn: 'change',
                hideLabel: true,
                disabled: true,
                tableView: true,
                redrawOn: 'data',
                allowCalculateOverride: true,
                key: 'key',
                type: 'textfield',
                input: true
            };
            keys.push(k);
        });
        return keys;
    }

    getValues() {
        const values = [];
        const value = {
            content: '<b>Value</b>',
            refreshOnChange: false,
            key: 'value',
            type: 'htmlelement',
            input: false,
            tableView: false
        };
        values.push(value);
        this.parametersForRestApi.forEach((p, i) => {
            const v = {
                applyMaskOn: 'change',
                hideLabel: true,
                tableView: true,
                key: ('param-test-' + i),
                type: 'textfield',
                input: true,
                defaultValue: p.defaultValue
            };
            values.push(v);
        });
        return values;
    }
}
