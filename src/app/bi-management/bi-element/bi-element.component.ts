/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../shared/rest-api/bi-management-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BiElement } from '../../shared/interfaces/bi_element.model';

@Component({
    selector: 'app-bi-element',
    templateUrl: './bi-element.component.html',
    styleUrls: ['./bi-element.component.css']
})
export class BiElementComponent implements OnInit {

    public page = 1;
    public pageSize = 9;
    public biElements: BiElement[] = [];
    public searchText: any;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private domSanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.getBiElementDetailText();
    }

    getBiElementDetailText() {
        this.biManagementApiService.getAllBiElements().subscribe(data => {
            this.biElements = data;
            for (const biElement of this.biElements) {
                if (typeof biElement.preview === 'string') {
                    biElement.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(biElement.preview);
                }
                // console.table('BiElement detail text', this.biElements);
            }
        });
    }

}
