/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {UserEvaluatedExpressionLog} from './user_evaluated_expression_log.model';

export class UserEvaluatedExpressionLogs {
    success: boolean;
    data: UserEvaluatedExpressionLog[];
    message: string;

    constructor(success: boolean, data: UserEvaluatedExpressionLog[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
