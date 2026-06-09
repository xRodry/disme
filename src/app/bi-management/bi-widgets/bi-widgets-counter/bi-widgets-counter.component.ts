/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from "@angular/core";
import { BiManagementApiService } from "../../../shared/rest-api/bi-management-api.service";
import { BiWidgetElementCounter } from "../../../shared/interfaces/bi_widget_element_counter.model";

@Component({
    selector: "app-bi-widgets-counter",
    templateUrl: "./bi-widgets-counter.component.html",
    styleUrls: ["./bi-widgets-counter.component.css"],
})
export class BiWidgetsCounterComponent implements OnInit {
    protected biElements: BiWidgetElementCounter = {} as BiWidgetElementCounter;
    protected biElementTypes: BiWidgetElementCounter =
        {} as BiWidgetElementCounter;
    protected biKnowages: BiWidgetElementCounter = {} as BiWidgetElementCounter;
    protected biEngines: BiWidgetElementCounter = {} as BiWidgetElementCounter;

    constructor(private biManagementApiService: BiManagementApiService) {}

    ngOnInit() {
        this.getBiWidgetCounts();
    }

    getBiWidgetCounts() {
        this.biManagementApiService.getBiWidgetCounts().subscribe((data) => {
            this.biElements.totalElements = data.biElementsCount;
            this.biElementTypes.totalElements = data.biElementTypeCount;
            this.biKnowages.totalElements = data.biKnowageCount;
            this.biEngines.totalElements = data.biEngineCount;
            this.initiateAnimations();
        });
    }

    initiateAnimations() {
        this.initiateAnimationCounter(this.biElements, 150);
        this.initiateAnimationCounter(this.biKnowages, 150);
        this.initiateAnimationCounter(this.biElementTypes, 200);
        this.initiateAnimationCounter(this.biEngines, 200);
    }

    initiateAnimationCounter(
        elementCounterObject: BiWidgetElementCounter,
        timeout
    ) {
        elementCounterObject.elementCounter = 0;
        // No need to call the animation if there are no elements specified
        if (elementCounterObject.totalElements) {
            // Used so that there's an "animation" of the number of a certain widget going from 0 to totalElements
            // @ts-ignore
            elementCounterObject.intervalIdentifier = setInterval(() => {
                elementCounterObject.elementCounter++;
                if (
                    elementCounterObject.elementCounter ===
                    elementCounterObject.totalElements
                ) {
                    clearInterval(elementCounterObject.intervalIdentifier);
                }
            }, timeout);
        }
    }
}
