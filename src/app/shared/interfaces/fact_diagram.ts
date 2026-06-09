/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {FactDiagram} from './fact_diagram.model';

// Trigger template factDiagram
export class FactDiagrams {
    success: boolean;
    data: FactDiagram[];
    message: string;

    constructor(success: boolean, data: FactDiagram[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
