/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, OnInit} from '@angular/core';
import {AlertToastService} from '../shared/common/alert-toast.service';
import {FormApiService} from '../shared/rest-api/form-api.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import formio_lang from 'src/assets/i18n/formio_render.json';
import flatpickr from 'flatpickr';
import flatpickrLang from 'flatpickr/dist/l10n';
import {Token} from '../shared/rest-api/token';

@Component({
    selector: 'app-dynamic-form-rendered',
    templateUrl: './dynamic-form-rendered.component.html',
    styleUrls: ['./dynamic-form-rendered.component.css']
})
export class DynamicFormRenderedComponent implements OnInit {

    public myForm: any = {
        components: []
    };
    public idForm: any;
    public showForm = false;

    public formSubmission: any = {
        data: {}
    };

    public languageAbbrv: any;

    public options: any = {
        disableAlerts: true,
        i18n: formio_lang
    };

    constructor(
        private alertToast: AlertToastService,
        public restFormApi: FormApiService,
        public translate: TranslateService,
        private route: ActivatedRoute,
        public router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.idForm = params.id;
        });
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        flatpickr.localize(flatpickrLang[this.languageAbbrv]);
        this.renderDynamicForm(this.idForm);
    }

    renderDynamicForm(id) {
        this.restFormApi.getForm(id).subscribe((data: any) => {
            this.myForm = JSON.parse(data.json);
            this.showForm = true;
            this.alertToast.showSuccess(this.translate.instant('FORM-RENDER.OPERATION-SUCCESS'));
        }, error => {
            this.alertToast.showError(this.translate.instant('FORM-RENDER.OPERATION-ERROR'));
        });
    }

    // Get form data so we can handle it
    onSubmit(event) {
        this.formSubmission = event.data;
        console.log('Form Submission', this.formSubmission);
        // Handle submission
        this.goBack();
    }

    // Go back to the old page
    goBack() {
        this.router.navigate(['/formsManagement']);
    }
}
