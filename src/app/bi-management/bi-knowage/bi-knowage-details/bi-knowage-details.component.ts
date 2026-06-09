/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component, OnInit } from '@angular/core';
import { BiManagementApiService } from '../../../shared/rest-api/bi-management-api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {BiKnowage} from '../../../shared/interfaces/bi_knowage.model';
import {Token} from '../../../shared/rest-api/token';

declare const Sbi: any;
declare var $;

@Component({
    selector: 'app-bi-knowage-details',
    templateUrl: './bi-knowage-details.component.html',
    styleUrls: ['./bi-knowage-details.component.css']
})

export class BiKnowageDetailsComponent implements OnInit {

    public biKnowage: BiKnowage = {} as BiKnowage;
    private languageFileUrl: string;

    constructor(
        private biManagementApiService: BiManagementApiService,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.biKnowage.id = this.route.snapshot.params.biKnowageId;
        this.languageFileUrl = 'assets/i18n/' + Token.getTokenLanguage() + '.json';
        this.setKnowageBaseUrl();
        this.getBiKnowageDetailModel();
    }

    setKnowageBaseUrl() {
        Sbi.sdk.services.setBaseUrl({
            protocol: 'http',
            host: 'localhost',
            port: '8080',
            contextPath: 'knowage',
            controllerPath: 'servlet/AdapterHTTP'
        });
    }

    getBiKnowageDetailModel() {
        this.biManagementApiService.getBiKnowage(this.biKnowage.id).subscribe(data => {
            this.biKnowage = data;
            if (typeof this.biKnowage.preview === 'string') {
                this.biKnowage.preview = this.domSanitizer.bypassSecurityTrustResourceUrl(this.biKnowage.preview);
            }
        });
    }

    getBiKnowageSdkDoc() {
        Sbi.sdk.api.injectDocument({
            documentLabel: this.biKnowage.label,
            documentName: this.biKnowage.name,
            executionRole: this.biKnowage.role,
            displayToolbar: this.biKnowage.display_toolbar,
            canResetParameters: this.biKnowage.reset_parameters,
            displaySliders: this.biKnowage.display_sliders,
            target: 'targetDiv',
            iframe: {
                style: 'border: 0px; height:100vh; width:100%;'
            },
            useExtUI: true
        });
    }

    getBiKnowageDataset() {
        Sbi.sdk.cors.api.executeDataSet({
            datasetLabel: this.biKnowage.dataset_label, callbackOk(obj) {
                let str = '<thead><tr>';
                str += '<th>Id</th>';
                const fields = obj.metaData.fields;
                for (const fieldIndex in fields) {
                    if (fields[fieldIndex].hasOwnProperty('header')) {
                        str += '<th>' + fields[fieldIndex].header + '</th>';
                    }
                }
                str += '</tr></thead>';
                str += '<tbody>';

                const rows = obj.rows;
                for (const rowIndex of rows) {
                    str += '<tr>';
                    for (const colIndex of rows[rowIndex]) {
                        str += '<td>' + rows[rowIndex][colIndex] + '</td>';
                    }
                    str += '</tr>';
                }

                str += '</tbody>';
                document.getElementById('knowageDataset').innerHTML = str;
                $('#knowageDataset').DataTable( {
                    dom: '<"dtsp-verticalContainer"<"dtsp-verticalPanes"P>Q<"dtsp-dataTable"' +
                        '<\'row\'<\'col-sm-12 col-md-4\'l><\'col-sm-12 col-md-4\'B><\'col-sm-12 col-md-4\'f>>' +
                        '<\'row\'<\'col-sm-12\'tr>>' +
                        '<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>' + '>>',
                    language: {
                        url: this.languageFieldUrl
                    },
                    deferRender: true,
                    scrollX: true,
                    pageLength: 10,
                    destroy: true,
                    searchPanes: {
                        columns: [2, 3, 4, 5],
                        dtOpts: {
                            select: {
                                style: 'multi'
                            }
                        },
                        cascadePanes: true
                    },
                    searchBuilder: {
                        orthogonal: {
                            display: 'filter'
                        },
                    },
                    select: {
                        style: 'multi'
                    },
                    buttons: [
                        {
                            extend: 'colvis',
                            text: '<i class="fa fa-columns"></i>',
                            collectionLayout: 'fixed two-column',
                            collectionTitle: 'Visibilidade das colunas',
                            titleAttr: 'Visibilidade da Coluna',
                            columnText: function ( dt, idx, title ) {
                                return (idx + 0) + '- ' + title;
                            },
                            columns: ':gt(0)'
                        },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i>',
                            titleAttr: 'Excel',
                            autoFilter: true,
                            exportOptions: {
                                columns: ':visible',
                                orthogonal: 'export'
                            }
                        },
                        {
                            extend: 'print',
                            text: '<i class="fa fa-print"></i>',
                            exportOptions: {
                                columns: ':visible',
                                orthogonal: 'export'
                            }
                        }
                    ],
                } );
            }
        });
    }
}
