<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Http\Request;

//TESTE

Route::any('/dynamic/{function}/{test}', 'GeneralController@redirect');

Route::group(
    [
        'prefix' => 'auth',
    ],
    function () {
        Route::post('login', 'AuthController@login');
        Route::post('signup', 'AuthController@signup');


        Route::group(
            [
                'middleware' => 'auth:api',
            ],
            function () {
                Route::get('logout', 'AuthController@logout');
                Route::get('user', 'AuthController@user');



                //Spreadsheet stuff
                Route::post(
                    '/spreadsheet/uploadSpreadsheet/',
                    'SpreadsheetController@uploadSpreadsheet'
                );

                Route::post(
                    '/spreadsheet/uploadSelectedSheets/',
                    'SpreadsheetController@uploadSelectedSheets'
                );

                Route::apiResource('languages', 'LanguageController');
                Route::apiResource(
                    'language_states',
                    'LanguageStateController'
                );

                Route::post('/roles/translate/', 'RoleController@translate');
                Route::apiResource('roles', 'RoleController');
                Route::get('/roleInitiatesTransaction/{roleId}/{transactionTypeId}', 'RoleInitiatesTransactionController@show');
                Route::put('/roleInitiatesTransaction/{roleId}/{transactionTypeId}', 'RoleInitiatesTransactionController@update');
                Route::delete('/roleInitiatesTransaction/{roleId}/{transactionTypeId}/', 'RoleInitiatesTransactionController@destroy');
                Route::apiResource('roleInitiatesTransaction', 'RoleInitiatesTransactionController');
                Route::get('/roleHasUser/get_user_roles', 'RoleHasUserController@getUserRoles');
                Route::get('/roleHasUser/{roleId}/{userId}', 'RoleHasUserController@show');
                Route::put('/roleHasUser/{roleId}/{userId}', 'RoleHasUserController@update');
                Route::delete('/roleHasUser/{roleId}/{userId}/', 'RoleHasUserController@destroy');
                Route::apiResource('roleHasUser', 'RoleHasUserController');

                Route::apiResource('users', 'UsersController');

                //Actors Bernardo
                Route::apiResource('actors', 'ActorController');
                //Route::apiResource('actor_states', 'ActorStateController');

                //Process Types
                Route::get('/processtypes/getQueriesOfProcessType/{processTypeId}', 'ProcessTypeController@getQueriesOfProcessType');
                Route::post('/processtypes/translate', 'ProcessTypeController@translate');
                Route::apiResource('processtypes', 'ProcessTypeController');
                Route::apiResource(
                    'processtypestates',
                    'ProcessTypeStateController'
                );

                Route::post('/transactionType/translate', 'TransactionTypeController@translate');
                Route::apiResource('transactionType', 'TransactionTypeController');
                Route::post('/propUnitType/translate', 'PropUnitTypeController@translate');
                Route::apiResource('propUnitType', 'PropUnitTypeController');
                Route::apiResource('waitingLink', 'WaitingLinkController');

                //<editor-fold desc="EDMS section">
                Route::apiResource('documenttypes', 'DocumentTypeController');
                Route::apiResource('cabinets', 'CabinetController');
                Route::apiResource('cabinetdocuments', 'CabinetDocumentController');
                Route::apiResource('currentusers', 'CurrentUserController');
                Route::apiResource('documentcomments', 'DocumentCommentController');
                Route::apiResource('documents', 'DocumentController');
                Route::apiResource('documentmetadata', 'DocumentMetadataController');
                Route::apiResource('documenttags', 'DocumentTagController');
                Route::apiResource('documentversions', 'DocumentVersionController');
                Route::apiResource('groups', 'GroupController');
                Route::apiResource('indexes', 'IndexController');
                Route::apiResource('indextemplates', 'IndexTemplateController');
                Route::apiResource('keys', 'KeyController');
                Route::apiResource('messages', 'MessageController');
                Route::apiResource('metadatatypes', 'MetadataTypeController');
                Route::apiResource('objectacls', 'ObjectAclController');
                Route::apiResource('objectaclpermissions', 'ObjectAclPermissionController');
                Route::apiResource('rolesedms', 'RoleEdmsController');
                Route::apiResource('smartlinkconditions', 'SmartLinkConditionController');
                Route::apiResource('smartlinks', 'SmartLinkController');
                Route::apiResource('stagingfolders', 'StagingFolderController');
                Route::apiResource('stagingfolderfiles', 'StagingFolderFileController');
                Route::apiResource('tags', 'TagController');
                Route::apiResource('trasheddocuments', 'TrashedDocumentController');
                Route::apiResource('usersedms', 'UserEdmsController');
                Route::apiResource('workflows', 'WorkflowController');
                Route::apiResource('workflowdocumenttypes', 'WorkflowDocumentTypeController');
                Route::apiResource('workflowstates', 'WorkflowStateController');
                Route::apiResource('workflowtransitions', 'WorkflowTransitionController');
                //</editor-fold>

                // Form Controller - For Editor/Translator/Renderer
                Route::put('/forms', 'FormController@update'); // Update method without passing id (is passed in the request object) - must be before forms apiResource declaration
                Route::get('/forms/get_action_properties_form_editing/{actionId}', 'FormController@getActionPropertiesForFormEditing');
                Route::get('/forms/get_action_entity_form_editing/{actionId}', 'FormController@getActionEntityForFormEditing');
                Route::get('/forms/get_action_properties_form_rendering/{actionId}', 'FormController@getActionPropertiesForFormRendering');
                Route::get('/forms/get_action_properties_form_rendering/{actionId}/{entityId}', 'FormController@getActionPropertiesForFormRendering');
                Route::get('/forms/get_action_properties_form_translation/{actionId}/{formBeingTranslatedLangId}', 'FormController@getActionPropertiesForFormTranslation');
                Route::get('/forms/action_prop_forms_form/{id}', 'FormController@getActionPropForms');

                Route::post('/forms/delete_all_retired_forms', 'FormController@deleteAllRetiredForms');

                // Form Controller - Translator
                Route::get('/formsToTranslate', 'FormController@getFormsToTranslate');
                Route::get('/formToTranslate/{idForm}/{idLang}', 'FormController@getFormToTranslate');
                Route::post('/forms/create_translated_form', 'FormController@createTranslatedForm');

                Route::get('/actions/getActionsWithFormFacts/{deletedActionRule}', 'ActionController@getActionsWithFormFacts');
                Route::apiResource('forms', 'FormController');
                Route::apiResource('actions', 'ActionController');
                Route::apiResource('actions_prop', 'ActionPropController');
                Route::apiResource('actions_prop_form', 'ActionPropFormController');
                Route::apiResource('validation_cond', 'ValidationCondController');

                Route::apiResource('tstates', 'TStatesController');

                //Process Details
                Route::get('/processDetails', 'ProcessDetailsController@index');
                Route::post('/processDetails', 'ProcessDetailsController@store');
                Route::put('/processDetails/{process_type_id}/{property_id}', 'ProcessDetailsController@update');
                Route::delete('/processDetails/{process_type_id}/{property_id}', 'ProcessDetailsController@destroy');
                Route::get('/processDetails/getPropertiesOfProcessType/{process_type_id}', 'ProcessDetailsController@getAllPropertiesOfProcessType');
                Route::get('/processDetails/{process_type_id}/{property_id}', 'ProcessDetailsController@show');

                //Dashboard
                Route::get('/dashboardManage', 'DashboardController@index');
                Route::get(
                    '/dashboard/get_all_inic_trans',
                    'DashboardController@getAllInicTransactions'
                );
                Route::post(
                    '/dashboard/get_data_for_tab',
                    'DashboardController@startNewTransaction'
                );

                //Blockly Vítor
                Route::get('/blockly/get_queries','BlocklyController@getQueries');
                Route::get('/blockly/get_action_rules','BlocklyController@getActionRules');
                Route::get('/blockly/get_action_rule/{id}','BlocklyController@getActionRule');
                Route::delete('/blockly/delete_action_rule/{action_rule_id}','BlocklyController@deleteActionRule');
                Route::post('/blockly/store_action_rule','BlocklyController@storeActionRule');
                Route::apiResource('actionRuleDraft', 'ActionRuleDraftController');

                // Dashboard - Érica
                Route::get('/dashboard/get_processes_that_user_can_initiate', 'DashboardController@getProcessesThatUserCanInitiate');
                Route::get('/dashboard/get_finished_tasks', 'DashboardController@getFinishedTasks');
                Route::get('/dashboard/get_pending_tasks_to_execute', 'DashboardController@getPendingTasksToExecute');
                Route::get('/dashboard/get_delegated_pending_tasks_to_execute', 'DashboardController@getPendingDelegatedTasksToExecute');
                Route::get('/dashboard/get_delegated_tasks/{roleID}', 'DashboardController@getDelegatedTasks');
                Route::get('/dashboard/get_tasks/{roleID}/{processTypeID}', 'DashboardController@getTasksByProcessTypeId');
                Route::get('/dashboard/get_tasks_init_after_processes', 'DashboardController@getTasksThatCanInitAfterProcess');

                // Dashboard Vítor
                Route::post('/dashboard/start_process','DashboardController@startProcess');
                Route::post('/dashboard/initiate_task_existing_process','DashboardController@initiateTaskExistingProcess');
                Route::get('/dashboard/get_processes_available_to_initiate_task/{processTypeId}/{transactionTypeId}', 'DashboardController@getProcessesAvailableToInitiateTask');
                Route::post('/dashboard/acknowledge_task','DashboardController@acknowledgeTask');

                Route::get('/delegation/getTasksToDelegate','DelegationController@getTasksToDelegate');
                Route::get('/delegation/getUserRoles','DelegationController@getUserRoles');
                Route::get('/delegation/getUsersFromRole/{roleId}','DelegationController@getUsersFromRole');
                Route::apiResource('delegation', 'DelegationController');


                // Template Management - Vitor
                Route::post('/templates/translate', 'TemplateController@translate');
                Route::get('/templates/getPDFFromEDMS/{docEDMSId}','TemplateController@getPDFFromEDMS');
                Route::apiResource('templates', 'TemplateController');
                Route::post('/userEvaluatedExpression/translate', 'UserEvaluatedExpressionController@translate');
                Route::apiResource('userEvaluatedExpression', 'UserEvaluatedExpressionController');

                Route::post('/constant/translate', 'ConstantController@translate');
                Route::apiResource('constant', 'ConstantController');

                Route::post('/contextVariable/translate', 'ContextVariableController@translate');
                Route::apiResource('contextVariable', 'ContextVariableController');

                // Execution Engine
                Route::post('/executionEngine/evaluateAction','ExecutionEngineController@evaluateAction');
                // Execution Storage
                Route::post('/executionStorage/store_action_log', 'ExecutionStorageController@storeActionLog');
                Route::post('/executionStorage/store_uee_log','ExecutionStorageController@storeUserEvaluatedExpressionLog');
                Route::post('/executionStorage/store_form_data','ExecutionStorageController@storeFormSubmittedData');
                Route::post('/executionStorage/store_derived_properties_only','ExecutionStorageController@storeEEIWithDerivedPropertiesOnly');
                Route::post('/executionStorage/store_fact_specification_ae_data','ExecutionStorageController@storeFactSpecificationAssignExpressionData');


                // Dynamic Search
                Route::apiResource('queries', 'QueryController');
                Route::post('/dynSearch/save_url', 'DynSearchController@saveURL');
                Route::post('/dynSearch/get_query_results', 'DynSearchController@getQueryResults');
                Route::post('/dynSearch/test_query_results', 'DynSearchController@testQueryResults');

                Route::any('/dynamic/{function}/{test}', 'GeneralController@redirect');

                Route::apiResource('entities', 'EntityController');

                Route::post('/entitytypes/translate', 'EntityTypeController@translate');
                Route::get('/entitytypes/userDetails', 'EntityTypeController@getUserDetailsEntTypes');
                Route::get('/entitytypes/getEntTypesWithProperties', 'EntityTypeController@getEntTypesWithProperties');
                Route::apiResource('entitytypes', 'EntityTypeController');

                Route::post('/values/translate/', 'ValueController@translate');
                Route::get('/values/deleteAllTestData', 'ValueController@deleteAllTestData');
                Route::apiResource('values', 'ValueController');

                Route::get('/properties/get_referenced_properties', 'PropertyController@getReferencedPropertiesWithValues');
                Route::post('/properties/translate', 'PropertyController@translate');
                Route::get('/properties/getPropertiesForEntType/{entTypeId}', 'PropertyController@getPropertiesForEntityType');
                Route::get('/properties/getPropertiesForEntType/{entTypeId}/{entityId}', 'PropertyController@getPropertiesForEntityType');
                Route::apiResource('properties', 'PropertyController');


                // BI Management
                Route::get('/biElement/getBiWidgetCounts', 'BiElementController@getBiWidgetCounts');
                Route::apiResource('biElement', 'BiElementController');
                Route::apiResource('biElementType', 'BiElementTypeController');
                Route::apiResource('biElementCollection', 'BiElementCollectionController');
                Route::get('/biEngine/getBiEngineBiElements/{biEngineId}', 'BiEngineController@getBiEngineBiElements');
                Route::apiResource('biEngine', 'BiEngineController');
                Route::apiResource('biKnowage', 'BiKnowageController');


                // End Bi Management

                Route::get(
                    '/dashboard/get_processes_of_tr/{id}',
                    'DashboardController@getAllProcessOfTr'
                );

                Route::get(
                    '/dashboard/get_all_inic_exec_trans',
                    'DashboardController@getAllInicExecTrans'
                );

                //        Route::get('/dashboard/get_inic_trans_by_id', 'DashboardController@getInicTransactionbyId');

                Route::post(
                    '/dashboard/verify_can_use_proc/',
                    'DashboardController@verifCanUseProc'
                );

                Route::get('/tabError', function () {
                    return view('dashboard/tabError');
                });

                Route::get('/tabProcess', function () {
                    return view('dashboard/tabProcess');
                });

                Route::get('/modalDialog', function () {
                    return view('dashboard/modalDialog');
                });

                Route::get('/modalTask', function () {
                    return view('dashboard/modalTask');
                });
                Route::get('/tabTask', function () {
                    return view('dashboard/tabTask');
                });
                Route::get('/tabFormTask', function () {
                    return view('dashboard/tabFormTask');
                });
                Route::get('/formCActTask', function () {
                    return view('dashboard/formCActTask');
                });
                Route::get('/tabProdDocTask', function () {
                    return view('dashboard/tabProdDocTask');
                });
                Route::get('/tabChildFormTask', function () {
                    return view('dashboard/tabChildFormTask');
                });

                Route::get('/popover', function () {
                    return view('dashboard/popover');
                });

                Route::post(
                    '/dashboard/send_partial_data',
                    'DashboardController@insertPartialData'
                );

                Route::get('/modalNotification', function () {
                    return view('dashboard/modalNotification');
                });
                Route::post(
                    '/dashboard/trans_ack',
                    'DashboardController@transactionAckAll'
                );
                //MODAL CONTINUE TRANSACTION
                Route::get('/modalContinueTransaction', function () {
                    return view('dashboard/modalContinueTransaction');
                });
                Route::get(
                    '/dashboard/get_all_states_for_transaction/{id}',
                    'DashboardController@getStatesFromTransaction'
                );

                Route::get('/enums/getEnumValues/{table}/{column}', 'Enumcontroller@indexEnumValues');

                // Process Diagram
                Route::apiResource('processDiagram', 'ProcessDiagramController');
                Route::post('/processDiagram/save', 'ProcessDiagramController@storeOrUpdate');
                Route::post('/processDiagram/bulk-save', 'ProcessDiagramController@bulkSave');
                Route::apiResource('causalLink', 'CausalLinkController');
                Route::apiResource('actionRule', 'ActionRuleController');

                // Fact Diagram
                Route::apiResource('factDiagram', 'FactDiagramController');
                Route::post('/factDiagram/save', 'FactDiagramController@storeOrUpdate');
                Route::post('/factDiagram/bulk-save', 'FactDiagramController@bulkSave');
            }
        );
    }
);
//FIM TESTE

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

//Route::apiResource('languages', 'LanguageController');
//Route::apiResource('language_states', 'LanguageStateController');
