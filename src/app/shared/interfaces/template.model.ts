/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface Template {
    id: number;
    language_id: number;
    type: string;
    name: string;
    text: string;
    header?: string;
    button?: string;
    class?: string;
    colour?: string;
    title?: string;
    blade_file?: string;
    pdf_generator?: string;
    openedEditor?: string;
    hasHTML?: string;
    updated_by: number;
    deleted_by: number;
}
