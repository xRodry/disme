/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BiEngine } from '../../../shared/interfaces/bi_engine.model';

@Component({
    selector: 'app-bi-engine-bielements',
    templateUrl: './bi-engine-bielements.component.html',
    styleUrls: ['./bi-engine-bielements.component.css']
})

export class BiEngineBielementsComponent implements OnInit {

    public biEngine: BiEngine = {} as BiEngine;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.biEngine.id = this.route.snapshot.params.biEngineId;
        this.getBiEngineWithElements();
    }

    getBiEngineWithElements() {
        this.biManagementApiService.getBiEngineWithElements(this.biEngine.id).subscribe(data => {
            this.biEngine = data;
            for (const biEngineElement of this.biEngine.biElements) {
                if (typeof biEngineElement.preview === 'string') {
                    biEngineElement.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(biEngineElement.preview);
                }
            }
        });
    }

}
