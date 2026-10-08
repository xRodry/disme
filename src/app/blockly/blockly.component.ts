/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Component, OnInit} from '@angular/core';
import * as xml2js from 'xml2js';
import {ActionRule} from '../shared/interfaces/action_rule.model';
import {Action} from '../shared/interfaces/action.model';
import {Property} from '../shared/interfaces/property.model';
import {ConstantDB} from '../shared/interfaces/constant.model';
import {ValueTerm} from '../shared/interfaces/value_term.model';
import {PropertyValue} from '../shared/interfaces/property_value.model';
import {ComputeExpression} from '../shared/interfaces/compute_expression.model';
import {Query} from '../shared/interfaces/query.model';
import {Template} from '../shared/interfaces/template.model';
import {CompEvaluatedExpression} from '../shared/interfaces/comp_evaluated_expression.model';
import {Condition} from '../shared/interfaces/condition.model';
import {UserEvaluatedExpression} from '../shared/interfaces/user_evaluated_expression.model';
import {ValidationCondition} from '../shared/interfaces/validation_condition.model';
import {FormCalculation} from '../shared/interfaces/form_calculation.model';

import {BlocklyApiService} from '../shared/rest-api/blockly-api.service';
import {TransactionTypeApiService} from '../shared/rest-api/transaction-type-api.service';
import {TransactionStateApiService} from '../shared/rest-api/transaction-state-api.service';
import {EnttypeApiService} from '../shared/rest-api/enttype-api.service';
import {TemplateApiService} from '../shared/rest-api/template-api.service';
import {PropertyApiService} from '../shared/rest-api/property-api.service';

import {TranslateService} from 'node_modules/@ngx-translate/core';
import {ModalBlocklyComponent} from '../modal-blockly/modal-blockly.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Token} from '../shared/rest-api/token';

import {AlertToastService} from '../shared/common/alert-toast.service';
import {ModalTemplateEditorComponent} from '../modal-template-editor/modal-template-editor.component';
import {UserEvaluatedExpressionApiService} from '../shared/rest-api/user-evaluated-expression-api.service';
import {ConstantApiService} from '../shared/rest-api/constant-api.service';
import {ModalActionRuleDraftComponent} from '../modal-action-rule-draft/modal-action-rule-draft.component';
import {ActionRuleDraft} from '../shared/interfaces/action_rule_draft.model';
import {
    ModalUserEvaluatedExpressionEditorComponent
} from '../modal-user-evaluated-expression-editor/modal-user-evaluated-expression-editor.component';
import {ActionDerivedProp} from '../shared/interfaces/action_derived_prop.model';
import {PropRefFormFilter} from '../shared/interfaces/prop_ref_form_filter.model';
import {QueryParameter} from '../shared/interfaces/query_parameter.model';
import {ScheduleSlotOrigin} from '../shared/interfaces/schedule_slot_origin.model';
import {
    ScheduleSlotResult,
    ScheduleSlotResultAdditionalProperty
} from '../shared/interfaces/schedule_slot_result.model';
import {ContextVariable} from '../shared/interfaces/context_variable.model';
import {Term} from '../shared/interfaces/term.model';
import {ContextVariableApiService} from '../shared/rest-api/context-variable-api.service';
import {EntityType} from '../shared/interfaces/enttype.model';

declare var Blockly: any;

declare const customBlocks: any;

@Component({
    selector: 'app-blockly',
    templateUrl: './blockly.component.html',
    styleUrls: ['./blockly.component.css'],
    providers: [ModalBlocklyComponent]
})
export class BlocklyComponent implements OnInit {

    workspace: any;
    public count = 0;
    public TransactionTypes: any = [];
    private transactionTypesLoaded = false;
    public TransactionStates: any = [];
    private transactionStatesLoaded = false;
    public EntTypes: any = [];
    private entTypesLoaded = false;
    public Templates: any = [];
    private templatesLoaded = false;
    public UserEvaluatedExpressions: any = [];
    private userEvaluatedExpressionsLoaded = false;
    public Queries: any = [];
    private queriesLoaded = false;
    public Constants: any = [];
    private contextVariablesLoaded = false;
    public ContextVariables: any = [];
    private constantsLoaded = false;
    public Properties: any = [];
    private propertiesLoaded = false;
    public xmlToLoad: any;
    private languageAbbrv;

    public actionRuleDraft;
    public loadedActionRuleId: number = null;
    public savingActionRule = false;
    public dbCausalLinks: any[] = [];

    constructor(
        private modalService: BsModalService,
        private alertToast: AlertToastService,
        public restBlocklyApi: BlocklyApiService,
        public restTransactionTypeApi: TransactionTypeApiService,
        public restTStateApi: TransactionStateApiService,
        public restEntTypeApi: EnttypeApiService,
        public restTemplateApi: TemplateApiService,
        public restPropertyApi: PropertyApiService,
        public restUserEvaluatedExpressionApi: UserEvaluatedExpressionApiService,
        public restConstantApi: ConstantApiService,
        public restContextVariableApi: ContextVariableApiService,
        public translate: TranslateService
    ) {  }

