/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import { TokenVar } from './token';
import {ProcessTypes} from '../interfaces/processtype';
import {TransactionsDashb} from '../interfaces/transaction_dashb';
import {Processes} from '../interfaces/process';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewDashboardApiService {

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${localStorage.getItem(TokenVar.token_type)} ${localStorage.getItem(TokenVar.access_token)}`
    })
  };

  // done
  startProcess(process): Observable<Processes> {
    return this.http.post<Processes>(environment.apiUrl + '/dashboard/start_process', JSON.stringify(process), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // done
  initiateTaskOfExistingProcess(task): Observable<any> {
    return this.http.post<Processes>(environment.apiUrl + '/dashboard/initiate_task_existing_process', JSON.stringify(task),
        this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // done
  acknowledgeTask(task): Observable<TransactionsDashb> {
    return this.http.post<TransactionsDashb>(environment.apiUrl + '/dashboard/acknowledge_task', JSON.stringify(task), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getProcessesThatUserCanInitiate(): Observable<ProcessTypes> {
    return this.http.get<ProcessTypes>(environment.apiUrl + '/dashboard/get_processes_that_user_can_initiate', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // Done
  getDelegatedTasksByUserRole(roleId): Observable<TransactionsDashb> {
    return this.http.get<TransactionsDashb>(environment.apiUrl + '/dashboard/get_delegated_tasks/' + roleId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getFinishedTasks(): Observable<TransactionsDashb> {
    return this.http.get<TransactionsDashb>(environment.apiUrl + '/dashboard/get_finished_tasks', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getPendingTasks(): Observable<TransactionsDashb> {
    return this.http.get<TransactionsDashb>(environment.apiUrl + '/dashboard/get_pending_tasks_to_execute', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getDelegatedPendingTasks(): Observable<TransactionsDashb> {
    return this.http.get<TransactionsDashb>(environment.apiUrl + '/dashboard/get_delegated_pending_tasks_to_execute', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getTasksByRoleAndProcess(roleId, processTypeId): Observable<TransactionsDashb> {
    return this.http.get<TransactionsDashb>(environment.apiUrl + '/dashboard/get_tasks/' + roleId + '/' + processTypeId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getTasksOfInitProcesses(): Observable<ProcessTypes> {
    return this.http.get<ProcessTypes>(environment.apiUrl + '/dashboard/get_tasks_init_after_processes', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  // done
  getProcessesAvailableToInitiateTask(processTypeId, transactionTypeId): Observable<Processes> {
    return this.http.get<Processes>(environment.apiUrl + '/dashboard/get_processes_available_to_initiate_task/' + processTypeId +
        '/' + transactionTypeId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error) {
    return throwError(error.statusText);
  }

}
