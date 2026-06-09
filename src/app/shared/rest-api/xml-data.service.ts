/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class XmlDataService {

    private xmlContent: string | null = null;
    private toSaveContent: string | null = null;
    private processType: number | null = null;

    // XML
    setXml(content: string): void {
        this.xmlContent = content;
    }

    getXml(): string | null {
        return this.xmlContent;
    }

    // Process Type
    setProcessType(procId: number): void {
        this.processType = procId;
    }

    getProcessType(): number | null {
        return this.processType;
    }

    clearXmlData(): void {
        this.processType = null;
        this.xmlContent = null;
    }

    // To Save Content (isto existe mais por causa da opção 'Current DB')
    setToSaveContent(content: string): void {
        this.toSaveContent = content;
    }

    getToSaveContent(): string | null {
        return this.toSaveContent;
    }

    clearToSaveContent(): void {
        this.toSaveContent = null;
    }

}
