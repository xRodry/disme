import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TransactionTypeApiService} from "../shared/rest-api/transaction-type-api.service";
import {WaitingLinkApiService} from "../shared/rest-api/waiting-link-api.service";
import {TransactionStateApiService} from "../shared/rest-api/transaction-state-api.service";
import {ActionApiService} from "../shared/rest-api/action-api.service";
import Viz from "viz.js";
import {Module, render} from "viz.js/full.render.js";
import {ActionRuleApiService} from "../shared/rest-api/action-rule-api.service";
import {CausalLinkApiService} from "../shared/rest-api/causal-link-api.service";
import {XmlDataService} from "../shared/rest-api/xml-data.service";
import {ModalSaveProcessDiagramComponent} from "../modal-save-process-diagram/modal-save-process-diagram.component";
import {BsModalService} from "ngx-bootstrap/modal";
import {TranslateService} from "@ngx-translate/core";
import {AlertToastService} from "../shared/common/alert-toast.service";
import {ProcessDiagramApiService} from "../shared/rest-api/process-diagram-api.service";

type LinkInfo = {
        type: 'waiting';
        id: number;
        waited_t: number;
        waited_act: string;
        waiting_act: string;
        waiting_t: number;
        min: string;
        max: string;
        created_at: string | null;
    }
    |
    {
        type: 'causal';
        // actionRule
        actionRule_id: number;
        actionRule_type: string;
        actionRule_t_state_id: number;
        actionRule_transaction_type_id: number;
        actionRule_blockly_xml: string | null;
        actionRule_blockly_code: string | null;
        actionRule_preview: string;
        actionRule_created_at: string | null;
        // action
        action_id: number;
        action_action_rule_id: number;
        action_type: string;
        action_prev_action_id: number | null;
        action_next_action_id: number | null;
        action_par_action_id: number | null;
        action_created_at: string | null;
        // causalLink
        causalLink_id: number;
        causalLink_causing_action: number;
        causalLink_caused_transaction_type_id: number;
        causalLink_caused_t_state_id: number;
        min: string;
        max: string;
        causalLink_cancel_proc: number;
        causalLink_continue_if_same_user: number;
        causalLink_created_at: string | null;
    };

function extractId(str) {
    if (!str) return null;
    const match = str.match(/\d+/); // procura a primeira sequência de dígitos
    return match ? match[0] : null;
}

