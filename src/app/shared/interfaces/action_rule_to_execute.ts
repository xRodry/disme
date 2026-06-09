/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ActionRuleToExecute} from './action_rule_to_execute.model';

// Trigger template transactionType
export class ActionRules {
    success: boolean;
    data: ActionRuleToExecute[];
    message: string;

    constructor(success: boolean, data: ActionRuleToExecute[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
