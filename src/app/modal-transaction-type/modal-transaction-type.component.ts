/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { TransactionType } from "../shared/interfaces/transaction_type.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ProcessTypeApiService } from "../shared/rest-api/processtype-api.service";
import { Router } from "@angular/router";
import { RoleApiService } from "../shared/rest-api/role-api.service";
import { TransactionTypeApiService } from "../shared/rest-api/transaction-type-api.service";
import { AlertToastService } from "../shared/common/alert-toast.service";
import { TranslateService } from "@ngx-translate/core";
import { Query } from "../shared/interfaces/query.model";

@Component({
    selector: "app-modal-transaction-type",
    templateUrl: "./modal-transaction-type.component.html",
    styleUrls: ["./modal-transaction-type.component.css"],
})
export class ModalTransactionTypeComponent implements OnInit {
    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public transactionType: any = {} as TransactionType;
    public transactionTypeStates: any = [];
    public transactionTypeTypes: any = [];
    public transactionTypeFrontiers: any = [];
    public processTypes: any = [];
    public roles: any = [];
    public restrictionQueries: Query[] = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        public router: Router,
        private restProcessTypeApi: ProcessTypeApiService,
        private restRoleApi: RoleApiService,
        private restTransactionTypeApi: TransactionTypeApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        const cellId = (window as any).diagramProcessCellId;
        if (cellId) {
            this.transactionType.diagram_cell_id = cellId;
        }

        this.loadFormFieldData();
        const params: any = this.modalService.config.initialState;
        if (Object.keys(params).length) {
            this.transactionType = params;
        }
        this.getQueriesToRestrictProcesses();
    }

    loadFormFieldData() {
        this.restProcessTypeApi.getProcessTypes().subscribe((data: {}) => {
            this.processTypes = data;
        });
        this.restRoleApi.getRoles().subscribe((data: {}) => {
            this.roles = data;
        });
        this.transactionTypeStates = [
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-STATE.OPTIONS.ACTIVE"
                ),
                id: "active",
            },
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-STATE.OPTIONS.INACTIVE"
                ),
                id: "inactive",
            },
        ];
        this.transactionTypeTypes = [
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-TYPE.OPTIONS.ORIGINAL"
                ),
                id: "original",
            },
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-TYPE.OPTIONS.INFORMATIONAL"
                ),
                id: "informational",
            },
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-TYPE.OPTIONS.DOCUMENTAL"
                ),
                id: "documental",
            },
        ];
        this.transactionTypeFrontiers = [
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-FRONTIER-TYPE.OPTIONS.INTERNAL"
                ),
                id: "internal",
            },
            {
                name: this.translate.instant(
                    "TRANSACTION-TYPES-MODAL.SELECT-FRONTIER-TYPE.OPTIONS.EXTERNAL"
                ),
                id: "external",
            },
        ];
    }

    saveData() {
        this.transactionType.init_proc = this.transactionType.init_proc ? 1 : 0;
        this.transactionType.end_proc = this.transactionType.end_proc ? 1 : 0;
        this.transactionType.interm_task = this.transactionType.interm_task
            ? 1
            : 0;
        this.transactionType.external = this.transactionType.external ? 1 : 0;
        this.transactionType.frontier = this.transactionType.frontier ? 1 : 0;
        this.transactionType.own_user_access_only = this.transactionType
            .own_user_access_only
            ? 1
            : 0;
        this.transactionType.auto_activate = this.transactionType.auto_activate
            ? 1
            : 0;
        // If transaction type has an id, it means we have opened it through the 'edit' button
        if (this.transactionType.id) {
            this.restTransactionTypeApi
                .updateTransactionType(this.transactionType)
                .subscribe(
                    (data: {}) => {
                        if (data) {
                            this.alertToast.showSuccess(
                                this.translate.instant(
                                    "TRANSACTION-TYPES-MODAL.UPDATE.SUCCESS"
                                )
                            );
                            this.passEntry.emit("success");
                            this.closeModal();
                        } else {
                            this.alertToast.showError(
                                this.translate.instant(
                                    "TRANSACTION-TYPES-MODAL.UPDATE.ERROR"
                                )
                            );
                            this.passEntry.emit("error");
                        }
                    },
                    (error) => {
                        this.alertToast.showError(
                            this.translate.instant(
                                "TRANSACTION-TYPES-MODAL.UPDATE.ERROR"
                            )
                        );
                        this.passEntry.emit("error");
                    }
                );
        } else {
            this.restTransactionTypeApi
                .createTransactionType(this.transactionType)
                .subscribe(
                    (data: {}) => {
                        if (data) {
                            this.alertToast.showSuccess(
                                this.translate.instant(
                                    "TRANSACTION-TYPES-MODAL.CREATE.SUCCESS"
                                )
                            );
                            this.passEntry.emit("success");
                            this.closeModal();
                        } else {
                            this.alertToast.showError(
                                this.translate.instant(
                                    "TRANSACTION-TYPES-MODAL.CREATE.ERROR"
                                )
                            );
                            this.passEntry.emit("error");
                        }
                    },
                    (error) => {
                        this.alertToast.showError(
                            this.translate.instant(
                                "TRANSACTION-TYPES-MODAL.CREATE.ERROR"
                            )
                        );
                        this.passEntry.emit("error");
                    }
                );
        }
    }

    getQueriesToRestrictProcesses() {
        if (this.transactionType.process_type_id) {
            this.restProcessTypeApi
                .getQueriesOfProcessType(this.transactionType.process_type_id)
                .subscribe((data) => {
                    this.restrictionQueries = data;
                });
        }
    }

    updateQueryRestrictions() {
        this.transactionType.restriction_query_id = null;
        this.restrictionQueries = [];
        this.getQueriesToRestrictProcesses();
    }

    resetQueryInput() {
        this.transactionType.restriction_query_id = null;
    }

    closeModal() {
        this.modalRef.hide();
    }
}
