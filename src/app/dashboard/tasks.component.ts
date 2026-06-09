/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NewDashboardApiService} from '../shared/rest-api/newDashboard-api.service';
import {DashboardComponent} from './dashboard.component';
import {ActionRuleToExecute} from '../shared/interfaces/action_rule_to_execute.model';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-dashboard-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class TasksComponent implements OnInit, OnChanges {
    @Input() public RolesDashB: any = [];
    @Input() public PendingTasks: any = [];
    @Input() public isDelegated: boolean;

    public BackupPendingTasks: any = [];
    private PendingTasksHelper: any = [];

    // Filter
    public taskProcess: any = [];
    public TasksDashB: any = [];
    public taskSelectedRole;
    public taskSelectedProcess;
    public selectedTask;
    private tasksByUserRole: any = [];
    // Pagination
    public page = 1;
    public pageSize = 10;
    // Sorting
    private last = { column: 'created_at', by: 'asc' };
    // Search
    public query = '';
    private languageAbbrv;

    constructor(public restNewDashboardApi: NewDashboardApiService,
                private dashboardComponent: DashboardComponent,
                private alertToast: AlertToastService,
                public translate: TranslateService) {}

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
    }

    ngOnChanges(changes: SimpleChanges) {
        // Update the pendingTasks when they are updated on the dashboard component
        // For example, when a process is initiated on the first section
        if (changes.PendingTasks) {
            this.BackupPendingTasks = this.PendingTasksHelper = this.PendingTasks;
            this.refreshPendingTasks();
        }
    }

    // Allows the update of the elements on each page of the table.
    refreshPendingTasks() {
        this.PendingTasks = this.BackupPendingTasks.slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
    }

    // Allows the update of the data and resets page to page 1.
    updatePendingTasksData() {
        this.page = 1;
        this.refreshPendingTasks();
    }

    clearFiltersAhead(source) {
        this.page = 1;
        if (source === 'roleFilter' || source === 'processFilter') {
            // Reset the task filter ahead if it is filled
            if (this.selectedTask > 0) {
                this.selectedTask = null;
            }
        }
        if (source === 'roleFilter') {
            // Reset the process filter ahead if it is filled
            if (this.taskSelectedProcess > 0) {
                this.taskSelectedProcess = null;
            }
        }
    }

    loadTasksByRole(roleId) {
        this.clearFiltersAhead('roleFilter');
        this.taskProcess = [];
        this.tasksByUserRole = [];
        if (this.taskSelectedRole > 0) {
                // Filters tasks by selected role
                const userRoleTasks = [];
                // Searches tasks that match the role selected in the filter
                this.PendingTasksHelper.forEach(element => {
                    if (element.role_id === roleId) {
                        userRoleTasks.push(element);
                    }
                });
                this.tasksByUserRole = userRoleTasks;
                this.auxiliaryLoadTasksByRole();
        } else {
            // No role selected - Reset table data
            this.filterPendingTasks(0);
        }
    }

    private auxiliaryLoadTasksByRole() {
        // Sorts alphabetically
        this.tasksByUserRole.sort((a, b) => a.process_type_name.localeCompare(b.process_type_name));
        // Add process names to appear in the process filter
        this.tasksByUserRole.forEach(element => {
            if (!this.taskProcess.some(e => e.process_type_name === element.process_type_name)) {
                this.taskProcess = [...this.taskProcess, element];
            }
        });
        // Update table data
        this.BackupPendingTasks = this.tasksByUserRole;
        this.updatePendingTasksData();
    }

    loadTasksByProcessID(param1, param2) {
        this.clearFiltersAhead('processFilter');
        if (this.taskSelectedProcess > 0) {
            // Filters table content by the selected process
            this.filterPendingTasks(1);
            // Updates the options in the 'Task' filter
            return this.restNewDashboardApi.getTasksByRoleAndProcess(param1, param2).subscribe((data: {}) => {
                this.TasksDashB = data;
                // Sorts alphabetically
                this.TasksDashB.sort((a, b) => a.t_name.localeCompare(b.t_name));
            });
        } else {
            // No process selected - Reset table data
            this.BackupPendingTasks = this.tasksByUserRole;
            this.TasksDashB = [];
            this.updatePendingTasksData();
        }
    }

    filterPendingTasks(type) {
        if (type === 0) {
            this.BackupPendingTasks = this.PendingTasksHelper;
            // Updates pagination
            this.updatePendingTasksData();
        } else {
            // Filters by processes initially and if it receives type == 2, filters that content by the selected task
            const filteredProcessTasks = [];

            // Searches tasks that match the process selected in the filter
            this.tasksByUserRole.forEach(element => {
                if (element.process_type_id === this.taskSelectedProcess) {
                    filteredProcessTasks.push(element);
                }
            });

            // Changes the pending tasks to be displayed (since they have already been filtered by a certain process)
            this.BackupPendingTasks = filteredProcessTasks;

            // Filters by task of a determined process
            if (type === 2) {
                const filteredTasks = [];
                // Through all the response data, it searches for the tasks that correspond to the process task selected in the filter
                filteredProcessTasks.forEach(element => {
                    if (element.trans_type_id === this.selectedTask) {
                        filteredTasks.push(element);
                    }
                });
                // Changes the pending tasks to be displayed (since they have already been filtered by a certain process)
                this.BackupPendingTasks = filteredTasks;
            }

            // Updates pagination
            this.updatePendingTasksData();
        }
    }

    sortBy(column) {
        if (this.last.column === column) {
            if (this.last.by === 'asc') {
                this.BackupPendingTasks.sort((a, b) => this.sortAuxiliary(a, b, column) );
                this.last.column = column;
                this.last.by = 'desc';
            } else {
                this.BackupPendingTasks.sort((a, b) => this.sortAuxiliary(a, b, column));
                this.last.column = column;
                this.last.by = 'asc';
            }
        } else {
            this.BackupPendingTasks.sort((a, b) => this.sortAuxiliary(a, b, column));
            this.last.column = column;
            this.last.by = 'asc';
        }

        this.updatePendingTasksData();
    }

    sortAuxiliary(a, b, column) {
        if (a[column] < b[column]) {
            return 1;
        }
        if (a[column] > b[column]) {
            return -1;
        }
        return 0;
    }

    search() {
        if (this.query !== '') {
            this.BackupPendingTasks = this.BackupPendingTasks.filter(object => {
                return JSON.stringify(object)
                    .toString()
                    .toLowerCase()
                    .includes(this.query);
            });

            // Updates pagination
            this.updatePendingTasksData();
        } else {
            this.BackupPendingTasks = this.PendingTasksHelper;

            // Updates pagination
            this.updatePendingTasksData();
        }
    }

    public executeAR(event, PendingTask) {
        // Prevent the clicking of the button to call the acknowledgeTask function (defined in the button's parent row)
        event.stopPropagation();
        this.dashboardComponent.executeARAuxiliary(PendingTask);
    }

    public acknowledgeTask(PendingTask) {
        if (!PendingTask.ack_on) {
            return this.restNewDashboardApi.acknowledgeTask(PendingTask).subscribe((data: {}) => {
                if (data) {
                    PendingTask.ack_on = true;
                } else {
                    this.alertToast.showError(this.translate.instant('DASHBOARD.ACK-TASK-ERROR'));
                }
            });
        }
    }
}
