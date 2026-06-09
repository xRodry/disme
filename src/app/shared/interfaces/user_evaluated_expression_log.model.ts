/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface UserEvaluatedExpressionLog {
    condition_log_id: number;
    user_evaluated_expression_id: number;
    expression_result: boolean;
    created_by: number;
    updated_by: number;
}
