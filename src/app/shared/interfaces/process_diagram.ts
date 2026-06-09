/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ProcessDiagram} from './process_diagram.model';

// Trigger template processDiagram
export class ProcessDiagrams {
    success: boolean;
    data: ProcessDiagram[];
    message: string;

    constructor(success: boolean, data: ProcessDiagram[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
