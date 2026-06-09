/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ProcessTypeState} from './processtypestate.model';

export interface Language {
  id: number;
  name: string;
  abbrv: string;
  state: string;
  created_by: number;
  updated_by: number;
  pivot: ProcessTypeState;
}