@Component({
  selector: 'app-process-diagram',
  templateUrl: './process-diagram.component.html',
  styleUrls: ['./process-diagram.component.css']
})
export class ProcessDiagramComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    noDataToSave: boolean = false;
    dotCode: string = '';
    transactionTypes: any = [];
    waitingLinks: any = [];
    transactionStates: any = [];
    actions: any = [];
    actionRules: any = [];
    causalLinks: any = [];
    viz: any;
    svgXml: string = '';
    drawioObjectsXml: string = '';
    linkMap = new Map<string, LinkInfo[]>();
    processTypeId: number;


    constructor(
      private modalService: BsModalService,
      private translate: TranslateService,
      private alertToast: AlertToastService,
      private xmlDataService: XmlDataService,
      private restProcessDiagramApi: ProcessDiagramApiService,
      private restTransactionTypeApi: TransactionTypeApiService,
      private restWaitingLinkApi: WaitingLinkApiService,
      private restTransactionStateApi: TransactionStateApiService,
      private restActionApi: ActionApiService,
      private restActionRuleApi: ActionRuleApiService,
      private restCausalLinkApi: CausalLinkApiService
    ) {}

    async ngOnInit() {
        this.viz = new Viz({ Module, render });
        this.processTypeId = this.xmlDataService.getProcessType();
        await this.loadProcessDiagramData();
        await this.updateDotCode();
        await this.renderGraph();
        await this.generateDrawioObjects();
    }

    async loadProcessDiagramData() {
        this.transactionStates = await this.restTransactionStateApi.getTransactionStates().toPromise(); // Não crio transaction states novos, por isso posso pôr aqui
        const xmlContent = this.xmlDataService.getXml();

        if (xmlContent) {
            // 1. Criar parser para XML string → Document
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

            const toNullIfEmpty = v => (v === undefined || v === null || v === '' || v === 'null') ? null : v;
            const toInt = v => v ? parseInt(v, 10) : null;

            // 2. Buscar todos os <object> que têm id
            const allObjects = Array.from(xmlDoc.getElementsByTagName('object'));

            // 3. Filtrar transaction types, waiting links, action rules, actions e causal links
            this.transactionTypes = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('transType_');
                })
                .map(function (obj) {
                    const idAttr = obj.getAttribute('id');
                    return {
                        id: toInt(extractId(idAttr)),
                        language_id: toInt(obj.getAttribute('language_id')),
                        t_name: toNullIfEmpty(obj.getAttribute('t_name')),
                        rt_name: toNullIfEmpty(obj.getAttribute('rt_name')),
                        state: obj.getAttribute('state'),
                        process_type_id: toInt(obj.getAttribute('process_type_id')),
                        init_proc: toInt(obj.getAttribute('init_proc')),
                        end_proc: toInt(obj.getAttribute('end_proc')),
                        interm_task: toInt(obj.getAttribute('interm_task')),
                        external: toInt(obj.getAttribute('external')),
                        type: toNullIfEmpty(obj.getAttribute('type')),
                        frontier: toInt(obj.getAttribute('frontier')),
                        frontier_type: toNullIfEmpty(obj.getAttribute('frontier_type')),
                        executer_role_id: toInt(obj.getAttribute('executor_role_id')),
                        own_user_access_only: toInt(obj.getAttribute('own_user_acess_only')),
                        auto_activate: toInt(obj.getAttribute('auto_activate')),
                        freq_activate: toNullIfEmpty(obj.getAttribute('freq_activate')),
                        when_activate: toNullIfEmpty(obj.getAttribute('when_activate')),
                        created_at: obj.getAttribute('created_at'),
                    };
                });

            this.waitingLinks = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('waitingLink_') || id.startsWith('compositionLink_');
                })
                .map(function (obj) {
                    const idAttr = obj.getAttribute('id');
                    const type = idAttr.split('_')[0]; // "waitingLink" ou "compositionLink"
                    if (type === 'waitingLink') {
                        return {
                            id: toInt(extractId(idAttr)),
                            waited_t: toInt(obj.getAttribute('waited_t')),
                            waited_act: toInt(obj.getAttribute('waited_act')),
                            waiting_act: toInt(obj.getAttribute('waiting_act')),
                            waiting_t: toInt(obj.getAttribute('waiting_t')),
                            min: obj.getAttribute('min'),
                            max: obj.getAttribute('max'),
                            created_at: obj.getAttribute('created_at'),
                        };
                    } else if (type === 'compositionLink') {
                        return {
                            id: toInt(obj.getAttribute('waitingLink_id')),
                            waited_t: toInt(obj.getAttribute('waitingLink_waited_t')),
                            waited_act: toInt(obj.getAttribute('waitingLink_waited_act')),
                            waiting_act: toInt(obj.getAttribute('waitingLink_waiting_act')),
                            waiting_t: toInt(obj.getAttribute('waitingLink_waiting_t')),
                            min: obj.getAttribute('min'),
                            max: obj.getAttribute('max'),
                            created_at: obj.getAttribute('waitingLink_created_at'),
                        };
                    }
                });

            this.actionRules = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('causalLink_') || id.startsWith('compositionLink_');
                })
                .map(function (obj) {
                    return {
                        id: toInt(obj.getAttribute('actionRule_id')),
                        type: obj.getAttribute('actionRule_type'),
                        t_state_id: toInt(obj.getAttribute('actionRule_t_state_id')),
                        transaction_type_id: toInt(obj.getAttribute('actionRule_transaction_type_id')),
                        blockly_xml: toNullIfEmpty(obj.getAttribute('actionRule_blockly_xml')),
                        blockly_code: toNullIfEmpty(obj.getAttribute('actionRule_blockly_code')),
                        preview: obj.getAttribute('actionRule_preview'),
                        created_at: obj.getAttribute('actionRule_created_at'),
                    };
                });

            this.actions = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('causalLink_') || id.startsWith('compositionLink_');
                })
                .map(function (obj) {
                    return {
                        id: toInt(obj.getAttribute('action_id')),
                        action_rule_id: toInt(obj.getAttribute('actionRule_id')),
                        type: obj.getAttribute('action_type'),
                        prev_action_id: toInt(obj.getAttribute('action_prev_action_id')),
                        next_action_id: toInt(obj.getAttribute('action_next_action_id')),
                        par_action_id: toInt(obj.getAttribute('action_par_action_id')),
                        created_at: obj.getAttribute('action_created_at'),
                    };
                });

            this.causalLinks = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('causalLink_') || id.startsWith('compositionLink_');
                })
                .map (function (obj) {
                    const idAttr = obj.getAttribute('id');
                    const isCausal = idAttr.startsWith('causalLink_');

                    const linkIdAttr = isCausal ? extractId(idAttr) : obj.getAttribute('causalLink_id');

                    return {
                        id: toInt(linkIdAttr),
                        causing_action: toInt(obj.getAttribute('action_id')),
                        caused_transaction_type_id: toInt(obj.getAttribute('causalLink_caused_transaction_type_id')),
                        caused_t_state_id: toInt(obj.getAttribute('causalLink_caused_t_state_id')),
                        min: obj.getAttribute('min'),
                        max: obj.getAttribute('max'),
                        cancel_proc: toInt(obj.getAttribute('causalLink_cancel_proc')),
                        continue_if_same_user: toInt(obj.getAttribute('causalLink_continue_if_same_user')),
                        created_at: obj.getAttribute('causalLink_created_at'),
                    };
                });
        } else {
        this.transactionTypes = await this.restTransactionTypeApi.getTransactionTypes().toPromise();
        this.waitingLinks = await this.restWaitingLinkApi.getWaitingLinks().toPromise();
        this.actionRules = await this.restActionRuleApi.getActionRules().toPromise();
        this.actions = await this.restActionApi.getActions().toPromise();
        this.causalLinks = await this.restCausalLinkApi.getCausalLinks().toPromise();
        this.noDataToSave = true;
        }
    }

    updateDotCode() {
        let tableDefs = '';
        let edgeDefs = '';

        for (const transType of this.transactionTypes) {
            const t_name = transType.t_name;
            const nodeId = t_name.replace(/\s+/g, '');
            let tableFillColor = 'hotpink3'; // cor padrão para as tabelas
            let transTypeShape = 'Mrecord'; // forma padrão para as tabelas
            let transTypeLabel = t_name; // label padrão para as tabelas

            if (transType.process_type_id !== this.processTypeId) {
                transTypeShape = 'record'; // muda a forma para record se for de um processo diferente
                transTypeLabel = `{ | ${t_name} | }`;
            }
            if (transType.frontier) {
                if (transType.frontier_type === 'internal') {
                    tableFillColor = 'hotpink3:white';
                } else if (transType.frontier_type === 'external') {
                    tableFillColor = 'white:hotpink3';
                }
            } else if (transType.external) {
                tableFillColor = 'gainsboro';
            } else if (transType.type === 'documental') {
                tableFillColor = 'deepskyblue2';
            } else if (transType.type === 'informational') {
                tableFillColor = 'darkolivegreen3';
            }

            tableDefs += `${nodeId} [id="transType_${transType.id}", label="${transTypeLabel}", style="filled", shape="${transTypeShape}", fillcolor="${tableFillColor}", color="hotpink4"];\n`;

            if (transType.init_proc === 1) {
                const initNodeId = `init_${transType.id}`;
                tableDefs += `${initNodeId} [label="", shape=circle, width=0.1, style=filled, fillcolor="black"];\n`;
                edgeDefs += `${initNodeId} -> ${nodeId};\n`;
            } if (transType.interm_task == 1) {
                const intermNodeId = `interm_${transType.id}`;
                tableDefs += `${intermNodeId} [label="", shape=circle, width=0.1, style=filled, fillcolor="transparent", color="black"];\n`;
                edgeDefs += `${intermNodeId} -> ${nodeId};\n`;
            }
        }

        for (const waitingLink of this.waitingLinks) {
            const waitedTrans = this.transactionTypes.find(t => t.id === waitingLink.waited_t);
            const waitingTrans = this.transactionTypes.find(t => t.id === waitingLink.waiting_t);

            if (waitedTrans && waitingTrans) {
                const fromNodeName = waitedTrans.t_name.replace(/\s+/g, '');
                const toNodeName = waitingTrans.t_name.replace(/\s+/g, '');
                const key = `${fromNodeName}->${toNodeName}`;

                if (!this.linkMap.has(key)) this.linkMap.set(key, []);
                this.linkMap.get(key)!.push({
                    type: 'waiting',
                    id: waitingLink.id,
                    waited_t: waitingLink.waited_t,
                    waited_act: waitingLink.waited_act,
                    waiting_act: waitingLink.waiting_act,
                    waiting_t: waitingLink.waiting_t,
                    min: waitingLink.min,
                    max: waitingLink.max,
                    created_at: waitingLink.created_at
                });
            }
        }

        for (const causalLink of this.causalLinks) {
            const action = this.actions.find(a => a.id === causalLink.causing_action);

            if (action && action.type === 'causal_link') {
                const actionRule = this.actionRules.find(ar => ar.id === action.action_rule_id);
                if (!actionRule) continue;

                const originTrans = this.transactionTypes.find(t => t.id === actionRule.transaction_type_id);
                const targetTrans = this.transactionTypes.find(t => t.id === causalLink.caused_transaction_type_id);

                if (originTrans && targetTrans) {
                    const fromNodeName = originTrans.t_name.replace(/\s+/g, '');
                    const toNodeName = targetTrans.t_name.replace(/\s+/g, '');
                    const key = `${fromNodeName}->${toNodeName}`;

                    if (!this.linkMap.has(key)) this.linkMap.set(key, []);
                    this.linkMap.get(key)!.push({
                        type: 'causal',
                        actionRule_id: actionRule.id,
                        actionRule_type: actionRule.type,
                        actionRule_t_state_id: actionRule.t_state_id,
                        actionRule_transaction_type_id: actionRule.transaction_type_id,
                        actionRule_blockly_xml: actionRule.blockly_xml,
                        actionRule_blockly_code: actionRule.blockly_code,
                        actionRule_preview: actionRule.preview,
                        actionRule_created_at: actionRule.created_at,
                        action_id: action.id,
                        action_action_rule_id: action.action_rule_id,
                        action_type: action.type,
                        action_prev_action_id: action.prev_action_id,
                        action_next_action_id: action.next_action_id,
                        action_par_action_id: action.par_action_id,
                        action_created_at: action.created_at,
                        causalLink_id: causalLink.id,
                        causalLink_causing_action: causalLink.causing_action,
                        causalLink_caused_transaction_type_id: causalLink.caused_transaction_type_id,
                        causalLink_caused_t_state_id: causalLink.caused_t_state_id,
                        min: causalLink.min,
                        max: causalLink.max,
                        causalLink_cancel_proc: causalLink.cancel_proc,
                        causalLink_continue_if_same_user: causalLink.continue_if_same_user,
                        causalLink_created_at: causalLink.created_at
                    });
                }
            }
        }

        for (const [key, types] of this.linkMap.entries()) {
            const [fromNodeName, toNodeName] = key.split('->');

            const waiting = types.find(t => t.type === 'waiting') as any;
            const causal = types.find(t => t.type === 'causal') as any;

            let tooltipParts: string[] = [];
            let styleParts: string[] = [];

            let cardinality = '';
            let tStateInfo = '';
            let hasZeroMin = false;

            if (waiting && causal) {
                // Dependência de composição
                const waitedState = this.transactionStates.find(s => s.id === waiting.waited_act);
                const waitingState = this.transactionStates.find(s => s.id === waiting.waiting_act);
                const causedState = this.transactionStates.find(s => s.id === causal.actionRule_t_state_id);
                const causingState = this.transactionStates.find(s => s.id === causal.causalLink_caused_t_state_id);

                const waitedAbbrv = waitedState ? waitedState.abbrv : '';
                const waitingAbbrv = waitingState ? waitingState.abbrv : '';
                const causedAbbrv = causedState ? causedState.abbrv : '';
                const causingAbbrv = causingState ? causingState.abbrv : '';

                tStateInfo = `Waiting: ${waitedAbbrv} → ${waitingAbbrv}\nCausal: ${causedAbbrv} → ${causingAbbrv}`;

                // Só mostra uma cardinalidade (usar do waiting ou causal — tanto faz)
                const min = waiting.min;
                const max = waiting.max;
                cardinality = min === max ? `${min}` : `${min}..${max}`;

                if (min == 0 && causal.min == 0) hasZeroMin = true;
            } else if (waiting) {
                const waitedState = this.transactionStates.find(s => s.id === waiting.waited_act);
                const waitingState = this.transactionStates.find(s => s.id === waiting.waiting_act);

                const waitedAbbrv = waitedState ? waitedState.abbrv : '';
                const waitingAbbrv = waitingState ? waitingState.abbrv : '';

                tStateInfo = `Waiting: ${waitedAbbrv} → ${waitingAbbrv}`;

                const min = waiting.min;
                const max = waiting.max;
                cardinality = min === max ? `${min}` : `${min}..${max}`;

                if (min == 0) hasZeroMin = true;
            } else if (causal) {
                const causedState = this.transactionStates.find(s => s.id === causal.actionRule_t_state_id);
                const causingState = this.transactionStates.find(s => s.id === causal.causalLink_caused_t_state_id);

                const causedAbbrv = causedState ? causedState.abbrv : '';
                const causingAbbrv = causingState ? causingState.abbrv : '';

                tStateInfo = `Causal: ${causedAbbrv} → ${causingAbbrv}`;

                const min = causal.min;
                const max = causal.max;
                cardinality = min === max ? `${min}` : `${min}..${max}`;

                if (min == 0) hasZeroMin = true;
            }

            if (tStateInfo) tooltipParts.push(tStateInfo);
            if (cardinality) tooltipParts.push(`Cardinality: ${cardinality}`);
            if (hasZeroMin) styleParts.push('style=dashed');

            const tooltip = tooltipParts.join('\n');
            const style = styleParts.join(',');

            if (waiting && causal) {
                edgeDefs += `${fromNodeName} -> ${toNodeName} [arrowhead=diamond, tooltip="${tooltip}"${style ? `, ${style}` : ''}];\n`;
            } else if (waiting) {
                edgeDefs += `${fromNodeName} -> ${toNodeName} [dir=both, arrowtail=teetee, arrowhead=olnormal, tooltip="${tooltip}"${style ? `, ${style}` : ''}];\n`;
            } else if (causal) {
                edgeDefs += `${fromNodeName} -> ${toNodeName} [tooltip="${tooltip}"${style ? `, ${style}` : ''}];\n`;
            }
        }


        this.dotCode = `digraph { rankdir=LR ${tableDefs} ${edgeDefs} }`;
    }

    async renderGraph() {
        const output = document.getElementById('graph-output');
        if (!output) return;

        output.innerHTML = ''; // Limpa SVG anterior

        try {
            const svgElement = await this.viz.renderSVGElement(this.dotCode);
            const output = document.getElementById('graph-output');
            if (output) {
                output.innerHTML = '';
                output.appendChild(svgElement);
                // Extrai o XML
                this.svgXml = svgElement.outerHTML;
            }
        } catch (error) {
            console.error('Erro ao renderizar:', error);
            output.innerHTML = `<pre style="color:red;">${error.message}</pre>`;
            this.svgXml = '';
        }
    }

    generateDrawioObjects() {
        // Reset para evitar duplicações
        this.drawioObjectsXml = '';

        const parser = new DOMParser();
        const doc = parser.parseFromString(this.svgXml, 'image/svg+xml');
        const nodeElements = doc.querySelectorAll('g.node');
        const objects: string[] = [];
        const edgeElements = doc.querySelectorAll('g.edge');

        let dx = 1000;
        let dy = 800;
        const svg = doc.querySelector('svg');
        if (svg) {
            const widthAttr = svg.getAttribute('width');
            const heightAttr = svg.getAttribute('height');
            if (widthAttr && widthAttr.endsWith('pt')) {
                dx = parseFloat(widthAttr.replace('pt', ''));
            }
            if (heightAttr && heightAttr.endsWith('pt')) {
                dy = parseFloat(heightAttr.replace('pt', ''));
            }
        }

        nodeElements.forEach(g => {
            const titleElement = g.querySelector('title');
            const title = titleElement && titleElement.textContent ? titleElement.textContent.trim() : null;
            if (!title) return;

            // Caso seja init_* ou interm_*
            if (/^(init|interm)_\d+$/.test(title)) {
                const ellipse = g.querySelector('ellipse');
                if (!ellipse) return;

                const cx = parseFloat(ellipse.getAttribute('cx') || '0');
                const cy = parseFloat(ellipse.getAttribute('cy') || '0');
                const rx = parseFloat(ellipse.getAttribute('rx') || '0');
                const ry = parseFloat(ellipse.getAttribute('ry') || '0');
                const x = cx - rx;
                const y = cy - ry;
                const width = rx * 2;
                const height = ry * 2;

                const isInit = title.startsWith('init');
                const style = isInit
                    ? 'shape=ellipse;perimeter=ellipsePerimeter;fillColor=#000000;strokeColor=#000000;'
                    : 'shape=ellipse;perimeter=ellipsePerimeter;fillColor=none;strokeColor=#000000;';

                const mxCell = `
  <mxCell id="${title}" style="${style}" parent="1" vertex="1">
    <mxGeometry x="${x}" y="${y}" width="${width+5}" height="${height+5}" as="geometry"/>
  </mxCell>`.trim();

                objects.push(mxCell);
                return;
            }

            let t_name;
            let shapeElement;

            // Caso 1: Transaction type normal
            const path = g.querySelector('path');
            const firstText = g.querySelector('text');

            if (path && firstText && firstText.textContent && firstText.textContent.trim() !== '') {
                // Formato antigo
                t_name = firstText.textContent.trim();
                shapeElement = path;
            } else {
                // Caso 2: Transaction type de outro process
                const textElements = g.querySelectorAll('text');
                if (textElements.length < 2 || !textElements[1].textContent) return;
                t_name = textElements[1].textContent.trim();

                shapeElement = g.querySelector('polygon') || g.querySelector('path');
                if (!shapeElement) return;
            }

            const transType = this.transactionTypes.find(t => t.t_name === t_name);
            if (!transType) return;

            const dAttr = shapeElement.getAttribute('points') || shapeElement.getAttribute('d');
            if (!dAttr) return;

            const numberRegex = /-?\d*\.?\d+/g;
            const numbers: number[] = [];
            let match: RegExpExecArray | null;

            while ((match = numberRegex.exec(dAttr)) !== null) {
                numbers.push(parseFloat(match[0]));
            }

            const xs = numbers.filter((_, i) => i % 2 === 0);
            const ys = numbers.filter((_, i) => i % 2 === 1);

            const x = Math.min(...xs);
            const y = Math.min(...ys);
            const width = Math.max(...xs) - x;
            const height = Math.max(...ys) - y;

            const fillColor = shapeElement.getAttribute('fill')
            let fill = fillColor;

            const gId = g.getAttribute('id'); // gId aqui aparece transType_(id), como eu quero
            if (!gId) return;

            const stroke = '#8b3a62'; // hotpink4
            let difProcessStyling = 'rounded=1';

            if (transType.process_type_id !== this.processTypeId) {
                difProcessStyling = 'shape=process';
            }
            if (fillColor === '#cd6090') {
                if (transType.frontier_type === 'internal') {
                    fill += ';gradientDirection=east;gradientColor=#ffffff';
                } else if (transType.frontier_type === 'external') {
                    fill += ';gradientDirection=west;gradientColor=#ffffff';
                }
            }

            const objectAttrs = [
                `id="${gId}"`,
                `label="%t_name%"`,
                `language_id="${transType.language_id}"`,
                `t_name="${transType.t_name}"`,
                `rt_name="${transType.rt_name}"`,
                `state="${transType.state}"`,
                `process_type_id="${transType.process_type_id}"`,
                `init_proc="${transType.init_proc}"`,
                `end_proc="${transType.end_proc}"`,
                `interm_task="${transType.interm_task}"`,
                `external="${transType.external}"`,
                `type="${transType.type}"`,
                `frontier="${transType.frontier}"`,
                `frontier_type="${transType.frontier_type}"`,
                `executor_role_id="${transType.executer_role_id}"`,
                `own_user_acess_only="${transType.own_user_access_only}"`,
                `auto_activate="${transType.auto_activate}"`,
                `freq_activate="${transType.freq_activate}"`,
                `when_activate="${transType.when_activate}"`,
                `created_at="${transType.created_at}"`,
                `placeholders="1"`,
            ].join(' ');

            const style = `${difProcessStyling};whiteSpace=wrap;html=1;fontSize=13;strokeWidth=1;strokeColor=${stroke};fillColor=${fill};`;

            const mxCell = `
  <mxCell style="${style}" parent="1" vertex="1">
    <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
  </mxCell>
  `.trim();

            const objectXml = `<object ${objectAttrs}>\n  ${mxCell}\n</object>`;
            objects.push(objectXml);
        });

        edgeElements.forEach(edge => {
            const titleEl = edge.querySelector('title');
            const pathEl = edge.querySelector('path');
            if (!titleEl || !pathEl || !titleEl.textContent) return;

            const title = titleEl.textContent.trim();
            if (!title.includes('->')) return;

            const parts = title.split('->');
            if (parts.length !== 2) return;

            const sourceName = parts[0];
            const targetName = parts[1];

            const target = this.transactionTypes.find(
                t => t.t_name.replace(/\s+/g, '') === targetName
            )

            const targetId = `transType_${target.id}`;

            // Caso 1: edge init_* ou interm_* → transação (sem <object>)
            if (/^(init|interm)_\d+$/.test(sourceName)) {
                const style = 'endArrow=classic;html=1;strokeColor=#000000;';
                const edgeXml = `
  <mxCell style="${style}" edge="1" parent="1" source="${sourceName}" target="${targetId}">
    <mxGeometry relative="1" as="geometry">
    </mxGeometry>
  </mxCell>`.trim();
                objects.push(edgeXml);
                return;
            }

            // Caso 2: transação → transação, com atributos waiting/causal do linkMap
            const key = `${sourceName}->${targetName}`;
            const types = this.linkMap.get(key);
            if (!types || types.length === 0) return;

            const source = this.transactionTypes.find(
                t => t.t_name.replace(/\s+/g, '') === sourceName
            )

            const sourceId = `transType_${source.id}`;

            let edgeId = '';
            const waiting = types.find(t => t.type === 'waiting');
            let waitedState = '';
            let waitingState = '';
            const causal = types.find(t => t.type === 'causal');
            let causedState = '';
            let causingState = '';

            const attrPairs: string[] = [];
            if (waiting && waiting.type === 'waiting' && causal && causal.type === 'causal') {
                edgeId = `compositionLink_${waiting.id}_${causal.causalLink_id}`; // composition links IDs só têm que começar por compositionLink_, de resto pode-se pôr o que se quiser. só vão ser usados para saber que é uma composition link
                attrPairs.push(
                    `id="${edgeId}"`,
                    `min="${waiting.min}"`, // Não importa se é waiting ou causal, o min e max são os mesmos
                    `max="${waiting.max}"`,
                    `waitingLink_id="${waiting.id}"`,
                    `waitingLink_waited_t="${waiting.waited_t}"`,
                    `waitingLink_waited_act="${waiting.waited_act}"`,
                    `waitingLink_waiting_act="${waiting.waiting_act}"`,
                    `waitingLink_waiting_t="${waiting.waiting_t}"`,
                    `waitingLink_created_at="${waiting.created_at}"`,
                    `actionRule_id="${causal.actionRule_id}"`,
                    `actionRule_type="${causal.actionRule_type}"`,
                    `actionRule_t_state_id="${causal.actionRule_t_state_id}"`,
                    `actionRule_transaction_type_id="${causal.actionRule_transaction_type_id}"`,
                    `actionRule_blockly_xml="${causal.actionRule_blockly_xml}"`,
                    `actionRule_blockly_code="${causal.actionRule_blockly_code}"`,
                    `actionRule_preview="${causal.actionRule_preview}"`,
                    `actionRule_created_at="${causal.actionRule_created_at}"`,
                    `action_id="${causal.action_id}"`,
                    `action_type="${causal.action_type}"`,
                    `action_prev_action_id="${causal.action_prev_action_id}"`,
                    `action_next_action_id="${causal.action_next_action_id}"`,
                    `action_par_action_id="${causal.action_par_action_id}"`,
                    `action_created_at="${causal.action_created_at}"`,
                    `causalLink_id="${causal.causalLink_id}"`,
                    `causalLink_caused_transaction_type_id="${causal.causalLink_caused_transaction_type_id}"`,
                    `causalLink_caused_t_state_id="${causal.causalLink_caused_t_state_id}"`,
                    `causalLink_cancel_proc="${causal.causalLink_cancel_proc}"`,
                    `causalLink_continue_if_same_user="${causal.causalLink_continue_if_same_user}"`,
                    `causalLink_created_at="${causal.causalLink_created_at}"`
                );
                waitedState = this.transactionStates.find(s => s.id === waiting.waited_act).abbrv;
                waitingState = this.transactionStates.find(s => s.id === waiting.waiting_act).abbrv;
                causedState = this.transactionStates.find(s => s.id === causal.actionRule_t_state_id).abbrv;
                causingState = this.transactionStates.find(s => s.id === causal.causalLink_caused_t_state_id).abbrv;
            } else if (waiting && waiting.type === 'waiting') {
                edgeId = `waitingLink_${waiting.id}`;
                attrPairs.push(
                    `id="${edgeId}"`,
                    `waited_t="${waiting.waited_t}"`,
                    `waited_act="${waiting.waited_act}"`,
                    `waiting_act="${waiting.waiting_act}"`,
                    `waiting_t="${waiting.waiting_t}"`,
                    `min="${waiting.min}"`,
                    `max="${waiting.max}"`,
                    `created_at="${waiting.created_at}"`
                );
                waitedState = this.transactionStates.find(s => s.id === waiting.waited_act).abbrv;
                waitingState = this.transactionStates.find(s => s.id === waiting.waiting_act).abbrv;
            } else if (causal && causal.type === 'causal') {
                edgeId = `causalLink_${causal.causalLink_id}`;
                attrPairs.push(
                    `id="${edgeId}"`,
                    `min="${causal.min}"`,
                    `max="${causal.max}"`,
                    `actionRule_id="${causal.actionRule_id}"`,
                    `actionRule_type="${causal.actionRule_type}"`,
                    `actionRule_t_state_id="${causal.actionRule_t_state_id}"`,
                    `actionRule_transaction_type_id="${causal.actionRule_transaction_type_id}"`,
                    `actionRule_blockly_xml="${causal.actionRule_blockly_xml}"`,
                    `actionRule_blockly_code="${causal.actionRule_blockly_code}"`,
                    `actionRule_preview="${causal.actionRule_preview}"`,
                    `actionRule_created_at="${causal.actionRule_created_at}"`,
                    `action_id="${causal.action_id}"`,
                    `action_type="${causal.action_type}"`,
                    `action_prev_action_id="${causal.action_prev_action_id}"`,
                    `action_next_action_id="${causal.action_next_action_id}"`,
                    `action_par_action_id="${causal.action_par_action_id}"`,
                    `action_created_at="${causal.action_created_at}"`,
                    `causalLink_caused_transaction_type_id="${causal.causalLink_caused_transaction_type_id}"`,
                    `causalLink_caused_t_state_id="${causal.causalLink_caused_t_state_id}"`,
                    `causalLink_cancel_proc="${causal.causalLink_cancel_proc}"`,
                    `causalLink_continue_if_same_user="${causal.causalLink_continue_if_same_user}"`,
                    `causalLink_created_at="${causal.causalLink_created_at}"`
                );
                causedState = this.transactionStates.find(s => s.id === causal.actionRule_t_state_id).abbrv;
                causingState = this.transactionStates.find(s => s.id === causal.causalLink_caused_t_state_id).abbrv;
            }

            // Define estilo conforme tipo de seta
            let style = 'html=1;strokeColor=#000000;';
            if (waiting && causal) {
                style += 'endArrow=diamond;';
            } else if (waiting) {
                style += 'startArrow=ERmandOne;endArrow=async;';
            } else if (causal) {
                style += 'endArrow=classic;';
            }

            if (
                (waiting && waiting.type === 'waiting' && causal && causal.type === 'causal' && waiting.min === '0' && causal.min === '0') || // composição
                (waiting && waiting.type === 'waiting' && !causal && waiting.min === '0') ||                                                  // só waiting
                (causal && causal.type === 'causal' && !waiting && causal.min === '0')                                                        // só causal
            ) {
                style += 'dashed=1;';
            }

            let min = '', max = '';
            if (waiting && waiting.type === 'waiting') {
                min = waiting.min;
                max = waiting.max;
            } else if (causal && causal.type === 'causal') {
                min = causal.min;
                max = causal.max;
            }

            const showCardinality = max > '1' || (min !== '1' && min !== '0');
            const cardinality = min === max ? min : `${min}..${max}`;

            let composition = false;

            let tStateInfoLeft = '';
            let tStateInfoRight = '';


            let tStateTopLeft = '';
            let tStateTopRight = '';
            let tStateBottomLeft = '';
            let tStateBottomRight = '';


            if (waiting && causal) {
                composition = true;
                if (causedState !== 'ex') {
                    tStateTopLeft = causedState;
                }
                if (causingState !== 'rq') {
                    tStateTopRight = causingState;
                }
                if (waitedState !== 'ex') {
                    tStateBottomLeft = waitedState;
                }
                if (waitingState !== 'rq') {
                    tStateBottomRight = waitingState;
                }
            } else if (waiting) {
                if (waitedState !== 'ex') {
                    tStateInfoLeft = waitedState;
                }
                if (waitingState !== 'rq') {
                    tStateInfoRight = waitingState;
                }
            } else if (causal) {
                if (causedState !== 'ex') {
                    tStateInfoLeft = causedState;
                }
                if (causingState !== 'rq') {
                    tStateInfoRight = causingState;
                }
            }

            // para fazer a curvatura da linha, extrai os pontos do atributo d do path
            const dAttr = pathEl.getAttribute('d');  // ex: "M 10 10 L 50 50 L 80 30"
            const numbers = dAttr.match(/-?\d+(\.\d+)?/g).map(Number);

            // o primeiro par (M) é a origem visual, os restantes são pontos da linha
            let mxGeometry = '<mxGeometry relative="1" as="geometry">';
            if (numbers.length > 2) {
                mxGeometry += '<Array as="points">';
                for (let i = 2; i < numbers.length; i += 2) {
                    mxGeometry += `<mxPoint x="${numbers[i]}" y="${numbers[i+1]}"/>`;
                }
                mxGeometry += '</Array>';
            }
            mxGeometry += '</mxGeometry>';

            let edgeXml = `
<object ${attrPairs.join(' ')}>
  <mxCell style="${style}" edge="1" parent="1" source="${sourceId}" target="${targetId}">
    ${mxGeometry}
  </mxCell>
</object>
`.trim();

            if (composition) {
                if (tStateTopLeft) {
                    edgeXml += `
    <mxCell value="${tStateTopLeft}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
      <mxGeometry x="-0.8" relative="1" as="geometry">
        <mxPoint y="-10" as="offset"/>
      </mxGeometry>
    </mxCell>`;
                }

                if (tStateTopRight) {
                    edgeXml += `
    <mxCell value="${tStateTopRight}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
      <mxGeometry x="0.75" relative="1" as="geometry">
        <mxPoint y="-10" as="offset"/>
      </mxGeometry>
    </mxCell>`;
                }

                if (tStateBottomLeft) {
                    edgeXml += `
    <mxCell value="${tStateBottomLeft}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
      <mxGeometry x="-0.8" relative="1" as="geometry">
        <mxPoint y="10" as="offset"/>
      </mxGeometry>
    </mxCell>`;
                }

                if (tStateBottomRight) {
                    edgeXml += `
    <mxCell value="${tStateBottomRight}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
      <mxGeometry x="0.75" relative="1" as="geometry">
        <mxPoint y="10" as="offset"/>
      </mxGeometry>
    </mxCell>`;
                }
            } else {

                if (tStateInfoLeft) {
                    edgeXml += `
    <mxCell value="${tStateInfoLeft}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
      <mxGeometry x="-0.8" relative="1" as="geometry">
        <mxPoint y="-10" as="offset"/>
      </mxGeometry>
    </mxCell>`;
                }

                if (tStateInfoRight) {
                    edgeXml += `
    <mxCell value="${tStateInfoRight}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
      <mxGeometry x="0.75" relative="1" as="geometry">
        <mxPoint y="-10" as="offset"/>
      </mxGeometry>
    </mxCell>`;
                }


                if (showCardinality) {
                    edgeXml += `
  <mxCell value="${cardinality}" style="align=center;resizable=0;labelBackgroundColor=transparent;strokeColor=transparent;fontSize=11;whiteSpace=wrap" vertex="1" connectable="0" parent="${edgeId}">
    <mxGeometry x="-0.8" relative="1" as="geometry">
      <mxPoint y="10" as="offset"/>
    </mxGeometry>
  </mxCell>
  `.trim();
                }
            }

            objects.push(edgeXml);
        });

        const graphXml = `
<mxGraphModel dx="${dx}" dy="${dy}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    ${objects.join('\n    ')}
  </root>
</mxGraphModel>
`.trim();

        this.drawioObjectsXml = graphXml;
    }

    openSaveProcessDiagramModal() {
        this.xmlDataService.setToSaveContent(this.drawioObjectsXml);
        this.modalService.show(ModalSaveProcessDiagramComponent, {class: 'modal-lg'});
    }

    saveData() {
        if (this.noDataToSave) {
            this.alertToast.showError(this.translate.instant('PROCESS-DIAGRAM.SAVE-DATA.ALREADY-SAVED'));
            return;
        } else {
            const payload = {
                transactionTypes: this.transactionTypes,
                waitingLinks:  this.waitingLinks,
                actionRules: this.actionRules,
                actions: this.actions,
                causalLinks: this.causalLinks
            };

            this.restProcessDiagramApi.saveProcessDiagramBulk(payload).subscribe({
                next: (res) => {
                    if (res && res.success) {
                        this.alertToast.showSuccess(this.translate.instant('PROCESS-DIAGRAM.SAVE-DATA.SUCCESS'));
                        this.passEntry.emit('success');
                        this.noDataToSave = true; // Marca como já salvo
                    } else {
                        this.alertToast.showError(this.translate.instant('PROCESS-DIAGRAM.SAVE-DATA.ERROR'));
                        this.passEntry.emit('error');
                    }
                },
                error: () => {
                    this.alertToast.showError(this.translate.instant('PROCESS-DIAGRAM.SAVE-DATA.ERROR'));
                    this.passEntry.emit('error');
                }
            })
        }
    }
}