    ngOnInit() {
        this.languageAbbrv = Token.getTokenLanguage();
        this.translate.use(this.languageAbbrv);
        this.loadBlocklyCategoryNames();
        this.workspace = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox'),
            collapse : false,
            comments : true,
            disable : true,
            trashcan : true,
            horizontalLayout : false,
            maxInstances: {
                when_is_do: 1
            },
            toolboxPosition : 'start',
            renderer: 'geras',
            css : true,
            media : 'https://blockly-demo.appspot.com/static/media/',
            rtl : false,
            scrollbars : true,
            sounds : true,
            oneBasedIndex : true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true
            },
            move: {
                scrollbars: true,
                drag: true,
                wheel: true
            }
        });
        this.loadDatabaseResources();
    }

    loadBlocklyCategoryNames() {
        document.getElementById('cat1').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.GENERAL'));
        document.getElementById('cat2').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.EVALUATE'));
        document.getElementById('cat3').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.COMPUTE'));
        document.getElementById('cat4').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.USER-INPUT'));
        document.getElementById('cat5').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.PROPERTIES'));
        document.getElementById('cat6').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.EXTERNAL-CALL'));
        document.getElementById('cat7').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.LOCAL-ENDPOINT-CALL'));
        document.getElementById('cat8').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.CONTEXT-VARIABLES'));
        document.getElementById('cat9').setAttribute('name',
            this.translate.instant('BLOCKLY-CATEGORY.SCHEDULING-SLOTS'));
    }

    public showCode() {
        const code = Blockly.JavaScript.workspaceToCode(this.workspace);
        console.log('Generated XML Code', code);
        window.alert(code);
        return code;
    }

    public showXmlCode() {
        console.log('Blockly XML Code', this.getXmlCode());
        window.alert(this.getXmlCode());
    }

    private getXmlCode() {
        const domWorkspace = Blockly.Xml.workspaceToDom(this.workspace);
        return Blockly.utils.xml.domToText(domWorkspace);
    }

    private loadXmlOnWorkspace(blocklyXML, actionRule = null) {
        if (actionRule) {
            this.dbCausalLinks = actionRule.causal_links || [];
        }

        if (!blocklyXML || blocklyXML.trim() === '' || blocklyXML.indexOf('<block') === -1) {
            this.clearWorkspace();
            let defaultXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="when_is_do" x="20" y="20">';
            if (actionRule) {
                if (actionRule.transaction_type_id) {
                    defaultXml += `<field name="when_is_do_transaction_type">${actionRule.transaction_type_id}</field>`;
                }
                if (actionRule.type) {
                    defaultXml += `<field name="action_rule_type">${actionRule.type.toUpperCase()}</field>`;
                }
                if (actionRule.t_state_id) {
                    defaultXml += `<field name="when_is_do_t_state">${actionRule.t_state_id}</field>`;
                }
                
                if (actionRule.causal_links && actionRule.causal_links.length > 0) {
                    defaultXml += '<statement name="actions">';
                    for (let i = 0; i < actionRule.causal_links.length; i++) {
                        const cl = actionRule.causal_links[i];
                        defaultXml += '<block type="action">';
                        defaultXml += `<mutation comment_text="" no_next_connection="false" has_entity_details_block="false" has_entity_filters_block="false" only_allow_ent_type_form_blocks="false" endpoint_ent_types="" execution_type="null" crud_operation="null" has_update_delete_id_block="false" structural_action_id="${cl.action_id}"></mutation>`;
                        defaultXml += '<field name="action_dropdown">CAUSAL_LINK</field>';
                        defaultXml += `<field name="causal_link_transaction_type">${cl.caused_transaction_type_id}</field>`;
                        defaultXml += `<field name="c_fact">${cl.caused_t_state_id}</field>`;
                        defaultXml += `<field name="min">${cl.min || '1'}</field>`;
                        defaultXml += `<field name="max">${cl.max || '1'}</field>`;
                        const cancelProcessStr = (cl.cancel_proc == 1 || cl.cancel_proc === '1' || cl.cancel_proc === true) ? 'TRUE' : 'FALSE';
                        const continueUserStr = (cl.continue_if_same_user == 1 || cl.continue_if_same_user === '1' || cl.continue_if_same_user === true) ? 'TRUE' : 'FALSE';
                        defaultXml += `<field name="cancel_process">${cancelProcessStr}</field>`;
                        defaultXml += `<field name="continue_same_user">${continueUserStr}</field>`;
                        
                        if (i < actionRule.causal_links.length - 1) {
                            defaultXml += '<next>';
                        }
                    }
                    
                    defaultXml += '</block>';
                    for (let i = 0; i < actionRule.causal_links.length - 1; i++) {
                        defaultXml += '</next></block>';
                    }
                    defaultXml += '</statement>';
                }
            }
            defaultXml += '</block></xml>';
            this.xmlToLoad = defaultXml;
            
            if (Blockly.Blocks['when_is_do']) {
                const dom = Blockly.utils.xml.textToDom(defaultXml);
                Blockly.Xml.domToWorkspace(dom, this.workspace);
                if (this.dbCausalLinks) this.syncCausalLinkBlocks(this.dbCausalLinks);
                this.applyReadOnlyToStructuralBlocks();
            }
            this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.LOAD-XML'));
            return;
        }
        
        this.xmlToLoad = blocklyXML;
        
        try {
            this.loadXmlCode(this.xmlToLoad);
            if (this.dbCausalLinks) this.syncCausalLinkBlocks(this.dbCausalLinks);
            this.applyReadOnlyToStructuralBlocks();
            this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.LOAD-XML'));
        } catch (e) {
            console.log(e);
            this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.LOAD-XML'));
        }
    }

    private syncCausalLinkBlocks(dbCausalLinks: any[]) {
        const allBlocks = this.workspace.getAllBlocks(true);
        const clBlocks = allBlocks.filter(b => b.type === 'action' && b.getFieldValue('action_dropdown') === 'CAUSAL_LINK');
        
        let discrepancy = false;
        let matchedBlocks = 0;
        
        for (const block of clBlocks) {
            let matchedDbRecord = null;
            
            if (block.structural_action_id) {
                matchedDbRecord = dbCausalLinks.find(cl => cl.action_id === block.structural_action_id);
            } else {
                const blockTransType = block.getFieldValue('causal_link_transaction_type');
                const blockFact = block.getFieldValue('c_fact');
                
                const possibleMatches = dbCausalLinks.filter(cl => 
                    cl.caused_transaction_type_id.toString() === blockTransType &&
                    cl.caused_t_state_id.toString() === blockFact
                );
                
                if (possibleMatches.length === 1) {
                    matchedDbRecord = possibleMatches[0];
                    block.structural_action_id = matchedDbRecord.action_id;
                }
            }
            
            if (matchedDbRecord) {
                block.setFieldValue(matchedDbRecord.caused_transaction_type_id.toString(), 'causal_link_transaction_type');
                block.setFieldValue(matchedDbRecord.caused_t_state_id.toString(), 'c_fact');
                block.setFieldValue(matchedDbRecord.min || '1', 'min');
                block.setFieldValue(matchedDbRecord.max || '1', 'max');
                
                const cancelProcessStr = (matchedDbRecord.cancel_proc == 1 || matchedDbRecord.cancel_proc === '1' || matchedDbRecord.cancel_proc === true) ? 'TRUE' : 'FALSE';
                const continueUserStr = (matchedDbRecord.continue_if_same_user == 1 || matchedDbRecord.continue_if_same_user === '1' || matchedDbRecord.continue_if_same_user === true) ? 'TRUE' : 'FALSE';
                
                block.setFieldValue(cancelProcessStr, 'cancel_process');
                block.setFieldValue(continueUserStr, 'continue_same_user');
                matchedBlocks++;
            } else {
                discrepancy = true;
            }
        }
        
        if (matchedBlocks !== dbCausalLinks.length) {
            discrepancy = true;
        }
        
        if (discrepancy) {
            this.alertToast.showWarning('Discrepancy detected between Process Diagram and Blockly. Some Causal Links could not be automatically synchronized.');
        }
    }

    private applyReadOnlyToStructuralBlocks() {
        const allBlocks = this.workspace.getAllBlocks(false);
        for (const block of allBlocks) {
            if (block.type === 'action' && block.getFieldValue('action_dropdown') === 'CAUSAL_LINK') {
                block.setEditable(false);
                block.setMovable(false);
                block.setDeletable(false);
                block.contextMenu = false;
                
                const fieldsToDisable = ['action_dropdown', 'causal_link_transaction_type', 'c_fact', 'cancel_process', 'continue_same_user'];
                for (const fieldName of fieldsToDisable) {
                    const field = block.getField(fieldName);
                    if (field) field.setEnabled(false);
                }
            }
            if (block.type === 'when_is_do' && this.loadedActionRuleId) {
                const fieldsToDisable = ['when_is_do_transaction_type', 'action_rule_type', 'when_is_do_t_state'];
                for (const fieldName of fieldsToDisable) {
                    const field = block.getField(fieldName);
                    if (field) field.setEnabled(false);
                }
            }
        }
    }

    public newActionRule() {
        if (window.confirm(this.translate.instant('BLOCKLY-PAGE.LOSE-PROGRESS-WARNING'))) {
            this.clearWorkspace();
            const defaultXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="when_is_do" x="20" y="20"></block></xml>';
            const dom = Blockly.utils.xml.textToDom(defaultXml);
            Blockly.Xml.domToWorkspace(dom, this.workspace);
        }
    }

    private clearWorkspace() {
        this.workspace.clear();
        this.workspace.hasWarnings = [];
        this.actionRuleDraft = null;
        this.loadedActionRuleId = null;
    }

    public loadXmlCode(xml) {
        const dom = Blockly.utils.xml.textToDom(xml);
        this.clearWorkspace();
        console.log('Loaded XML Code', dom);
        Blockly.Xml.domToWorkspace(dom, this.workspace);
    }

    // Open the template editor modal when it's requested from an 'action->user_output' block
    openTemplateEditorModal(params = {}, block) {
        const modalRef = this.modalService.show(ModalTemplateEditorComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                // console.log('VALUES RECEIVED FROM MODAL: ');
                // console.log(receivedEntry);
                // Get the template info inserted in the Template Editor and update the block's fields
                if (receivedEntry.name) {
                    block.setFieldValue(receivedEntry.name, 'template_name');
                }
                block.setFieldValue(this.translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TEXT-NOT-EDITABLE'),
                    'template_text');
                block.getField('template_text').setEnabled(false);
                block.has_opened_template_editor = true;
                block.template_editor_text_ = receivedEntry.text;

                // Update the option in the type dropdown and validate (update the block's fields) such type
                block.getField('template_type').validator_(receivedEntry.type.toUpperCase());
                block.setFieldValue(receivedEntry.type.toUpperCase(), 'template_type');
                // Depending on what template type comes from the Editor, fill the rest of the corresponding fields
                if (receivedEntry.type === 'modal') {
                    block.setFieldValue(receivedEntry.header, 'template_header');
                    block.setFieldValue(receivedEntry.button, 'template_button');
                } else if (receivedEntry.type === 'toast') {
                    // Update the class dropdown and validate (update the block's fields) if the class is custom
                    block.setFieldValue(receivedEntry.class.toUpperCase(), 'template_class');
                    block.getField('template_class').validator_(receivedEntry.class.toUpperCase());
                    if (receivedEntry.class === 'custom') {
                        block.setFieldValue(receivedEntry.colour, 'template_colour');
                        block.setFieldValue(receivedEntry.title, 'template_title');
                    }
                }
                this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.LOAD-TEMPLATE-IN-BLOCK'));
            }
        });
    }

    // Open the user evaluated expressions editor modal when it's requested from an 'user evaluated expression' block
    openUserEvaluatedExpressionEditorModal(params = {}, block) {
        const modalRef = this.modalService.show(ModalUserEvaluatedExpressionEditorComponent, {class: 'modal-lg', initialState: params});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                // Get the template info inserted in the User Evaluated Expression Editor and update the block's fields
                block.setFieldValue(receivedEntry.expression_name, 'expression_name');
                block.setFieldValue(this.translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.TEXT-NOT-EDITABLE'),
                    'expression_text');
                block.getField('expression_text').setEnabled(false);
                block.has_opened_expression_editor = true;
                block.expression_editor_text = receivedEntry.expression_text;
                this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.LOAD-TEMPLATE-IN-BLOCK'));
            }
        });
    }

    openLoadARModal(actionRuleDrafts) {
        const modalRef = this.modalService.show(ModalBlocklyComponent, {class: 'modal-lg', initialState: {draftModal: actionRuleDrafts}});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                if (receivedEntry.name) {
                    this.loadXmlOnWorkspace(receivedEntry.blockly_xml, receivedEntry);
                    this.actionRuleDraft = {...receivedEntry} as ActionRuleDraft;
                    this.loadedActionRuleId = null;
                } else {
                    this.restBlocklyApi.getActionRule(receivedEntry.id).subscribe((detailedEntry: any) => {
                        const detailedData = detailedEntry.data || detailedEntry;
                        receivedEntry.causal_links = detailedData.causal_links;
                        this.loadXmlOnWorkspace(receivedEntry.blockly_xml, receivedEntry);
                        this.actionRuleDraft = null;
                        this.loadedActionRuleId = receivedEntry.id;
                    });
                }
            }
        });
    }

    openActionRuleDraftModal() {
        const actionRuleDraft = this.actionRuleDraft ? this.actionRuleDraft : {} as ActionRuleDraft;
        actionRuleDraft.blockly_xml = this.getXmlCode();
        // Save the svg for the AR Draft, so we can display an image of the AR Draft in the component
        actionRuleDraft.preview = this.workspaceToSvg_(this.workspace, null);
        const modalRef = this.modalService.show(ModalActionRuleDraftComponent, {class: 'modal-lg', initialState: actionRuleDraft});
        modalRef.content.passEntry.subscribe((receivedEntry) => {
            if (receivedEntry) {
                this.actionRuleDraft = {...receivedEntry};
            }
        });
    }

    public loadTransactionTypes() {
        return this.restTransactionTypeApi.getTransactionTypes().subscribe((data: {}) => {
            this.TransactionTypes = data;
            this.transactionTypesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadTransactionStates() {
        return this.restTStateApi.getTransactionStates().subscribe((data: {}) => {
            this.TransactionStates = data;
            this.transactionStatesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadEntTypes() {
        return this.restEntTypeApi.getEntityTypes().subscribe((data: {}) => {
            this.EntTypes = data;
            this.entTypesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadAllProperties() {
        return this.restPropertyApi.getProperties().subscribe((data: {}) => {
            this.Properties = data;
            this.propertiesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadTemplates() {
        return this.restTemplateApi.getTemplates().subscribe((data) => {
            this.Templates = data;
            this.templatesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadUserEvaluatedExpressions() {
        return this.restUserEvaluatedExpressionApi.getUserEvaluatedExpressions().subscribe((data) => {
            this.UserEvaluatedExpressions = data;
            this.userEvaluatedExpressionsLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadQueries() {
        return this.restBlocklyApi.getQueries().subscribe((data: {}) => {
            this.Queries = data;
            this.queriesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadConstants() {
        return this.restConstantApi.getConstants().subscribe((data) => {
            this.Constants = data;
            this.constantsLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public loadContextVariables() {
        return this.restContextVariableApi.getContextVariables().subscribe((data) => {
            this.ContextVariables = data;
            this.contextVariablesLoaded = true;
            this.loadBlocklyCustomBlocks();
        });
    }

    public storeActionRule(actionRule) {
        return this.restBlocklyApi.storeActionRule(actionRule).subscribe((data: {}) => {
            if (data) {
                // @ts-ignore
                this.xmlToLoad = data.blockly_xml;
                // Load all updated database resources for the blocks and load the AR's xml
                this.loadDatabaseResources();
                this.savingActionRule = false;
                this.alertToast.showSuccess(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.SUCCESS.SAVE-AR'));
            } else {
                this.alertToast.showError(this.translate.instant('BLOCKLY-ACTIONS-NOTIFICATIONS.ERROR.SAVE-AR'));
            }
        });
    }

    private loadBlocklyCustomBlocks() {
        if (this.transactionTypesLoaded && this.transactionStatesLoaded && this.entTypesLoaded && this.propertiesLoaded &&
            this.userEvaluatedExpressionsLoaded && this.constantsLoaded && this.templatesLoaded && this.queriesLoaded &&
            this.contextVariablesLoaded) {
            // Only load Blockly's customBlocks when we're sure to have all data needed
            customBlocks(this);
            this.transactionTypesLoaded = this.transactionStatesLoaded = this.entTypesLoaded = this.propertiesLoaded =
                this.userEvaluatedExpressionsLoaded = this.constantsLoaded = this.templatesLoaded = this.queriesLoaded =
                    this.contextVariablesLoaded = false;
            // When we're saving and reloading the AR, load the XML after loading all the updated data for the blocks
            if (this.xmlToLoad) {
                this.loadXmlOnWorkspace(this.xmlToLoad);
            } else {
                const defaultXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="when_is_do" x="20" y="20"></block></xml>';
                const dom = Blockly.utils.xml.textToDom(defaultXml);
                Blockly.Xml.domToWorkspace(dom, this.workspace);
            }
        }
    }

    public loadDatabaseResources() {
        this.loadTransactionTypes();
        this.loadTransactionStates();
        this.loadEntTypes();
        this.loadTemplates();
        this.loadUserEvaluatedExpressions();
        this.loadQueries();
        this.loadConstants();
        this.loadContextVariables();
        this.loadAllProperties();
    }

    private workspaceToSvg_(workspace, customCss) {

        // Go through all text areas and set their value.
        const textAreas = document.getElementsByTagName('textarea');
        // @ts-ignore
        for (const textArea of textAreas) {
            textArea.innerHTML = textArea.value;
        }
        const bBox = workspace.getBlocksBoundingBox();
        const x = bBox.x || bBox.left;
        const y = bBox.y || bBox.top;
        const width = bBox.width || bBox.right - x;
        const height = bBox.height || bBox.bottom - y;

        const blockCanvas = workspace.getCanvas();
        const clone = blockCanvas.cloneNode(true);
        clone.removeAttribute('transform');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.appendChild(clone);
        svg.setAttribute('viewBox',
            x + ' ' + y + ' ' + width + ' ' + height);

        svg.setAttribute('class', 'blocklySvg ' +
            (workspace.options.renderer || 'geras') + '-renderer ' +
            (workspace.getTheme ? workspace.getTheme().name + '-theme' : ''));
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('style', 'background-color: transparent');

        const css = [].slice.call(document.head.querySelectorAll('style'))
            .filter((el) => { return /\.blocklySvg/.test(el.innerText) ||
                (el.id.indexOf('blockly-') === 0); }).map((el) => {
                return el.innerText; }).join('\n');
        const style = document.createElement('style');
        style.innerHTML = css + '\n' + customCss;
        svg.insertBefore(style, svg.firstChild);

        // tslint:disable-next-line:new-parens
        let svgAsXML = (new XMLSerializer).serializeToString(svg);
        svgAsXML = svgAsXML.replace(/&nbsp/g, '&#160');
        return 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
    }

    public parseXMLAndStoreActionRule() {

        const allInputsFilled = this.workspace.allInputsFilled();

        if (!allInputsFilled) {
            this.alertToast.showWarning('Must fill all inputs before saving an Action Rule!');
            return;
        }

        if (this.workspace.hasWarnings.length) {
            this.alertToast.showWarning('Must resolve all warnings before saving an Action Rule!');
            return;
        }

        this.savingActionRule = true;

        let parsedResult;

        const blocklyCode = Blockly.JavaScript.workspaceToCode(this.workspace);
        const blocklyXML = this.getXmlCode();

        const XML = '<xml>' + blocklyCode + '</xml>';

        // Does the XML Parsing and stores the result in parsedResult
        // tslint:disable-next-line:only-arrow-functions
        xml2js.parseString(XML, {trim: true}, function(err, result) {
            if ( err ) { console.log(err); }
            parsedResult = result.xml;
        });

        const actionRules = parsedResult.action_rule;
        console.log('Action Rules', actionRules);

        if (!actionRules) {
            this.savingActionRule = false;
            this.alertToast.showError('Action Rules block structure is missing. Ensure the when_is_do block is present.');
            return;
        }

        for (const actionRuleXML of actionRules) {
            const actionRule = {} as ActionRule;
            
            if (this.loadedActionRuleId) {
                actionRule.id = this.loadedActionRuleId;
            }

            actionRule.transaction_type_id = actionRuleXML.transaction_type[0];
            actionRule.type = actionRuleXML.type[0].toLowerCase();
            actionRule.t_state_id = actionRuleXML.t_state[0];
            actionRule.blockly_code = JSON.stringify(blocklyCode);
            actionRule.blockly_xml = blocklyXML;

            // Gets the actions in the action rule
            const actions = actionRuleXML.actions[0].action;

            // If there are any actions directly assigned to the 'when_is' block, store them in the AR object
            if (actions) {
                actionRule.actions = [];
                this.dealActions(actionRule.actions, null, actions);
            }

            // TODO If we're gonna save multiple AR's in a single workspace, figure out how to save only the image for that AR
            // Save the svg for the AR so we can display an image of the AR in the component
            actionRule.preview = this.workspaceToSvg_(this.workspace, null);

            console.log('Action Rule:', actionRule);

            // Store the AR in the DB
            this.storeActionRule(actionRule);
        }
    }

    public dealActions(parentComponent, ifType, actions) {
        for (const actionBlockly of actions) {
            console.log('Action:', actionBlockly);
            const actionAdd = {} as Action;
            const actionType = actionBlockly.type[0].toLowerCase();
            // Action type of the current action(ex: assign_expression)
            if (actionType === 'user_input_mult_ent_types' || actionType === 'user_input_single_ent_type') {
                actionAdd.type = 'user_input';
            } else {
                actionAdd.type = actionType;
            }

            if (actionAdd.type !== 'if' && actionAdd.type !== 'while' && actionAdd.type !== 'for_each_set') {
                actionAdd.comment = actionBlockly.comment[0];
            }
            if (actionBlockly.action_name) {
                actionAdd.name = actionBlockly.action_name[0];
            }

            if (actionAdd.type === 'causal_link') {

                // console.log('TRANS TYPE VALUE: ' + actionBlockly.transaction_type[0].value[0]);
                // console.log('TRANS STATE VALUE: ' +  actionBlockly.transaction_state[0].value[0]);
                // console.log('MIN VALUE: ' +  actionBlockly.min[0]);
                // console.log('MAX VALUE: ' +  actionBlockly.max[0]);
                // Get the caused action, min and max for this causal link action
                actionAdd.caused_action_trans_type_id = actionBlockly.transaction_type[0];
                actionAdd.caused_action_t_state_id = actionBlockly.transaction_state[0];
                actionAdd.min = actionBlockly.min[0];
                actionAdd.max = actionBlockly.max[0];
                actionAdd.cancel_process = actionBlockly.cancel_process[0].toLowerCase() === 'true' ? 1 : 0;
                actionAdd.continue_if_same_user = actionBlockly.continue_same_user[0].toLowerCase() === 'true' ? 1 : 0;

            } else if (actionAdd.type === 'assign_expression') {

                // Get the property/context variable inserted in the first input (left side) of the assign expression action
                this.figureTermType('assign_expression', actionBlockly.first_term[0], actionAdd, null, 'left');
                // Get the input inserted in the second input of the block
                this.figureTermType('assign_expression', actionBlockly.second_term[0], actionAdd, null, 'right');

            }  else if (actionAdd.type === 'user_output') {

                // console.log('USER_OUTPUT:');
                // console.log(actionBlockly);
                const template = {} as Template;
                if (actionBlockly.new_template) {
                    const templateBlockly = actionBlockly.new_template[0];
                    template.name = templateBlockly.name[0];
                    template.type = templateBlockly.type[0].toLowerCase();
                    // console.log('NEW TEMPLATE');
                    // Check whether the text is a js object (contains HTML) or simple text and act accordingly
                    template.openedEditor = templateBlockly.openedEditor[0];
                    template.text = templateBlockly.text[0];
                    // If template is of type modal, save the header and button text info
                    if (template.type === 'modal') {
                        template.header = templateBlockly.header[0];
                        template.button = templateBlockly.button[0];
                    } else if (template.type === 'toast') {
                        // If template is of type toast, save the class info
                        template.class = templateBlockly.class[0].toLowerCase();
                        // If class is custom toast, save the custom colour and toast title info
                        if (template.class === 'custom') {
                            template.colour = templateBlockly.colour[0];
                            template.title = templateBlockly.title[0];
                        }
                    }
                } else {
                    // console.log('EXISTING TEMPLATE');
                    // Get the existing template id
                    template.id = actionBlockly.existing_template[0];
                }
                actionAdd.template = template;

            } else if (actionAdd.type === 'user_input' || actionAdd.type === 'edit_entity_instance') {

                if (actionAdd.type === 'edit_entity_instance') {

                    // Check first if there are entity details OR entity filters selected (only one of them can be present)
                    if (actionBlockly.entity_details) {
                        this.addEntityDetailsToParentComponent(actionBlockly.entity_details[0], actionAdd);
                    } else if (actionBlockly.entity_filters) {
                        // Add only if there are any entity filters selected (whether that be by query or property)
                        this.figureTermType('entity_filters', actionBlockly.entity_filters[0], actionAdd, null, null);
                    }
                }

                actionAdd.properties = null;
                actionAdd.derivedProperties = null;
                // console.log('USER_INPUT:');
                // console.log(actionBlockly);
                // Get the properties inside the user input block
                const hasProperties = actionBlockly.properties;
                const hasDerivedProperties = actionBlockly.derived_facts;

                if (hasProperties) {
                    actionAdd.properties = [];
                    const properties = hasProperties[0].property_userInput;
                    for (const property of properties) {
                        const propertyDetails = this.parseUserInputProperty(property);
                        // Add the property (with all its info) to the user_input action
                        actionAdd.properties.push(propertyDetails);
                    }
                }

                if (hasDerivedProperties) {
                    actionAdd.derivedProperties = [];
                    const derivedProperties = hasDerivedProperties[0].derivedFact_userInput;
                    for (const derivedProperty of derivedProperties) {
                        const derivedPropertyUserInput = {} as ActionDerivedProp;
                        // Get the property info(id, scope) and check if it has a form_calculation/enable condition/validation conditions
                        derivedPropertyUserInput.property_id = derivedProperty.property[0].property_simplified_output[0];
                        const derivedPropertyTerm = derivedProperty.term[0];
                        this.figureTermType('derived_fact', derivedPropertyTerm, derivedPropertyUserInput, null, null);
                        // Add the derivedProperty (with all its info) to the user_input action
                        actionAdd.derivedProperties.push(derivedPropertyUserInput);
                    }
                }

            } else if (actionAdd.type === 'if') {

                // elseAction starts as null as it is optional
                let elseAction = null;
                // Get the ifCondition and thenAction from block statementInputs
                const ifCondition = actionBlockly.ifCondition[0].condition[0];
                const thenAction = actionBlockly.thenAction[0].action;
                // Check is elseAction statementInput is present on block
                const hasElseAction = actionBlockly.elseAction;
                // If elseAction statementInput is present on block, get the corresponding action inserted
                if (hasElseAction) {
                    elseAction = hasElseAction[0].action;
                }
                // Initialize a condition object to store the condition present in the if statementInput
                const ifConditionObject = {} as Condition;
                // Get the condition type to be stored
                ifConditionObject.type = ifCondition.type[0].toLowerCase();
                // Get the condition terms to be analysed and then added to the object
                const ifConditionTerms = ifCondition.terms[0];
                this.figureConditionTermTypes(ifConditionTerms, ifConditionObject);
                // Store the condition object correctly filled to the current Action object
                actionAdd.ifCondition = ifConditionObject;
                // Store the action present in the 'then' statementInput in the current Action
                actionAdd.thenAction = [];
                this.dealActions(actionAdd.thenAction, 'ifThen', thenAction);
                // As the else part of block is optional, we only add the action if they are present
                if (elseAction) {
                    actionAdd.elseAction = [];
                    this.dealActions(actionAdd.elseAction, 'ifElse', elseAction);
                }

            } else if (actionAdd.type === 'while') {

                // Get the inputs in the 'while' and 'do' statementInputs
                const whileCondition = actionBlockly.whileCondition[0].condition[0];
                const doAction = actionBlockly.doAction[0].action;
                // Initialize a condition object to store the condition in the 'while' statementInput
                const whileConditionObject = {} as Condition;
                // Store the condition type on the object
                whileConditionObject.type = whileCondition.type[0];
                // Get the condition terms and store them accordingly to the condition object
                const whileConditionTerms = whileCondition.terms[0];
                this.figureConditionTermTypes(whileConditionTerms, whileConditionObject);
                // Add the statementInput corresponding condition to the Action Object
                actionAdd.whileCondition = whileConditionObject;
                // Store the action present in the 'do' statementInput in the current Action
                actionAdd.doAction = [];
                this.dealActions(actionAdd.doAction, 'whileDo', doAction);

            } else if (actionAdd.type === 'create_schedule_slots') {

                const scheduleSlotOriginObject = {} as ScheduleSlotOrigin;
                const scheduleSlot = actionBlockly.schedule_slot_origin[0].schedule_block[0];
                scheduleSlotOriginObject.entity_type_id = scheduleSlot.entity_type[0];
                scheduleSlotOriginObject.scheduling_user =  scheduleSlot.scheduling_user[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_start_date = scheduleSlot.scheduling_start_date[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_start_time = scheduleSlot.scheduling_start_time[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_end_date = scheduleSlot.scheduling_end_date[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_end_time = scheduleSlot.scheduling_end_time[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_weekdays = scheduleSlot.scheduling_weekdays[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_duration = scheduleSlot.scheduling_duration[0].
                    property_simplified_output[0];
                scheduleSlotOriginObject.scheduling_slots_count = scheduleSlot.scheduling_slots_count[0].
                    property_simplified_output[0];

                const scheduleSlotResultObject = {} as ScheduleSlotResult;
                const scheduleSlotResult = actionBlockly.schedule_slot_result[0].scheduling_slot[0];
                scheduleSlotResultObject.entity_type_id = scheduleSlotResult.entity_type[0];
                scheduleSlotResultObject.scheduled_slot_agenda =  scheduleSlotResult.scheduled_slot_agenda[0].
                    property_simplified_output[0];
                scheduleSlotResultObject.scheduled_slot_number = scheduleSlotResult.scheduled_slot_number[0].
                    property_simplified_output[0];
                scheduleSlotResultObject.scheduled_slot_day = scheduleSlotResult.scheduled_slot_day[0].
                    property_simplified_output[0];
                scheduleSlotResultObject.scheduled_slot_start_time = scheduleSlotResult.scheduled_slot_start_time[0].
                    property_simplified_output[0];
                scheduleSlotResultObject.scheduled_slot_end_time = scheduleSlotResult.scheduled_slot_end_time[0].
                    property_simplified_output[0];

                if (scheduleSlotResult.additional_slot_properties) {
                    scheduleSlotResultObject.scheduled_slot_additional_properties = [];
                    const additionalSlotProperties = scheduleSlotResult.additional_slot_properties[0].scheduling_additional_property;
                    for (const additionalSlotProperty of additionalSlotProperties) {
                        const additionalSlotPropertyObject = {} as ScheduleSlotResultAdditionalProperty;
                        additionalSlotPropertyObject.property_id = additionalSlotProperty.property[0].property_simplified_output[0];
                        this.figureTermType('schedule_slot_additional_property', additionalSlotProperty.term[0],
                            additionalSlotPropertyObject, null, null);
                        scheduleSlotResultObject.scheduled_slot_additional_properties.push(additionalSlotPropertyObject);
                    }
                }

                actionAdd.scheduleSlotOrigin = scheduleSlotOriginObject;
                actionAdd.scheduleSlotResult = scheduleSlotResultObject;
            }

            // console.log(actionAdd);
            // Add the action to the action array in the parentComponent object
            parentComponent.push(actionAdd);
        }
    }

    private addEntityDetailsToParentComponent(entityDetails, parentComponentToAdd) {
        // Check first if there are any entity details selected
        if (entityDetails.property) {
            parentComponentToAdd.entity_details = [];
            const entityDetailsProperties = entityDetails.property;
            for (const entityDetailsProperty of entityDetailsProperties) {
                const entityDetail = {} as Property;
                entityDetail.id = entityDetailsProperty;
                // Add the property id to the action's entityDetails
                parentComponentToAdd.entity_details.push(entityDetail);
            }
        }
    }

    // Get the form compute/compute expression operator as a string and return the corresponding correct symbol to be used
    public transformOperatorToSymbol(operator) {
        switch (operator) {
            case 'MULTIPLY':
                return '*';
            case 'ADD':
                return '+';
            case 'MINUS':
                return '-';
            case 'DIVIDE':
                return '/';
            case 'POWER':
                return '^';
            case 'AVERAGE':
                return 'average';
            default:
                console.log('Error transforming the form compute operator!');
                break;
        }
    }

    // Transforms the ALL CAPS type received from XML to accepted validation condition type in the DB
    public transformValidationConditionType(type) {
        // 'equalTo','maxWordLength','lessEqual',
        // 'higherEqual','higherThan','lessThan','minLength','belongsRange','maxLength','minWordLength','hasCharacter',
        // 'regExpression','hasWord','isEmail','isURL','customValidation'
        switch (type) {
            case 'EQUAL_TO':
                return 'equalTo';
            case 'MAX_WORD_LENGTH':
                return 'maxWordLength';
            case 'LESS_EQUAL':
                return 'lessEqual';
            case 'HIGHER_EQUAL':
                return 'higherEqual';
            case 'HIGHER_THAN':
                return 'higherThan';
            case 'LESS_THAN':
                return 'lessThan';
            case 'MIN_LENGTH':
                return 'minLength';
            case 'BELONGS_RANGE':
                return 'belongsRange';
            case 'MAX_LENGTH':
                return 'maxLength';
            case 'MIN_WORD_LENGTH':
                return 'minWordLength';
            case 'HAS_CHARACTER':
                return 'hasCharacter';
            case 'REG_EXPRESSION':
                return 'regExpression';
            case 'HAS_WORD':
                return 'hasWord';
            case 'IS_EMAIL':
                return 'isEmail';
            case 'IS_URL':
                return 'isURL';
            case 'CUSTOM_VALIDATION':
                return 'customValidation';
            case 'AFTER_DATE':
                return 'afterDate';
            case 'BEFORE_DATE':
                return 'beforeDate';
            case 'MIN_CHOICE':
                return 'minChoice';
            case 'MAX_CHOICE':
                return 'maxChoice';
            default:
                console.log('Invalid validation condition type!');
                break;
        }
    }

    // Get the terms presented in a condition block, check what tpe they are and act accordingly
    public figureConditionTermTypes(conditionTerms, parentComponentToAdd) {
        // Check if condition has comp_evaluated_expression terms and add them to parentComponent object
        const hasCompEvaluatedExpressions = conditionTerms.comp_evaluated_expression;
        if (hasCompEvaluatedExpressions) {
            // The array needs to be initialized so we can push objects onto it later
            parentComponentToAdd.comp_evaluated_expressions = [];
            for (const compEvaluatedExpression of hasCompEvaluatedExpressions) {
                const compEvaluatedExpressionObject = {} as CompEvaluatedExpression;
                // console.log('CONDITION_TERM:');
                // console.log(compEvaluatedExpression);
                this.dealConditionTerm('comp_evaluated_expression', compEvaluatedExpression, compEvaluatedExpressionObject);
                parentComponentToAdd.comp_evaluated_expressions.push(compEvaluatedExpressionObject);
            }
        }
        // Check if condition has user_evaluated_expression terms and add them to parentComponent object
        const hasUserEvaluatedExpressions = conditionTerms.user_evaluated_expression;
        if (hasUserEvaluatedExpressions) {
            // The array needs to be initialized so we can push objects onto it later
            parentComponentToAdd.user_evaluated_expressions = [];
            for (const userEvaluatedExpression of hasUserEvaluatedExpressions) {
                const userEvaluatedExpressionObject = {} as UserEvaluatedExpression;
                this.dealConditionTerm('user_evaluated_expression', userEvaluatedExpression, userEvaluatedExpressionObject);
                parentComponentToAdd.user_evaluated_expressions.push(userEvaluatedExpressionObject);
            }
        }
        // Check if condition has nested condition terms and add them to parentComponent object
        const hasConditions = conditionTerms.condition;
        if (hasConditions) {
            // The array needs to be initialized so we can push objects onto it later
            parentComponentToAdd.conditions = [];
            for (const condition of hasConditions) {
                const conditionObject = {} as Condition;
                this.dealConditionTerm('condition', condition, conditionObject);
                parentComponentToAdd.conditions.push(conditionObject);
            }
        }
    }

    // Depending on what type condition term is, act accordingly - used when condition blocks are used
    public dealConditionTerm(type, term, parentComponentToAdd) {
        if (type === 'comp_evaluated_expression') {
            const leftTerm = term.left_term[0];
            const rightTerm = term.right_term[0];
            parentComponentToAdd.logical_operator = term.operator[0];
            this.figureTermType('comp_evaluated_expression', leftTerm, parentComponentToAdd, null, 'left');
            this.figureTermType('comp_evaluated_expression', rightTerm, parentComponentToAdd, null, 'right');
        } else if (type === 'user_evaluated_expression') {
            // If user_evaluated_expression is an existing expression
            if (term.existing_expression) {
                // console.log(term.existing_expression);
                parentComponentToAdd.type = 'existingExpression';
                parentComponentToAdd.id = term.existing_expression[0];
            } else {
                // If user_evaluated_expression is a new expression
                // console.log(term.new_expression);
                parentComponentToAdd.type = 'newExpression';
                parentComponentToAdd.openedEditor = term.new_expression[0].openedEditor[0];
                parentComponentToAdd.expression_name = term.new_expression[0].name[0];
                parentComponentToAdd.expression_text = term.new_expression[0].text[0];
            }
        } else if (type === 'condition') {
            // console.log('CONDITION:');
            // console.log(term);
            parentComponentToAdd.type = term.type[0]; // Get condition type (AND or OR or ISTRUE or NOT)
            this.figureConditionTermTypes(term.terms[0], parentComponentToAdd);
        }
    }

    private parseUserInputProperty(property) {
        // console.log('PROPERTY:');
        // console.log(property);
        const propertyUserInput = {} as Property;
        // Get the property info(id, scope) and check if it has a form_calculation/enable condition/validation conditions
        const hasFormCalculation = property.form_calculation;
        const hasEnableCondition = property.enable_condition;
        const hasValidationConditions = property.validation_condition;
        const hasOptionsFromQuery = property.options_from_query;
        const hasPropRefFilters = property.property_filter;
        propertyUserInput.id = property.property_id[0];
        propertyUserInput.mandatory = property.mandatory[0].toLowerCase() === 'true' ? 1 : 0;

        if (hasFormCalculation) {
            // Initialize a form compute object to add the json Logic, and get the form compute from the block
            const formCalculationObject = {} as FormCalculation;
            const formCalculation = hasFormCalculation[0];
            // Ge the form_calculation's operator in the form off a symbol.
            const operator = formCalculation.operator[0];
            formCalculationObject.operator = this.transformOperatorToSymbol(operator);
            // Parse all the form_compute's terms.
            const formComputeTerms = formCalculation.term;
            for (const [key, formComputeTerm] of Object.entries(formComputeTerms)) {
                this.figureTermType('form_compute', formComputeTerm, formCalculationObject, Number(key) + 1, null);
            }
            // Assign the form compute object filled correctly to the form compute field of the property object
            propertyUserInput.form_calculation = formCalculationObject;
        }

        if (hasEnableCondition) {
            // Initialize a condition object to add the components, and get the enable condition from the block
            const enableConditionUserInput = {} as Condition;
            const enableCondition = hasEnableCondition[0].condition[0];
            // console.log('Enable Condition:');
            // console.log(enableCondition);
            // Get condition type (AND or OR or ISTRUE or NOT) and terms
            enableConditionUserInput.type = enableCondition.type[0].toLowerCase();
            const enableConditionTerms = enableCondition.terms[0];
            // console.log(enableConditionType);
            // console.log(enableConditionTerms);
            // Check what terms the condition has and add them to the enable condition object
            this.figureConditionTermTypes(enableConditionTerms, enableConditionUserInput);
            // Assign the enable condition object filled correctly to the enable condition field of the property object
            propertyUserInput.enable_condition = enableConditionUserInput;
        }

        if (hasValidationConditions) {
            propertyUserInput.validation_conditions = [];
            const validationConditions = hasValidationConditions[0].condition_validation_condition;
            for (const validationCondition of validationConditions) {
                const validationConditionObject = {} as ValidationCondition;
                // Get the validation condition type - 'HAS_WORD', 'IS_NUMBER'...
                const validationConditionType = validationCondition.dropdown_type[0];
                // Transforms the ALL CAPS type received from XML to accepted validation condition type in the DB
                validationConditionObject.type = this.transformValidationConditionType(validationConditionType);
                // See if negation is true or false and transform it into binary - as it is stored in the DB
                validationConditionObject.negative = validationCondition.negation[0].toLowerCase() === 'true' ? 1 : 0;
                validationConditionObject.valueType = validationCondition.valueType[0];
                validationConditionObject.multipleValues = validationCondition.multipleValues[0];
                // Get the extra fields values if they are present (custom validation text, param1 and param2)
                if (validationConditionObject.type === 'customValidation') {
                    validationConditionObject.custom_validation = validationCondition.term1[0];
                } else if (validationCondition.term1[0] !== 'null') {
                    validationConditionObject.param_1 = validationCondition.term1[0];
                    if (validationCondition.term2[0] !== 'null') {
                        validationConditionObject.param_2 = validationCondition.term2[0];
                        // For the cases where 'term_2' refers to the 'match case' checkbox - hasWord & hasCharacter
                        if (validationConditionObject.param_2 === 'TRUE') {
                            validationConditionObject.param_2 = 1;
                        } else if (validationConditionObject.param_2 === 'FALSE') {
                            validationConditionObject.param_2 = 0;
                        }
                    }
                }
                // Only save template info if the validation condition has a template associated to it
                if (validationCondition.existing_template || validationCondition.new_template) {
                    // Get the template info associated to user_output in this validation condition
                    const templateObject = {} as Template;
                    const hasExistingTemplate = validationCondition.existing_template;
                    if (hasExistingTemplate) {
                        templateObject.id = hasExistingTemplate[0];
                    } else {
                        templateObject.text = validationCondition.new_template[0].text[0];
                    }
                    validationConditionObject.template = templateObject;
                }
                // console.log('VALIDATION CONDITION:');
                // console.log(validationConditionObject);
                // Assign the validation condition object filled correctly to the validation condition
                // array of the property object
                propertyUserInput.validation_conditions.push(validationConditionObject);
            }
        }

        if (hasOptionsFromQuery) {
            this.figureTermType('options_from_query', hasOptionsFromQuery[0], propertyUserInput, null, null);
        }

        if (hasPropRefFilters) {
            propertyUserInput.propertyFilters = [];
            const propRefFilters = hasPropRefFilters[0].filter;
            for (const propRefFilter of propRefFilters) {
                const propertyFilterObject = {} as PropRefFormFilter;
                propertyFilterObject.referenced_property_id = propRefFilter.property[0];
                propertyFilterObject.operator = propRefFilter.operator[0];
                this.figureTermType('prop_ref_filters', propRefFilter.term[0], propertyFilterObject, null, null);
                propertyUserInput.propertyFilters.push(propertyFilterObject);
            }
        }

        return propertyUserInput;
    }

    private parseUserInputEntityType(entitySpecificationTerm) {
        // console.log('PROPERTY:');
        // console.log(property);
        const entityTypeUserInput = {} as EntityType;
        // Get the property info(id, scope) and check if it has a form_calculation/enable condition/validation conditions
        const hasOptionsFromQuery = entitySpecificationTerm.options_from_query;
        const hasEntityDetails = entitySpecificationTerm.entity_details;
        entityTypeUserInput.id = entitySpecificationTerm.entity_type_id[0];
        entityTypeUserInput.mandatory = entitySpecificationTerm.mandatory[0].toLowerCase() === 'true' ? 1 : 0;

        if (hasEntityDetails) {
            this.addEntityDetailsToParentComponent(hasEntityDetails[0], entityTypeUserInput);
        }
        if (hasOptionsFromQuery) {
            this.figureTermType('options_from_query', hasOptionsFromQuery[0], entityTypeUserInput, null, null);
        }

        return entityTypeUserInput;
    }

    // See what type term is and act accordingly - used by assign expression, compute_expression & comp_evaluated_expression
    public figureTermType(parentType, term, parentComponentToAdd, order, leftOrRightTerm) {
        const newTerm = {} as Term;
        // Check what block is attached to second_term and act accordingly
        if (term.constant) {

            const constant = {} as ConstantDB;
            // console.log(rightTerm.constant);
            const constantBlock = term.constant[0];
            // Check if user wants to create constant or use existing one
            if (constantBlock.new_constant) {
                // If user wants to create constant, we get the name, value type and value of the new constant
                // console.log('Wants new constant');
                const newConstant = constantBlock.new_constant[0];
                constant.type = 'newConstant';
                constant.name = newConstant.name[0];
                constant.value_type = newConstant.value_type[0].toLowerCase();
                constant.value = newConstant.value[0];
                constant.numeric_constants_only = constantBlock.numeric_constants_only[0];
                constant.numeric_time_constants_only = constantBlock.numeric_time_constants_only[0];
                constant.numeric_date_time_constants_only = constantBlock.numeric_date_time_constants_only[0];
                // console.log('New constant: ');
                // console.log(constant);
            } else {
                // If user wants to use existing constant, we only need the constant id
                // console.log('Wants existing constant');
                constant.type = 'existingConstant';
                constant.constant_id = constantBlock.existing_constant[0];
                constant.numeric_constants_only = constantBlock.numeric_constants_only[0];
                // console.log('Existing Constant: ');
                // console.log(constant);
            }

            newTerm.type = 'constant';
            newTerm.details = constant;

        } else if (term.value) {

            // Get the inserted value type and value by user
            const newValue = {} as ValueTerm;
            term.type = 'value';
            // console.log(rightTerm.value);
            const valueBlock = term.value[0];
            newValue.value_type = valueBlock.value_type[0].toLowerCase();
            newValue.value = valueBlock.value[0];
            // console.log('New value:');
            // console.log(newValue);

            newTerm.type = 'value';
            newTerm.details = newValue;

        } else if (term.property) {

            // Get the id of the chosen property
            const property = {} as Property;
            term.type = 'property';
            // console.log(rightTerm.property);
            const propertyBlock = term.property[0];
            property.id = propertyBlock.value[0];

            if (propertyBlock.specific_entity_term) {
                this.figureTermType('property_specific_entity', propertyBlock.specific_entity_term[0], property, null, null);
            }

            newTerm.type = 'property';
            newTerm.details = property;

        } else if (term.property_value) {

            // Get the id of the chosen property value
            const propertyValue = {} as PropertyValue;
            // console.log(term.property_value);
            const propertyValueBlock = term.property_value[0];
            propertyValue.id = propertyValueBlock.value[0];
            propertyValue.property_id = propertyValueBlock.propertyID[0];
            // console.log('Chosen Property Value:');
            // console.log(propertyValue);

            newTerm.type = 'property_value';
            newTerm.details = propertyValue;

        } else if (term.compute_expression || term.form_calculation) {

            let orderComputeExpression = 1;
            // console.log('é compute expression');
            const computeExpression = {} as ComputeExpression;
            // console.log(term.compute_expression);
            const computeExpressionBlock = term.compute_expression ? term.compute_expression[0] : term.form_calculation[0];
            for (const computeExpressionTerm of computeExpressionBlock.term) {
                this.figureTermType('compute_expression', computeExpressionTerm, computeExpression, orderComputeExpression, null);
                orderComputeExpression++;
            }
            if (computeExpressionBlock.time_result_in) {
                computeExpression.result_in = computeExpressionBlock.time_result_in[0].toLowerCase();
            }
            computeExpression.operator = this.transformOperatorToSymbol(computeExpressionBlock.operator[0]);
            // console.log('Compute Expression:');
            // console.log(computeExpression);

            newTerm.type = 'compute_expression';
            newTerm.details = computeExpression;

        } else if (term.query) {

            // console.log('é query');
            const query = {} as Query;
            query.query_id = term.query[0].value[0];
            // Get the query parameters specified
            const queryParameters = term.query[0].query_parameter;
            if (queryParameters) {
                query.blockly_parameters = [];
                for (const queryParam of queryParameters) {
                    const queryParameterObject = {} as QueryParameter;
                    queryParameterObject.query_filter_id = queryParam.query_filter_id[0];
                    this.figureTermType('query', queryParam.term[0], queryParameterObject, null, null);
                    query.blockly_parameters.push(queryParameterObject);
                }
            }
            // console.log('Query:', query);

            newTerm.type = 'query';
            newTerm.details = query;

        } else if (term.context_variable) {

            const contextVariable = {} as ContextVariable;
            const contextVariableBlock = term.context_variable[0];
            contextVariable.type = contextVariableBlock.type[0];
            // Check if user wants to create a context variable or use an existing one
            if (contextVariableBlock.type[0] === 'set') {
                // If user wants to create a new context variable, we get its name and blockId
                if (contextVariableBlock.new_context_variable) {
                    contextVariable.text = contextVariableBlock.new_context_variable[0].name[0];
                    contextVariable.blockId = contextVariableBlock.new_context_variable[0].block_id[0];
                } else {
                    // If user wants to use an existing context variable, we only need the context variable id
                    contextVariable.id = contextVariableBlock.existing_context_variable[0];
                }
            } else {
                // If user wants to use an existing context variable, we only need the context variable id
                contextVariable.id = contextVariableBlock.value[0];
            }

            newTerm.type = 'context_variable';
            newTerm.details = contextVariable;

        } else if (term.property_specification_term) {

            newTerm.type = 'property_specification';
            newTerm.details = this.parseUserInputProperty(term.property_specification_term[0]);

        }  else if (term.entity_specification_term) {

            newTerm.type = 'entity_specification';
            newTerm.details = this.parseUserInputEntityType(term.entity_specification_term[0]);

        } else if (term.current_user) {

            newTerm.type = 'executing_user';

        } else if (term.current_user_role) {

            newTerm.type = 'executing_user_role';

        } else if (term.user_role) {

            newTerm.type = 'user_role';
            newTerm.userRoleId = term.user_role[0];

        }

        if (parentType === 'assign_expression') {

            if (leftOrRightTerm === 'left') {
                parentComponentToAdd.destinationTerm = newTerm;
            } else {
                parentComponentToAdd.sourceTerm = newTerm;
            }

        } else if (parentType === 'comp_evaluated_expression') {

            // In case parentComponent is a comp_evaluated_expression
            if (leftOrRightTerm === 'left') {
                parentComponentToAdd.term1 = newTerm;
            } else {
                parentComponentToAdd.term2 = newTerm;
            }

        } else if (parentType === 'compute_expression' || parentType === 'form_compute') {

            newTerm.order = order;
            // Initialize the array to be used if it hasn't been used yet
            if (!parentComponentToAdd.terms) {
                parentComponentToAdd.terms = [];
            }
            parentComponentToAdd.terms.push(newTerm);

        } else if (parentType === 'options_from_query') {

            parentComponentToAdd.optionsFromQueryTerm = newTerm;

        } else if (parentType === 'entity_filters') {

            parentComponentToAdd.entityFilterTerm = newTerm;

        } else if (parentType === 'property_specific_entity') {

            parentComponentToAdd.specificEntityTerm = newTerm;

        } else {

            parentComponentToAdd.term = newTerm;

        }
    }
}
