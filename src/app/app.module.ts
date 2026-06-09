/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AlertModule} from 'ngx-bootstrap/alert';
import {ModalModule} from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormioModule} from 'angular-formio';
import { QueryBuilderModule } from 'angular2-query-builder';

import { ModalLanguageComponent } from './modal-language/modal-language.component';

import { ProcessTypeColorCustomComponent } from './modal-processtype/processtype_color.component';
import { ModalProcessTypeComponent } from './modal-processtype/modal-processtype.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessesComponent } from './dashboard/processes.component';
import { TasksComponent } from './dashboard/tasks.component';

import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {RegisterComponent} from './register/register.component';

import { BlocklyComponent } from './blockly/blockly.component';
import { ModalBlocklyComponent } from './modal-blockly/modal-blockly.component';

import { DynSearchComponent } from './dynSearch/dynSearch.component';

import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormCellCustomComponent } from './dynamic-form/dynamic-form_cell.component';
import { TranslatorFormCellComponent } from './dynamic-form/form-translator_cell.component';
import { DynamicFormFormioComponent } from './dynamic-form-formio/dynamic-form-formio.component';
import { ModalDynamicFormComponent } from './modal-dynamic-form/modal-dynamic-form.component';
import { DynamicFormRenderedComponent } from './dynamic-form-rendered/dynamic-form-rendered.component';
import { ModalFormTranslatorComponent } from './modal-form-translator/modal-form-translator.component';
import { ModalFormDashboardComponent } from './modal-form-dashboard/modal-form-dashboard.component';
import { ModalUserOutputDashboardComponent } from './modal-user-output-dashboard/modal-user-output-dashboard.component';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { ModalTemplateEditorComponent } from './modal-template-editor/modal-template-editor.component';
import { TemplateEditorCellComponent } from './template-editor/template-editor_cell.component';

import { EditorModule} from '../assets/tinymce/tinymce-angular';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { ColorPickerModule  } from 'ngx-color-picker';
import { ModalProcessDetailsComponent } from './modal-process-details/modal-process-details.component';

