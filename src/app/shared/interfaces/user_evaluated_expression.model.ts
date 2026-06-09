/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface UserEvaluatedExpression {
  id: number;
  user_evaluated_expression_id: number;
  language_id: number;
  expression_name: string;
  expression_text: string;
  created_by: number;
  updated_by: number;
  condition_log_id: number;
  // For parsing purposes
  type?: string;
}
