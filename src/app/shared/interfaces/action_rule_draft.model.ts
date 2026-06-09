/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ActionRuleDraft {
  id: number;
  language_id: number;
  name: string;
  blockly_xml: string;
  preview: string;
  updated_by: number;
  deleted_by: number;
}
