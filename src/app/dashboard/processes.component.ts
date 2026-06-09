/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NewDashboardApiService} from '../shared/rest-api/newDashboard-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {DashboardComponent} from './dashboard.component';
import {ModalSelectInstanceComponent} from '../modal-select-instance/modal-select-instance.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-dashboard-processes',
    templateUrl: './processes.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [ModalSelectInstanceComponent]
})

export class ProcessesComponent implements OnInit, OnChanges {
    @Input() public RolesDashB: any = [];
    @Input() public ProcessTasksDashB: any = [];
    @Input() public tasksStartProcesses: any = [];

    public sortingOptions = [
        {id: 'mostPopular', name: 'Most Popular'},
        {id: 'transTypeName', name: 'Process Name'},
        {id: 'processTypeName', name: 'Task Name'}
    ];

    public sortingBy = 'mostPopular';

    public BackupProcessTasksDashB: any = []; // To help with the filters
    public ProcessTasksDashBHelper: any = []; // To maintain all processTasks (so that they can be restored once filters are cleared)
    public selectedRole;
    public selectedProcess;
    public processFilter: any = [];
    private languageAbbrv;

    // Pagination
    public page = 1;
    public pageSize = 6;

    constructor(public modalService: BsModalService,
                public restNewDashboardApi: NewDashboardApiService,
                private alertToast: AlertToastService,
                private dashboardComponent: DashboardComponent,
                public translate: TranslateService) {}

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
    }

    ngOnChanges(changes: SimpleChanges) {
        // Update the processTasks when they are updated on the dashboard component
        if (changes.ProcessTasksDashB) {
            this.BackupProcessTasksDashB = this.ProcessTasksDashBHelper = this.ProcessTasksDashB;
            this.refreshProcessTasks();
        }
    }

    startProcess(element) {
        return this.restNewDashboardApi.startProcess(element).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('DASHBOARD.PROCESS-STARTED.SUCCESS'));
                // @ts-ignore
                if (!isNaN(data)) {
                    // Update the table data and execute the created task
                    this.dashboardComponent.updateStatsAndData(data);
                }
            } else {
                this.alertToast.showError(this.translate.instant('DASHBOARD.PROCESS-STARTED.ERROR'));
            }
        });
    }

    getProcessesAndOpenInitiateTaskModal(task) {
        return this.restNewDashboardApi.getProcessesAvailableToInitiateTask(task.process_type_id, task.transaction_type_id)
            .subscribe((data: {}) => {
                this.openInitiateTaskModal(task, data);
            }, error => {
                this.alertToast.showError(this.translate.instant('MODAL-SELECT-INSTANCE.ERROR-LOADING-PROCESS'));
            });
    }

    openInitiateTaskModal(task, processInstances) {
        // Pass the process instances to be shown, alongside the process type's name to be shown in the modal title
        task.availableInstances = processInstances;
        task.instanceType = 'process';
        task.instanceTypeName = task.process_type_name;
        // Open the instance selection modal for the user to select the process to initiate the task in
        const modalRef = this.modalService.show(ModalSelectInstanceComponent, {class: 'modal-lg', initialState: task});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                // Get the process_id from the process where the user selected to start the task
                task.process_id = receivedEntry;
                this.startTaskOfInitProcess(task);
            }
        });
    }

    private startTaskOfInitProcess(task) {
        return this.restNewDashboardApi.initiateTaskOfExistingProcess(task).subscribe((data: {}) => {
            if (data) {
                this.alertToast.showSuccess(this.translate.instant('DASHBOARD.TASK-INITIATED.SUCCESS'));
                // @ts-ignore
                if (!isNaN(data)) {
                    // Get the task from table row and execute the created task
                    this.dashboardComponent.updateStatsAndData(data);
                }
            } else {
                this.alertToast.showError(this.translate.instant('DASHBOARD.TASK-INITIATED.ERROR'));
            }
        });
    }

    clearFilterAhead() {
        // If the role filter is changed first - reset process filter
        if (this.selectedProcess > 0) {
            this.selectedProcess = null;
        }
    }

    // Allows the update of the data and resets page to page 1.
    updateProcessTasksData() {
        this.page = 1;
        this.refreshProcessTasks();
    }

    // Allows the update of the elements on each page of the table.
    refreshProcessTasks() {
        this.ProcessTasksDashB = this.BackupProcessTasksDashB.slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
    }

    // Through the selected role, get the processes the user can start because of its role
    // or the processes it can initiate from a delegation
    loadProcessByRoleID(roleId) {
        this.clearFilterAhead();

        if (this.selectedRole > 0) {
                this.processFilter = [];
                const userRoleProcesses = [];
                // Searches tasks that match the role selected in the filter
                this.ProcessTasksDashBHelper.forEach(element => {
                    if (element.role_id === roleId) {
                        userRoleProcesses.push(element);
                    }
                });
                this.BackupProcessTasksDashB = userRoleProcesses;
                // Saves the process types for the process filter - unique names, no repetition
                this.BackupProcessTasksDashB.forEach(element => {
                    if (!this.processFilter.some(e => e.process_type_name === element.process_type_name)) {
                        this.processFilter = [...this.processFilter, element];
                    }
                });
                // Sorts alphabetically
                this.BackupProcessTasksDashB.sort((a, b) => a.transaction_type_name.localeCompare(b.transaction_type_name));
                this.ProcessTasksDashB = this.BackupProcessTasksDashB;
        } else {
            // Reset the processes to be displayed
            this.ProcessTasksDashB = this.ProcessTasksDashBHelper;
            // Reset filter data
            this.BackupProcessTasksDashB = this.ProcessTasksDashB;
            this.processFilter = [];
        }
        this.updateProcessTasksData();
    }

    // Filtering and resetting the data belonging to the process initialization part
    filterProcesses() {
        if (this.selectedProcess > 0) {
            const filteredProcessTasks = [];

            // Through all the tasks in the response, it looks for the ones that corresponds to the process selected in the filter
            this.BackupProcessTasksDashB.forEach(element => {
                if (element.process_type_id === this.selectedProcess) {
                    filteredProcessTasks.push(element);
                }
            });

            // Changes the processes to be presented (since they have already been filtered)
            this.ProcessTasksDashB = filteredProcessTasks;
        } else if (this.selectedProcess === null) {
            // Reset the processes to be displayed (displays all the processes of the selected role)
            this.ProcessTasksDashB = this.BackupProcessTasksDashB;
        }
        this.updateProcessTasksData();
    }

    sortProcesses() {
        switch (this.sortingBy) {
            case 'mostPopular':
                this.BackupProcessTasksDashB.sort((a, b) => b.count - a.count);
                break;
            case 'transTypeName':
                this.BackupProcessTasksDashB.sort((a, b) => a.process_type_name.localeCompare(b.process_type_name));
                break;
            case 'processTypeName':
                this.BackupProcessTasksDashB.sort((a, b) => a.transaction_type_name.localeCompare(b.transaction_type_name));
                break;
            default:
                break;
        }
        this.updateProcessTasksData();
    }
}