// Translation not working on page reload - https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
import { Injector, APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import {Token} from './shared/rest-api/token';
import { ModalSelectInstanceComponent } from './modal-select-instance/modal-select-instance.component';
import { ModalUserEvaluatedExpressionComponent } from './modal-user-evaluated-expression/modal-user-evaluated-expression.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { ModalDelegationsComponent } from './modal-delegations/modal-delegations.component';
import { DelegationsCellComponent } from './delegations/delegations_cell.component';
import { ParameterizationComponent } from './parameterization/parameterization.component';
import {ParameterizationCellCustomComponent} from './parameterization/parameterization_cell.component';
import { ModalTransactionTypeComponent } from './modal-transaction-type/modal-transaction-type.component';
import { ModalEntityTypeComponent } from './modal-entity-type/modal-entity-type.component';
import { ModalPropertyComponent } from './modal-property/modal-property.component';
import { ModalPropUnitTypeComponent } from './modal-prop-unit-type/modal-prop-unit-type.component';
import { ModalRoleComponent } from './modal-role/modal-role.component';
import { ModalRoleInitiatesTransactionComponent } from './modal-role-initiates-transaction/modal-role-initiates-transaction.component';
import { ModalRoleHasUserComponent } from './modal-role-has-user/modal-role-has-user.component';
import { ModalWaitingLinkComponent } from './modal-waiting-link/modal-waiting-link.component';
import {
    ModalParameterizationTranslationComponent
} from './modal-parameterization-translation/modal-parameterization-translation.component';
import { ModalNewUserComponent } from './modal-new-user/modal-new-user.component';
import { ModalUserDetailsDashboardComponent } from './modal-user-details-dashboard/modal-user-details-dashboard.component';
import {environment} from 'src/environments/environment';
import {
    ModalUserEvaluatedExpressionEditorComponent
} from './modal-user-evaluated-expression-editor/modal-user-evaluated-expression-editor.component';
import {UserEvaluatedExpressionCellComponent} from './template-editor/user-evaluated-expression_cell.component';
import { ModalConstantComponent } from './modal-constant/modal-constant.component';
import { ModalValueComponent } from './modal-value/modal-value.component';
import { ModalActionRuleDraftComponent } from './modal-action-rule-draft/modal-action-rule-draft.component';
import { ModalDynamicRestApiComponent } from './modal-dynamic-rest-api/modal-dynamic-rest-api.component';
import {DynamicSearchTableCellComponent} from './dynSearch/dynSearch_cell.component';
import {BiElementComponent} from './bi-management/bi-element/bi-element.component';
import {BiElementDetailsComponent} from './bi-management/bi-element/bi-element-details/bi-element-details.component';
import {
    BiElementCollectionComponent
} from './bi-management/bi-element/bi-element-collection/bi-element-collection.component';
import {BiEngineComponent} from './bi-management/bi-engine/bi-engine.component';
import {
    BiEngineBielementsComponent
} from './bi-management/bi-engine/bi-engine-bielements/bi-engine-bielements.component';
import {BiKnowageComponent} from './bi-management/bi-knowage/bi-knowage.component';
import {BiKnowageDetailsComponent} from './bi-management/bi-knowage/bi-knowage-details/bi-knowage-details.component';
import {BiDashboardComponent} from './bi-management/bi-dashboard/bi-dashboard.component';
import {BiWidgetsCounterComponent} from './bi-management/bi-widgets/bi-widgets-counter/bi-widgets-counter.component';
import {
    BiElementManagementComponent
} from './bi-management/bi-element/bi-element-management/bi-element-management.component';
import {
    BiKnowageManagementComponent
} from './bi-management/bi-knowage/bi-knowage-management/bi-knowage-management.component';
import {BiElementModalComponent} from './bi-management/bi-element/bi-element-modal/bi-element-modal.component';
import {BiElementTypeComponent} from './bi-management/bi-element/bi-element-type/bi-element-type.component';
import {
    BiElementTypeModalComponent
} from './bi-management/bi-element/bi-element-type-modal/bi-element-type-modal.component';
import {
    BiEngineManagementComponent
} from './bi-management/bi-engine/bi-engine-management/bi-engine-management.component';
import {BiEngineModalComponent} from './bi-management/bi-engine/bi-engine-modal/bi-engine-modal.component';
import {BiKnowageModalComponent} from './bi-management/bi-knowage/bi-knowage-modal/bi-knowage-modal.component';
import {BiWidgetsChartsComponent} from './bi-management/bi-widgets/bi-widgets-charts/bi-widgets-charts.component';
import {BiKnowageLoginComponent} from './bi-management/bi-knowage/bi-knowage-login/bi-knowage-login.component';
import {DataTablesModule} from 'angular-datatables';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxEchartsModule} from 'ngx-echarts';
import {
    BiElementDetailsModalComponent
} from './bi-management/bi-element/bi-element-details/bi-element-details-modal/bi-element-details-modal.component';

