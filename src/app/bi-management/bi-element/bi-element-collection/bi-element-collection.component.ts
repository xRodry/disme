/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { AlertToastService } from '../../../shared/common/alert-toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BiElementCollection } from '../../../shared/interfaces/bi_element_collection.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-bi-element-collection',
    templateUrl: './bi-element-collection.component.html',
    styleUrls: ['./bi-element-collection.component.css']
})

export class BiElementCollectionComponent implements OnInit {

    public biUserCollection: BiElementCollection[] = [];
    public searchText: any;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private alertToast: AlertToastService,
        private translate: TranslateService,
        private domSanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.getBiUserCollection();
    }

    getBiUserCollection() {
        this.biManagementApiService.getBiUserCollection().subscribe(data => {
            this.biUserCollection = data;
            for (const biUserElementInCollection of this.biUserCollection) {
                if (typeof biUserElementInCollection.preview === 'string') {
                    biUserElementInCollection.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(biUserElementInCollection.preview);
                }
                if (typeof biUserElementInCollection.embed === 'string') {
                    biUserElementInCollection.embed = this.domSanitizer.bypassSecurityTrustResourceUrl(biUserElementInCollection.embed);
                }
            }
        });
    }

    deleteBiUserCollection(biElementId) {
        if (window.confirm(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.COLLECTION.DELETE.CONFIRMATION'))) {
            this.biManagementApiService.deleteBiUserCollection(biElementId).subscribe(data => {
                this.getBiUserCollection();
                this.alertToast.showSuccess(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.COLLECTION.DELETE.SUCCESS'));
            }, error => {
                this.alertToast.showError(this.translate.instant('BI-MANAGEMENT.BI-ELEMENT.COLLECTION.DELETE.ERROR'));
            });
        }
    }

}
