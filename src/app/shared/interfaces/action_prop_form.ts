/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ActionPropForm} from './action_prop_form.model';

// Trigger template transactionType
export class ActionPropForms {
    success: boolean;
    data: ActionPropForm[];
    message: string;

    constructor(success: boolean, data: ActionPropForm[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
