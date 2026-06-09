/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {ExecutionEngineApiService} from '../shared/rest-api/execution-engine-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalFormDashboardComponent} from '../modal-form-dashboard/modal-form-dashboard.component';
import {ActionLog} from '../shared/interfaces/action_log.model';
import {ModalUserOutputDashboardComponent} from '../modal-user-output-dashboard/modal-user-output-dashboard.component';
import {NewDashboardApiService} from '../shared/rest-api/newDashboard-api.service';
import {ActionRuleToExecute} from '../shared/interfaces/action_rule_to_execute.model';
import {TranslateService} from '@ngx-translate/core';
import {ModalUserEvaluatedExpressionComponent} from '../modal-user-evaluated-expression/modal-user-evaluated-expression.component';
import {ModalUserDetailsDashboardComponent} from '../modal-user-details-dashboard/modal-user-details-dashboard.component';
import {RoleHasUserApiService} from '../shared/rest-api/role-has-user-api.service';
import {TemplateApiService} from '../shared/rest-api/template-api.service';
import {ModalSelectInstanceComponent} from '../modal-select-instance/modal-select-instance.component';
import {ExecutionStorageApiService} from '../shared/rest-api/execution-storage-api.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    // Dashboard Vitor
    private actionRuleToExecute: ActionRuleToExecute;

    // Início Érica
    // Common variables needed in the task graphs
    public chartType = 'doughnut';
    public chartOptions = {
        responsive: true,
        legend: false,
        cutoutPercentage: 80,   // Here for innerRadius. It's already exists
        outerRadius: 100,       // Here for outerRadius
        fillOpacity: .3,
        tooltip: {
            position: 'nearest'
        }
    };

    // Variables needed for the presentation of the delegated tasks' graph
    public DelegatedTasks: any = [];
    public totalOfDelegatedTasks = 0;
    public showDelegatedGraph = false;

    // Variables needed for the presentation of the "in progress" tasks' graph
    public TasksInProgress: any = [];
    public totalOfInProgressTasks = 0;
    public showInProgressGraph = false;

    // Variables needed for the presentation of the finished tasks' graph
    public FinishedTasks: any = [];
    public totalOfFinishedTasks = 0;
    public showFinishedGraph = false;

    // To present empty graphs
    public fakeData = [1];
    public fakeColors: any[] = [{ backgroundColor: ['#e4e5e6'] }];
    public fakeOptions = {
        responsive: true,
        legend: false,
        cutoutPercentage: 80,   // Here for innerRadius. It's already exists
        outerRadius: 100,       // Here for outerRadius
        fillOpacity: .3,
        tooltips: {
            enabled: false
        }
    };

    public RolesDashB: any = [];
    public TasksInitiateProcesses: any = [];
    public PendingTasks: any = [];
    public DelegatedPendingTasks: any = [];
    public TasksOfInitiatedProcesses: any = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                public executionEngineApi: ExecutionEngineApiService,
                public executionStorageApi: ExecutionStorageApiService,
                private modalService: BsModalService,
                private alertToast: AlertToastService,
                public translate: TranslateService,
                public restTemplateApi: TemplateApiService,
                public restNewDashboardApi: NewDashboardApiService,
                public roleHasUserApi: RoleHasUserApiService) {}

    ngOnInit() {
        this.loadProcessesUserCanInitiate();
        this.loadPendingTasks();
        this.loadFinishedTasks();
        this.loadUserRoles();
        this.loadTasksOfInitiatedProcesses();
    }

    // Sorts most used processes and removes those that are repeated
    loadProcessesUserCanInitiate() {
        return this.restNewDashboardApi.getProcessesThatUserCanInitiate().subscribe((data: {}) => {
            const tasksInitiateProcesses = [];
            // Remove repetitive processes (e.g. that may start with one role and have been delegated to another role)
            // @ts-ignore
            data.forEach(process => {
                let processExists = false;
                if (tasksInitiateProcesses.length > 0) {
                    tasksInitiateProcesses.forEach(taskInitProcess => {
                        if (taskInitProcess.transaction_type_id === process.transaction_type_id) {
                            processExists = true;
                        }
                    });
                    if (!processExists) {
                        tasksInitiateProcesses.push(process);
                    }
                } else {
                    tasksInitiateProcesses.push(process);
                }
            });

            // Sorts by most initiated processes
            tasksInitiateProcesses.sort((a, b) =>  {
                if (a.count === b.count) {
                    // Name is only important when counts are the same
                    return a.transaction_type_name.localeCompare(b.transaction_type_name);
                }
                return a.count > b.count ? -1 : 1;
            });

            // To show processes and simplify filtering and resetting tasks
            this.TasksInitiateProcesses = tasksInitiateProcesses;
            console.log('Processes User Can Initiate', this.TasksInitiateProcesses);
        });
    }

    // Responsible for getting user roles
    loadUserRoles() {
        return this.roleHasUserApi.getUserRoles().subscribe((data: {}) => {
            // Saves part of the response necessary for the display of the roles
            this.RolesDashB = data;
            console.log('User Roles', this.RolesDashB);
            // Sorts alphabetically
            this.RolesDashB.sort((a, b) => a.role_name.localeCompare(b.role_name));

            // Gets data for the delegated tasks' graph
            this.RolesDashB.forEach(role => {
                this.getDelegatedTaskByRoleID(role.role_id);
            });
        });
    }

    // Gets delegated tasks from the user's role and filters it for its graph representation
    getDelegatedTaskByRoleID(roleId) {
        return this.restNewDashboardApi.getDelegatedTasksByUserRole(roleId).subscribe((data: {}) => {
            this.filterDataToDelegatedGraph(data);
        });
    }

    // Responsible for filtering the data for the delegated tasks' graph representation
    filterDataToDelegatedGraph(delegatedTasks) {
        const label = [];
        const data = [];
        const backgroundColor = [];
        let dataCountOfEachTask = 0;

        // Handles response's data
        delegatedTasks.forEach(delegatedTask => {
            // Verifies only the tasks that are not yet filtered
            if (!label.includes(delegatedTask.transaction_type_name)) {
                // Responsible for counting tasks
                delegatedTasks.forEach(backupTask => {
                    if (delegatedTask.transaction_type_id === backupTask.transaction_type_id) {
                        dataCountOfEachTask++;
                    }
                });

                // Adds values to the corresponding arrays
                label.push(delegatedTask.transaction_type_name);
                data.push(dataCountOfEachTask);
                backgroundColor.push(delegatedTask.color);

                // Counting reset
                dataCountOfEachTask = 0;
            }
        });

        if (this.DelegatedTasks.length > 0) {
            this.DelegatedTasks.forEach(element => {
                // If it already exists in the array: increase the count; if it doesn't exist: add it
                for (let i = 0; i < label.length; i++) {
                    if (element.label.includes(label[i])) {
                        for (let j = 0; j < element.label.length; j++) {
                            if (element.label[j].localeCompare(label[i]) === 0) {
                                element.data[j] = element.data[j] + data[i];
                            }
                        }
                    } else {
                        element.label.push(label[i]);
                        element.data.push(data[i]);
                        element.color[0].backgroundColor.push(backgroundColor[i]);
                    }
                    this.totalOfDelegatedTasks += data[i]; // Updated total task counting present in the graph
                }
            });
        } else {
            const result = {
                label,
                data,
                color : [{
                    backgroundColor
                }]
            };

            this.DelegatedTasks.push(result);

            // Counting of the tasks present in the graph
            data.forEach(element => {
                this.totalOfDelegatedTasks += element;
            });
        }

        if (this.DelegatedTasks[0].label.length > 0) {
            // Flag indicating that the graphic can be rendered
            this.showDelegatedGraph = true;
        }
    }


    // Responsible for obtaining the necessary data for the pending tasks' table
    loadPendingTasks(createdTaskId = null) {
        return this.restNewDashboardApi.getPendingTasks().subscribe((data: {}) => {
            this.PendingTasks = data;
            // Sort tasks by created_at date
            this.PendingTasks.sort((a, b) => {
                return b.created_at > a.created_at ? -1 : 1;
            });
            // Directly execute the newly created task
            if (createdTaskId) {
                const createdTask = this.PendingTasks.find(pendingTask => pendingTask.transaction_state_id === createdTaskId);
                if (createdTask) {
                    this.executeARAuxiliary(createdTask);
                }
            }
            // Get delegated pending tasks and count the pending tasks ('normal' + 'delegated')
            this.loadDelegatedPendingTasks();
        });
    }

    //  Responsible for obtaining the necessary data for the delegated pending tasks' table
    loadDelegatedPendingTasks() {
        return this.restNewDashboardApi.getDelegatedPendingTasks().subscribe((data: {}) => {
            this.DelegatedPendingTasks = data;
            this.DelegatedPendingTasks.sort((a, b) => {
                return b.created_at > a.created_at ? -1 : 1;
            });
            // Pending task count
            this.countTasksInProgress(this.PendingTasks, this.DelegatedPendingTasks);
        });
    }

    // Responsible for getting and filtering the data for the in progress tasks' graph representation
    countTasksInProgress(tasksInProgress, delegatedTasksInProgress) {
        // For when we're updating the dashboard after a task has been completed or a process has been started
        this.showInProgressGraph = false;
        this.totalOfInProgressTasks = 0;
        if (tasksInProgress.length > 0 || delegatedTasksInProgress.length > 0) {
            let graphVariables = { backgroundColor: [], dataInProgress: [], label: [], auxiliaryCounter: {}, totalCounter: 0};

            graphVariables = this.countTasksInProgressAuxiliary(tasksInProgress, graphVariables);
            graphVariables = this.countTasksInProgressAuxiliary(delegatedTasksInProgress, graphVariables);

            graphVariables.dataInProgress = Object.values(graphVariables.auxiliaryCounter);
            const backgroundColor = graphVariables.backgroundColor;
            this.totalOfInProgressTasks = graphVariables.totalCounter;

            this.TasksInProgress = {
                label: graphVariables.label,
                data: graphVariables.dataInProgress,
                color: [{
                    backgroundColor
                }]
            };

            if (this.TasksInProgress.label.length) {
                // Flag indicating that the graphic can be rendered
                this.showInProgressGraph = true;
            }
        }
    }

    countTasksInProgressAuxiliary(tasksInProgress, graphVariables) {
        // Counts the tasks and labels them accordingly
        for (const taskInProgress of tasksInProgress) {
            // If the task_name hasn't come up yet add it to the labels array, save its background_color and start its counter as 1
            // If th task_name has already came up, add one to its counter
            if (!graphVariables.label.includes(taskInProgress.task_name)) {
                graphVariables.label.push(taskInProgress.task_name);
                graphVariables.backgroundColor.push(taskInProgress.color);
                graphVariables.auxiliaryCounter[taskInProgress.task_name] = 1;
            } else {
                graphVariables.auxiliaryCounter[taskInProgress.task_name]++;
            }
            graphVariables.totalCounter++;
        }
        return graphVariables;
    }

    // Responsible for obtaining and filtering the necessary data for the finished tasks' graph
    loadFinishedTasks() {
        return this.restNewDashboardApi.getFinishedTasks().subscribe((data: {}) => {
            this.showFinishedGraph = false;
            this.totalOfFinishedTasks = 0;
            const label = [];
            const finishedData = [];
            const backgroundColor = [];

            //  Handles the response data
            // @ts-ignore
            for (const finishedTask of data) {
                let dataCountOfEachTask = 0;
                // Only checks the tasks that are not yet filtered
                if (!label.includes(finishedTask.transaction_type_name)) {
                    // Responsible for counting tasks
                    // @ts-ignore
                    for (const finishedTask2 of data) {
                        if (finishedTask.transaction_type_id === finishedTask2.transaction_type_id) {
                            dataCountOfEachTask++;
                        }
                    }
                    // Add values to the corresponding arrays
                    label.push(finishedTask.transaction_type_name);
                    finishedData.push(dataCountOfEachTask);
                    backgroundColor.push(finishedTask.color);
                }
            }

            this.FinishedTasks = {
                label,
                data: finishedData,
                color: [{
                    backgroundColor
                }]
            };

            // Counting of the tasks present in the chart
            finishedData.forEach(element => {
                this.totalOfFinishedTasks += element;
            });

            if (this.FinishedTasks.label.length > 0) {
                // Flag indicating that the graphic can be rendered
                this.showFinishedGraph = true;
            }
        });
    }

    // Responsible for obtaining the data required to initiate tasks that depend on an active process
    loadTasksOfInitiatedProcesses() {
        return this.restNewDashboardApi.getTasksOfInitProcesses().subscribe((data: {}) => {
            const tasksOfInitiatedProcesses = [];
            // Remove duplicates (for example that can start with one role and has been delegated to another role)
            // @ts-ignore
            data.forEach(process => {
                let processExists = false;
                if (tasksOfInitiatedProcesses.length > 0) {
                    tasksOfInitiatedProcesses.forEach(taskOfInitProcess => {
                        if (taskOfInitProcess.transaction_type_id === process.transaction_type_id) {
                            processExists = true;
                        }
                    });
                    if (!processExists) {
                        tasksOfInitiatedProcesses.push(process);
                    }
                } else {
                    tasksOfInitiatedProcesses.push(process);
                }
            });

            // Sorts by most initiated processes
            tasksOfInitiatedProcesses.sort((a, b) =>  {
                if (a.count === b.count) {
                    // Name is only important when counts are the same
                    return a.transaction_type_name.localeCompare(b.transaction_type_name);
                }
                return a.count > b.count ? -1 : 1;
            });

            // To show and simplify filtering and task resetting
            this.TasksOfInitiatedProcesses = tasksOfInitiatedProcesses;
            console.log('Tasks of init process', this.TasksOfInitiatedProcesses);
        });
    }
    // Fim Érica

    // ----------------------
    // DASHBOARD VITOR
    // ----------------------

    executeAR(actionRuleToExecute: ActionRuleToExecute) {
        this.actionRuleToExecute = actionRuleToExecute;
        return this.executionEngineApi.evaluateAction(this.actionRuleToExecute).subscribe((data: {}) => {
            // TODO dar erro caso encontre um erro no Execution Engine
            this.analyseEECResponse(data);
        });
    }

    executeARAuxiliary(PendingTask) {
        // Removes the 'new' indicator on the task opened
        PendingTask.ack_on = true;
        // Build the ActionRuleToExecute and execute it through the dashboardComponent
        const actionRuleToExecute = {} as ActionRuleToExecute;
        actionRuleToExecute.transaction_type_id = PendingTask.trans_type_id;
        actionRuleToExecute.t_state_id = PendingTask.t_state_id;
        actionRuleToExecute.transaction_id = PendingTask.transaction_id;
        actionRuleToExecute.process_id = PendingTask.process_id;
        actionRuleToExecute.process_type_id = PendingTask.process_type_id;
        actionRuleToExecute.user_detailing_process_type = PendingTask.user_detailing_process_type;
        actionRuleToExecute.transaction_state_id = PendingTask.transaction_state_id;
        actionRuleToExecute.ack_on = PendingTask.ack_on;
        actionRuleToExecute.action_rule_type = PendingTask.action_rule_type;
        this.executeAR(actionRuleToExecute);
    }

    analyseEECResponse(executionResponse) {
        // Check wha type of response we got from the ExecutionEngine and act accordingly
        if (executionResponse) {
            if (executionResponse === 'alreadyHadExecutor') {
                this.alertToast.showError(this.translate.instant('DASHBOARD-EXECUTER.ALREADY-HAD-EXECUTOR'));
                this.updateStatsAndData();
            } else {
                // If the ExecutionEngine passed the transaction to another state or changed transaction (due to causal links)
                if (executionResponse.action_rule) {
                    // Updated so the next action is fetched for the new AR being evaluated
                    // and not the AR that the user started the execution
                    this.actionRuleToExecute = executionResponse.action_rule;
                    this.updateStatsAndData();
                }
                // Deal with the AR_action to be executed that requires user intervention
                this.dealAction(executionResponse);
            }
        } else {
            // this.alertToast.showInfo(this.translate.instant('DASHBOARD-EXECUTER.PERFORMED'));
            // Update stats and data presented on tables (as an action rule has been performed)
            this.updateStatsAndData();
        }
    }

    updateStatsAndData(createdTaskId = null) {
        this.loadPendingTasks(createdTaskId);
        this.loadDelegatedPendingTasks();
        this.loadFinishedTasks();
    }

    dealAction(action) {
        console.group('Action Execution');
        console.log('Action Rule', this.actionRuleToExecute);
        switch (action.type) {
            case 'assign_expression':
                console.log('Assign Expression (actionProp term) Action', action);
                this.dealUserInputAction(action);
                break;
            case 'user_input':
                console.log('User Input Action', action);
                this.dealUserInputAction(action);
                break;
            case 'edit_entity_instance':
                console.log('Edit Entity Instance Action', action);
                this.dealEditEntityInstanceAction(action);
                break;
            case 'user_output':
                console.log('User Output Action', action);
                this.dealUserOutputAction(action);
                break;
            case 'user_evaluated_expression':
                console.log('User Evaluated Expression:', action);
                // Open the modal with the expression that the user has to evaluate
                this.openUserEvaluatedExpressionModal(action);
                break;
            default:
                console.log('ERROR');
                break;
        }
        console.groupEnd();
    }

    storeActionLog(state, actionId, transactionStateId) {
        const actionLog = {} as ActionLog;
        actionLog.state = state;
        actionLog.action_id = actionId;
        actionLog.transaction_state_id = transactionStateId;
        // If the action has been executed, store its state in the DB and resume the execution of the AR
        return this.executionStorageApi.storeActionLog(actionLog).subscribe((data: {}) => {
            // Progress to next action
            if (state === 'executed') {
                this.actionRuleToExecute.last_action_id = actionId;
                this.executeAR(this.actionRuleToExecute);
            }
        });
    }

    dealUserInputAction(action) {
        // If the EEC's response doesn't have a formId specified, it's because we're in a 'user detailing' user_input action,
        // and we don't have a selected user/entType yet.
        if (!action.form_id) {
            // Open the 'user detailing' modal to select the user/entType.
            this.openUserDetailingModal();
        } else {
            const params = {
                actionId: action.id,
                formId: action.form_id,
                formDetails: action.form_details,
                detailingUserId: action.detailing_user_id,
                processId: this.actionRuleToExecute.process_id,
                transactionId: this.actionRuleToExecute.transaction_id,
                transactionStateId: this.actionRuleToExecute.transaction_state_id,
                assignExpressionAction: action.type === 'assign_expression'
            };
            // Act accordingly - Present the modal with the form to the user.
            this.openModalForm(params);
        }
    }

    openModalForm(params) {
        // Open the modal that will present the form to the user
        const modalRef = this.modalService.show(ModalFormDashboardComponent, {
            class: 'modal-lg',
            initialState: params,
            backdrop: 'static' // Prevent closing on outside click
        });
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                // Action has been executed, so we can continue the AR execution
                this.actionRuleToExecute.last_action_id = params.actionId;
                this.executeAR(this.actionRuleToExecute);
            }
        });
    }

    dealEditEntityInstanceAction(action) {
        // Construct the params object to pass to the entitySelectionModal or to the formModal
        const params = {
            actionId: action.id,
            instanceType: 'entity',
            detailingUserId: action.detailing_user_id,
            formId: action.form_id ? action.form_id : null,
            formDetails: action.form_details ? action.form_details : null,
            processId: this.actionRuleToExecute.process_id,
            transactionId: this.actionRuleToExecute.transaction_id,
            transactionStateId: this.actionRuleToExecute.transaction_state_id,
            selectedEntity: null, instanceTypeName: null, availableInstances: [], noEntitiesFound: false
        };

        if (action.entity_instances.length) {
            // If there's only 1 entity, pre-select it
            if (action.entity_instances.length === 1) {
                params.selectedEntity = action.entity_instances[0].id;
                // Open the modal that will present the form to the user to edit data
                this.openModalForm(params);
            } else {
                params.availableInstances = action.entity_instances;
                params.instanceTypeName = action.entity_instances[0].ent_type_name;
                this.openEntitySelectionModal(params);
            }
        } else {
            params.noEntitiesFound = true;
            this.openEntitySelectionModal(params);
        }
    }

    openEntitySelectionModal(params) {
        // Open the modal for the user to select the entity to edit
        const modalRef = this.modalService.show(ModalSelectInstanceComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                params.selectedEntity = receivedEntry;
                if (params.formId) {
                    // Open the modal that will present the form to the user to edit data
                    this.openModalForm(params);
                } else {
                    // As there are no properties in this action that need a form, just automatically update the selected entity
                    this.saveActionWithDerivedPropertiesOnly(params);
                }
            }
        });
    }

    saveActionWithDerivedPropertiesOnly(actionInfo) {
        return this.executionStorageApi.storeActionWithDerivedPropertiesOnly(actionInfo).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('DASHBOARD-EXECUTER.AUTO-UPDATE-ENTITY-SUCCESS'));
            } else {
                this.alertToast.showError(this.translate.instant('DASHBOARD-EXECUTER.AUTO-UPDATE-ENTITY-ERROR'));
            }
        });
    }

    openUserDetailingModal(params = {}) {
        // Open the modal that will present the form to the user
        const modalRef = this.modalService.show(ModalUserDetailsDashboardComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            this.actionRuleToExecute.user_detailing_user_id = receivedEntry;
            this.executeAR(this.actionRuleToExecute);
        });
    }

    openUserEvaluatedExpressionModal(action) {
        const params = {userEvaluatedExpressionText: action.user_evaluated_expression.expression_text};
        // Open the modal that will present the expression to be evaluated by the user
        const modalRef = this.modalService.show(ModalUserEvaluatedExpressionComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                const userEvaluatedExpression = {
                    transactionStateId: this.actionRuleToExecute.transaction_state_id,
                    processId: this.actionRuleToExecute.process_id,
                    transactionId: this.actionRuleToExecute.transaction_id,
                    actionId: action.id,
                    expression_result: receivedEntry === 'true',
                    condition_log_id: action.user_evaluated_expression.condition_log_id,
                    user_evaluated_expression_id: action.user_evaluated_expression.user_evaluated_expression_id
                };
                // Store the user's answer and resume the execution of the AR
                return this.executionStorageApi.storeUserEvaluatedExpressionLog(userEvaluatedExpression).subscribe((data: {}) => {
                    if (data) {
                        // Progress to next action
                        this.actionRuleToExecute.last_action_id = action.id;
                        this.executeAR(this.actionRuleToExecute);
                    }
                });
            }
        });
    }

    dealUserOutputAction(action) {
        // Depending on the template type, act accordingly
        if (action.template.type === 'modal') {
            this.presentModalUserOutput(action.template, action);
        } else if (action.template.type === 'toast') {
            this.presentToastUserOutput(action.template, action);
        } else if (action.template.type === 'doc') {
            this.presentDocUserOutput(action.template, action);
        }
    }

    presentModalUserOutput(modalTemplate, action) {
        this.openModalTemplate({
            from: 'dashboard', actionId: action.id, templateHeader: modalTemplate.header,
            templateText: modalTemplate.text, templateButton: modalTemplate.button,
            templateType: modalTemplate.type
        });
    }

    openModalTemplate(params) {
        // Open the modal that will present the template text to the user
        const modalRef = this.modalService.show(ModalUserOutputDashboardComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                // If user confirms the user output modal, store the action as executed in the action log table
                this.storeActionLog('executed', params.actionId, this.actionRuleToExecute.transaction_state_id);
            }
        });
    }

    presentToastUserOutput(template, action) {
        // Present the toast notification depending on the class it belongs to
        switch (template.class) {
            case 'success': {
                this.alertToast.showSuccess(template.text);
                break;
            }
            case 'information': {
                this.alertToast.showInfo(template.text);
                break;
            }
            case 'warning': {
                this.alertToast.showWarning(template.text);
                break;
            }
            case 'error': {
                this.alertToast.showError(template.text);
                break;
            }
            case 'custom': {
                // Get the colour of the custom toast so we can get the custom CSS class that will be applied to the toast
                // So we get only the hexadecimal part after #
                const toastColour = template.colour.substring(1);
                // Adding the appropriate CSS class depending on the colour retrieved from the DB
                const addedCssClass = 'dashboard-toast-blockly-custom-' + toastColour;
                this.alertToast.showCustom(template.text, template.title, addedCssClass);
                break;
            }
            default: {
                this.alertToast.showError(this.translate.instant('DASHBOARD-EXECUTER.ERROR'));
                break;
            }
        }
        // After user output notification is showed, store the action as executed in the action log table
        this.storeActionLog('executed', action.id, this.actionRuleToExecute.transaction_state_id);
    }

    presentDocUserOutput(modalTemplate, action) {
        // Get the document from Mayan EDMS and open the modal that will present it the user
        this.restTemplateApi.getPDFFromEDMS(modalTemplate.edms_id).subscribe((blob: Blob): void => {
            const fileURL = URL.createObjectURL(new Blob([blob], {type: 'application/pdf'}));
            this.openModalTemplate({
                from: 'dashboard', actionId: action.id, templateType: modalTemplate.type, pdfInfo: fileURL,
                templateHeader: 'Generated Document', templateButton: 'Continue'
            });
        });
    }
}
