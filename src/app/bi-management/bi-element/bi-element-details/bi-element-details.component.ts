/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertToastService } from '../../../shared/common/alert-toast.service';
import { BiElement } from '../../../shared/interfaces/bi_element.model';
import { TranslateService } from '@ngx-translate/core';
import { BiElementCollection } from '../../../shared/interfaces/bi_element_collection.model';
import { BiElementDetailsModalComponent } from './bi-element-details-modal/bi-element-details-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-bi-element-details',
    templateUrl: './bi-element-details.component.html',
    styleUrls: ['./bi-element-details.component.css']
})

export class BiElementDetailsComponent implements OnInit {

    public disabled = true;
    public collected;
    public biElement = {} as BiElement;
    public biUserCollection: BiElementCollection[] = [];

    constructor(
        private biManagementApiService: BiManagementApiService,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private alertToast: AlertToastService,
        private translate: TranslateService,
        private modalService: BsModalService,
    ) { }

    ngOnInit() {
        this.biElement.id = this.route.snapshot.params.biElementId;
        this.checkBiUserCollection(this.biElement.id);
        this.getBiElementDetailModel();
    }

    checkBiUserCollection(biElementId) {
        this.biManagementApiService.getBiUserCollection().subscribe(data => {
            this.biUserCollection = data;
            if (this.biUserCollection.some(biCollectionElement => biCollectionElement.bi_element_id === Number(biElementId))) {
                console.log('✅ the object is contained in Collection');
                this.collected = true;
            } else {
                console.log('⛔️ the object is NOT contained in Collection');
                this.collected = false;
            }
        });
    }

    getBiElementDetailModel() {
        this.biManagementApiService.getBiElement(this.biElement.id).subscribe(data => {
            this.biElement = data;
            if (typeof this.biElement.preview === 'string') {
                this.biElement.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(this.biElement.preview);
            }
            if (typeof this.biElement.embed === 'string') {
                this.biElement.embed = this.domSanitizer.bypassSecurityTrustResourceUrl(this.biElement.embed);
            }
            console.table('BiElement detail text', this.biElement);
        });
    }

    storeBiUserCollection(biElement) {
        this.biManagementApiService.storeBiUserCollection(biElement).subscribe(data => {
            this.collected = true;
            this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.DETAILS.ADD.SUCCESS'));
        }, error => {
            this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.DETAILS.ADD.ERROR'));
        });
    }

    openEmbedLinkModal(biElement) {
        const modalRef = this.modalService.show(BiElementDetailsModalComponent, {class: 'modal-xl', initialState: biElement});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry === 'success') {
                console.log('embed modal shown successfully');
            }
        });
    }

}
