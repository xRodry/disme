/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';

import { ProcessDetailsApiService } from '../shared/rest-api/processDetails-api.service';
import {ProcessTypeApiService} from '../shared/rest-api/processtype-api.service';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-modal-process-details',
    templateUrl: './modal-process-details.component.html',
    styleUrls: ['./modal-process-details.component.css']
})
export class ModalProcessDetailsComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    public processDetail: any = {};
    public processTypes;
    public properties;
    public propertiesProcessTypeDoesntHave: any = [];
    private previousPropertyId = 0;
    private attributedProcessDetails: any = [];

    constructor(
        private modalService: BsModalService,
        private modalRef: BsModalRef,
        private restApi: ProcessDetailsApiService,
        private processTypesApi: ProcessTypeApiService,
        public router: Router,
        private alertToast: AlertToastService,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        const params: any = this.modalService.config.initialState;
        // Save the attributed processDetails passed through the 'parent' component, so we know
        // which properties to load for each processType
        this.attributedProcessDetails = params.attributedProcessDetails;
        delete(params.attributedProcessDetails);
        // If component is opened through the 'edit' button, save the passed 'processDetail' to populate the form's fields
        const isEmptyObj = !Object.keys(params).length;
        if (!isEmptyObj) {
            this.previousPropertyId = params.property_id;
            this.processDetail = {...params};
        }
        // Load the data needed for the form's select boxes' options
        this.loadFormFieldData();
    }

    loadFormFieldData() {
        this.processTypesApi.getProcessTypes().subscribe((data: {}) => {
            this.processTypes = data;
            // If record is being edited, get properties that processType doesn't have to populate the 'properties'
            // select box, as function won't be triggered by the changing of the 'processType' select box (it's already pre-selected)
            if (this.processDetail.process_type_id) {
                this.getPropertiesProcessTypeDoesntHave();
            }
        });
    }

    getPropertiesProcessTypeDoesntHave() {
        this.processDetail.property_id = null;
        this.propertiesProcessTypeDoesntHave = null;
        // Get properties that current selected processType already has
        const processTypeProperties = this.attributedProcessDetails.filter(processDetail => processDetail.process_type_id
            === this.processDetail.process_type_id).map(processDetail => processDetail.property_id);
        return this.restApi.getAllPropertiesOfProcessType(this.processDetail.process_type_id).subscribe((data: {}) => {
            this.properties = data;
            // Get properties that the selected processType doesn't currently have
            this.propertiesProcessTypeDoesntHave = this.properties.filter(
                property => !processTypeProperties.includes(property.property_id)
            );
        });
    }

    saveData() {
        // If 'processDetail' has a 'created at' field, it means we have opened it through the 'edit' button
        if (this.processDetail.created_at) {
            this.restApi.updateProcessDetail(this.processDetail, this.previousPropertyId).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('PROCESS-DETAILS-MODAL.CREATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('PROCESS-DETAILS-MODAL.CREATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROCESS-DETAILS-MODAL.CREATE.ERROR'));
                this.passEntry.emit('error');
            });
        } else {
            this.restApi.createProcessDetail(this.processDetail).subscribe((data: {}) => {
                if (data) {
                    this.alertToast.showSuccess(this.translate.instant('PROCESS-DETAILS-MODAL.UPDATE.SUCCESS'));
                    this.passEntry.emit('success');
                    this.closeModal();
                } else {
                    this.alertToast.showError(this.translate.instant('PROCESS-DETAILS-MODAL.UPDATE.ERROR'));
                    this.passEntry.emit('error');
                }
            }, error => {
                this.alertToast.showError(this.translate.instant('PROCESS-DETAILS-MODAL.UPDATE.ERROR'));
                this.passEntry.emit('error');
            });
        }
    }

    closeModal() {
        this.modalRef.hide();
    }
}
