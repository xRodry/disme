/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../shared/rest-api/bi-management-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BiKnowage } from '../../shared/interfaces/bi_knowage.model';

@Component({
    selector: 'app-bi-knowage',
    templateUrl: './bi-knowage.component.html',
    styleUrls: ['./bi-knowage.component.css']
})

export class BiKnowageComponent implements OnInit {

    protected biKnowageElements: BiKnowage[] = [];

    protected page = 1;
    protected pageSize = 9;
    protected searchText: any;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.getAllBiKnowageElements();
    }

    getAllBiKnowageElements() {
        this.biManagementApiService.getAllBiKnowage().subscribe(data => {
            this.biKnowageElements = data;
            for (const biKnowageElement of this.biKnowageElements) {
                if (typeof biKnowageElement.preview === 'string') {
                    biKnowageElement.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(biKnowageElement.preview);
                }
            }
        });
    }

}
