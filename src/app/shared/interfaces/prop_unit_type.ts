/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {PropUnitType} from './prop_unit_type.model';

export class PropUnitTypes {
    success: boolean;
    data: PropUnitType[];
    message: string;

    constructor(success: boolean, data: PropUnitType[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
