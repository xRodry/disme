/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../shared/rest-api/bi-management-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BiEngine } from '../../shared/interfaces/bi_engine.model';


@Component({
    selector: 'app-bi-engine',
    templateUrl: './bi-engine.component.html',
    styleUrls: ['./bi-engine.component.css']
})

export class BiEngineComponent implements OnInit {

    public biEngines: BiEngine[] = [];

    constructor(
        private biManagementApiService: BiManagementApiService,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.getAllEnginesText();
    }

    getAllEnginesText() {
        this.biManagementApiService.getAllBiEngines().subscribe(data => {
            this.biEngines = data;
            for (const biEngine of this.biEngines) {
                if (typeof biEngine.logo_preview === 'string') {
                    biEngine.logo_preview = this.domSanitizer.bypassSecurityTrustResourceUrl(biEngine.logo_preview);
                }
            }
        });
    }
}