import 'datatables.net-fixedcolumns';
import {FactDiagramComponent} from './fact-diagram/fact-diagram.component';
import {ProcessDiagramComponent} from './process-diagram/process-diagram.component';
import { ModalProcessDiagramComponent } from './modal-process-diagram/modal-process-diagram.component';
import { ModalFactDiagramComponent } from './modal-fact-diagram/modal-fact-diagram.component';
import { ModalSaveFactDiagramComponent } from './modal-save-fact-diagram/modal-save-fact-diagram.component';
import { ModalSaveProcessDiagramComponent } from './modal-save-process-diagram/modal-save-process-diagram.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
    if (environment.production) {
        return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
    } else {
        return new TranslateHttpLoader(httpClient);
    }
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
    return () => new Promise<any>((resolve: any) => {
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const langToSet = Token.getTokenLanguage();
            translate.setDefaultLang('en');
            translate.use(langToSet).subscribe(() => {
                console.log(`Successfully initialized '${langToSet}' language.'`);
            }, err => {
                console.error(`Problem with '${langToSet}' language initialization.'`);
            }, () => {
                resolve(null);
            });
        });
    });
}

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ModalLanguageComponent,
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        ProcessTypeColorCustomComponent,
        ModalProcessTypeComponent,
        BlocklyComponent,
        ModalBlocklyComponent,
        ModalActionRuleDraftComponent,
        DynamicFormComponent,
        DynamicFormCellCustomComponent,
        DynamicFormFormioComponent,
        ModalDynamicFormComponent,
        DynamicFormRenderedComponent,
        TranslatorFormCellComponent,
        ModalFormTranslatorComponent,
        ModalFormDashboardComponent,
        ModalUserOutputDashboardComponent,
        TemplateEditorComponent,
        ModalTemplateEditorComponent,
        ModalUserEvaluatedExpressionEditorComponent,
        TemplateEditorCellComponent,
        UserEvaluatedExpressionCellComponent,
        ProcessesComponent,
        TasksComponent,
        ModalProcessDetailsComponent,
        ModalSelectInstanceComponent,
        ModalUserEvaluatedExpressionComponent,
        DelegationsComponent,
        DelegationsCellComponent,
        ModalDelegationsComponent,
        DynSearchComponent,
        ParameterizationComponent,
        ParameterizationCellCustomComponent,
        ModalTransactionTypeComponent,
        ModalEntityTypeComponent,
        ModalPropertyComponent,
        ModalPropUnitTypeComponent,
        ModalConstantComponent,
        ModalValueComponent,
        ModalRoleComponent,
        ModalRoleInitiatesTransactionComponent,
        ModalRoleHasUserComponent,
        ModalWaitingLinkComponent,
        ModalParameterizationTranslationComponent,
        ModalNewUserComponent,
        ModalUserDetailsDashboardComponent,
        ModalUserEvaluatedExpressionEditorComponent,
        ModalDynamicRestApiComponent,
        DynamicSearchTableCellComponent,
        BiElementComponent,
        BiElementDetailsComponent,
        BiElementCollectionComponent,
        BiEngineComponent,
        BiEngineBielementsComponent,
        BiKnowageComponent,
        BiKnowageDetailsComponent,
        BiDashboardComponent,
        BiWidgetsCounterComponent,
        BiElementManagementComponent,
        BiKnowageManagementComponent,
        BiElementModalComponent,
        BiElementTypeComponent,
        BiElementTypeModalComponent,
        BiEngineManagementComponent,
        BiEngineModalComponent,
        BiKnowageModalComponent,
        BiWidgetsChartsComponent,
        BiKnowageLoginComponent,
        BiElementDetailsModalComponent,
        FactDiagramComponent,
        ProcessDiagramComponent,
        ModalProcessDiagramComponent,
        ModalFactDiagramComponent,
        ModalSaveFactDiagramComponent,
        ModalSaveProcessDiagramComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        ModalModule.forRoot(),
        AgGridModule.withComponents([]),
        NgSelectModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        BsDatepickerModule.forRoot(),
        AlertModule.forRoot(),
        ToastrModule.forRoot(),
        QueryBuilderModule,
        FormioModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        EditorModule,
        ChartsModule,
        ColorPickerModule,
        DataTablesModule,
        Ng2SearchPipeModule,
        NgxEchartsModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true
        },
        BsModalRef,
        ThemeService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ModalLanguageComponent,
        ModalProcessTypeComponent,
        ProcessTypeColorCustomComponent,
        DynamicFormCellCustomComponent,
        ModalDynamicFormComponent,
        TranslatorFormCellComponent,
        ModalFormTranslatorComponent,
        ModalBlocklyComponent,
        ModalActionRuleDraftComponent,
        ModalFormDashboardComponent,
        ModalUserOutputDashboardComponent,
        ModalTemplateEditorComponent,
        ModalUserEvaluatedExpressionEditorComponent,
        TemplateEditorCellComponent,
        UserEvaluatedExpressionCellComponent,
        ModalProcessDetailsComponent,
        ModalSelectInstanceComponent,
        ModalUserEvaluatedExpressionComponent,
        ModalDelegationsComponent,
        DelegationsCellComponent,
        ParameterizationCellCustomComponent,
        ModalTransactionTypeComponent,
        ModalEntityTypeComponent,
        ModalPropertyComponent,
        ModalPropUnitTypeComponent,
        ModalConstantComponent,
        ModalValueComponent,
        ModalRoleComponent,
        ModalRoleInitiatesTransactionComponent,
        ModalRoleHasUserComponent,
        ModalWaitingLinkComponent,
        ModalParameterizationTranslationComponent,
        ModalNewUserComponent,
        ModalUserDetailsDashboardComponent,
        ModalDynamicRestApiComponent,
        DynamicSearchTableCellComponent,
        BiElementModalComponent,
        BiElementTypeModalComponent,
        BiEngineModalComponent,
        BiKnowageModalComponent,
        BiElementDetailsModalComponent,
        FactDiagramComponent,
        ProcessDiagramComponent,
        ModalProcessDiagramComponent,
        ModalFactDiagramComponent,
        ModalSaveFactDiagramComponent,
        ModalSaveProcessDiagramComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
