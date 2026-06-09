import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
import {EnttypeApiService} from "../shared/rest-api/enttype-api.service";
import {PropertyApiService} from "../shared/rest-api/property-api.service";
import {XmlDataService} from "../shared/rest-api/xml-data.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {ModalSaveFactDiagramComponent} from "../modal-save-fact-diagram/modal-save-fact-diagram.component";
import {AlertToastService} from "../shared/common/alert-toast.service";
import {TranslateService} from "@ngx-translate/core";
import {FactDiagramApiService} from "../shared/rest-api/fact-diagram-api.service";

function extractId(str) {
    if (!str) return null;
    const match = str.match(/\d+/); // procura a primeira sequência de dígitos
    return match[0];
}

@Component({
    selector: 'app-fact-diagram',
    templateUrl: './fact-diagram.component.html',
    styleUrls: ['./fact-diagram.component.css']
})
export class FactDiagramComponent implements OnInit {

    @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

    noDataToSave: boolean = false;
    dotCode: string = '';
    entityTypes: any = [];
    properties: any = [];
    viz: any;
    svgXml: string = '';
    drawioObjectsXml: string = '';
    isAPropsByEntType = new Map<number, number[]>(); // ent_type_id => [prop_ids]
    propMapByEntities = new Map(); // map de lookup pelas combinações ent_type → ent_type

    constructor(
        private modalService: BsModalService,
        private translate: TranslateService,
        private alertToast: AlertToastService,
        private xmlDataService: XmlDataService,
        private restEntityTypeApi: EnttypeApiService,
        private restPropertyApi: PropertyApiService,
        private restFactDiagramApi: FactDiagramApiService
    ) {}

    async ngOnInit() {
        this.viz = new Viz({ Module, render });
        await this.loadFactDiagramData();
        await this.updateDotCode();
        await this.renderGraph();
        await this.generateDrawioObjects();
    }

    async loadFactDiagramData() {
        const xmlContent = this.xmlDataService.getXml();

        if (xmlContent) {
            // 1. Criar parser para XML string → Document
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

            const toInt = v => v ? parseInt(v, 10) : null;

            // 2. Buscar todos os <object> que têm id
            const allObjects = Array.from(xmlDoc.getElementsByTagName('object'));

            // 3. Filtrar entity types e properties
            this.entityTypes = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('entType_');
                })
                .map(function (obj) {
                    const idAttr = obj.getAttribute('id');
                    return {
                        id: toInt(extractId(idAttr)),
                        language_id: toInt(obj.getAttribute('language_id')),
                        name: obj.getAttribute('name'),
                        id_name: obj.getAttribute('id_name'),
                        state: obj.getAttribute('state'),
                        transaction_type_id: toInt(obj.getAttribute('transaction_type_id')),
                        last_internal_id: toInt(obj.getAttribute('last_internal_id')),
                        has_many: toInt(obj.getAttribute('has_many')),
                        auto_generated: toInt(obj.getAttribute('auto_generated')),
                        external: toInt(obj.getAttribute('external')),
                        user_details: toInt(obj.getAttribute('user_details')),
                        created_at: obj.getAttribute('created_at'),
                    };
                });

            this.properties = allObjects
                .filter(function (obj) {
                    const id = obj.getAttribute('id');
                    return id.startsWith('prop_');
                })
                .map(function (obj) {
                    const idAttr = obj.getAttribute('id');
                    return {
                        id: toInt(extractId(idAttr)),
                        language_id: toInt(obj.getAttribute('language_id')),
                        name: obj.getAttribute('name'),
                        tooltip: obj.getAttribute('tooltip'),
                        ent_type_id: toInt(obj.getAttribute('ent_type_id')),
                        value_type: obj.getAttribute('value_type'),
                        scope: obj.getAttribute('scope'),
                        unit_type_id: toInt(obj.getAttribute('unit_type_id')),
                        state: obj.getAttribute('state'),
                        fk_property_id: toInt(obj.getAttribute('fk_property_id')),
                        fk_entity_type_id: toInt(obj.getAttribute('fk_entity_type_id')),
                        part_of: toInt(obj.getAttribute('part_of')),
                        requires_translation: toInt(obj.getAttribute('requires_translation')),
                        editable: toInt(obj.getAttribute('editable')),
                        soft_delete: toInt(obj.getAttribute('soft_delete')),
                        is_a: toInt(obj.getAttribute('is_a')),
                        is_dependent: toInt(obj.getAttribute('is_dependent')),
                        multiple_values: toInt(obj.getAttribute('multiple_values')),
                        created_at: obj.getAttribute('created_at'),
                    };
                });
        } else {
        this.entityTypes = await this.restEntityTypeApi.getEntityTypes().toPromise();
        this.properties = await this.restPropertyApi.getProperties().toPromise();
        this.noDataToSave = true;
        }
    }

    updateDotCode() {
        let tableDefs = '';
        let edgeDefs = '';
        const typeMap: Record<string, string> = {
            prop_ref: 'ref',
            int: 'number'
        };

        // Passo 1: Identificar props com is_a = 1
        for (const prop of this.properties) {
            if (prop.is_a && prop.ent_type_id) {
                if (!this.isAPropsByEntType.has(prop.ent_type_id)) {
                    this.isAPropsByEntType.set(prop.ent_type_id, []);
                }
                this.isAPropsByEntType.get(prop.ent_type_id)!.push(prop.id);
            }
        }

        // Passo 2: Gerar os nós das entidades
        for (const entType of this.entityTypes) {
            const entName = entType.name;
            const nodeId = entName.replace(/\s+/g, '');

            // Filtra as propriedades associadas a este ent_type
            const props = this.properties.filter(p => p.ent_type_id === entType.id);

            // Gera as linhas para as propriedades no estilo {tipo | nome}
            let propLines = '';
            for (const p of props) {
                const type = typeMap[p.value_type] || p.value_type;
                propLines += ` | {${type} | ${p.name}}`;
            }

            // Define as cores com base nos atributos do ent_type
            let fillColor = '';
            let borderColor = '';

            if (entType.external) {
                fillColor = 'whitesmoke';
                borderColor = 'dimgray';
            } else if (entType.has_many && entType.auto_generated) {
                fillColor = 'magenta';
                borderColor = 'darkochid';
            } else if (entType.auto_generated) {
                fillColor = 'thistle2';
                borderColor = 'mediumorchid4';
            } else if (entType.has_many) {
                fillColor = 'dodgerblue';
                borderColor = 'royalblue';
            } else {
                fillColor = 'aliceblue';
                borderColor = 'steelblue';
            }

            tableDefs += `${nodeId} [id="${nodeId}", label="${entName}${propLines}", style="filled", fillcolor="${fillColor}", color="${borderColor}"];\n`;
        }

        // Passo 3: Adicionar triângulos (is_a) e ligações
        for (const [entTypeId] of this.isAPropsByEntType.entries()) {
            const ent = this.entityTypes.find(e => e.id === entTypeId);
            if (!ent) continue;

            const entNode = ent.name.replace(/\s+/g, '');
            const triangleNode = `is_a_${ent.id}`;
            tableDefs += `${triangleNode} [id="${triangleNode}", shape=triangle, label="+", orientation=270];\n`;
            edgeDefs += `${triangleNode} -> ${entNode} [arrowhead=none, style=dotted];\n`;
        }

        for (const prop of this.properties) {
            if (prop.value_type !== 'prop_ref') continue;

            const fromId = prop.ent_type_id;
            const toId = prop.fk_entity_type_id;
            if (!fromId || !toId) continue;

            // Verifica se o fk_property_id aponta para uma prop is_a=1 da mesma entidade
            const targetProp = this.properties.find(p => p.id === prop.fk_property_id);
            const isTargetIsA = (
                targetProp &&
                targetProp.is_a === 1 &&
                targetProp.ent_type_id === toId
            );

            const fromEntity = this.entityTypes.find(e => e.id === fromId);
            const fromNode = fromEntity.name.replace(/\s+/g, '');

            const toEntity = this.entityTypes.find(e => e.id === toId);
            const toNode = toEntity.name.replace(/\s+/g, '');
            const finalTarget = isTargetIsA ? `is_a_${toId}` : toNode;

            let attrs = '';
            if (!isTargetIsA) {
                const key = `${fromNode}->${toNode}`;
                if (!this.propMapByEntities.has(key)) this.propMapByEntities.set(key, prop);

                if (prop.is_dependent && !prop.multiple_values) {
                    attrs = '[dir=both, arrowtail=dotnormal]';
                } else if (prop.is_dependent) {
                    attrs = '[dir=both, arrowtail=dot]';
                } else if (!prop.multiple_values) {
                    attrs = '[dir=both]';
                }
            } else {
                attrs = '[arrowhead=none, style=dotted]';
            }

            edgeDefs += `${fromNode} -> ${finalTarget} ${attrs};\n`;
        }
        this.dotCode = `digraph { rankdir=LR node [shape=Mrecord] ${tableDefs} ${edgeDefs} }`;
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
            const textEls = g.querySelectorAll('text');
            const gId = g.getAttribute('id');
            if (!textEls || textEls.length === 0 || !gId) return;

            if (gId.startsWith('is_a')) {
                const polygon = g.querySelector('polygon');
                if (!polygon) return;

                // Extrair coordenadas dos pontos do polígono
                const points = polygon.getAttribute('points');
                const coords = points.trim().split(/\s+/).map(p => {
                    const [x, y] = p.split(',').map(Number);
                    return { x, y };
                });

                // Calcular bounding box do triângulo
                const minX = Math.min(...coords.map(p => p.x));
                const maxX = Math.max(...coords.map(p => p.x));
                const minY = Math.min(...coords.map(p => p.y));
                const maxY = Math.max(...coords.map(p => p.y));
                const width = maxX - minX;
                const height = maxY - minY;

                const triangleStyle = 'shape=triangle;whiteSpace=wrap;html=1;fillColor=white;strokeColor=black;orientation=270;fontSize=11;';
                const triangleCell = `
  <mxCell id="${gId}" value="+" style="${triangleStyle}" parent="1" vertex="1">
    <mxGeometry x="${minX}" y="${minY}" width="${width}" height="${height}" as="geometry"/>
  </mxCell>`.trim();

                objects.push(triangleCell);

                // Agora, descobrir qual é o ent_type que este triângulo representa
                for (const [entTypeId] of this.isAPropsByEntType.entries()) {
                    const entType = this.entityTypes.find(e => e.id === entTypeId);
                    if (!entType) continue;

                    // Sabendo que o gId do triângulo é igual a "is_a" + entTypeId
                    if (gId === `is_a_${entTypeId}`) {
                        const edgeStyle = 'dashed=1;dashPattern=1 1;endArrow=none;strokeColor=black;';

                        const edgeCell = `
  <mxCell style="${edgeStyle}" edge="1" parent="1" source="${gId}" target="entType_${entTypeId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>`.trim();

                        objects.push(edgeCell);
                        break;
                    }
                }

                return;
            }

            const path = g.querySelector('path');
            if (!path) return;

            // O primeiro <text> representa o nome da entidade
            const entName = textEls[0].textContent.trim();
            const entType = this.entityTypes.find(e => e.name === entName);
            if (!entType) return;

            // Os restantes <text> são os que descrevem as propriedades
            const propertyTextEls = Array.prototype.slice.call(textEls, 1);

            const dAttr = path.getAttribute('d');
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

            const widthMin = Math.max(width, 150);

            const fill = path.getAttribute('fill');
            const stroke = path.getAttribute('stroke');

            const objectAttrsEnt = [
                `id="entType_${entType.id}"`,
                `label="%name%"`,
                `language_id="${entType.language_id}"`,
                `name="${entType.name}"`,
                `id_name="${entType.id_name}"`,
                `state="${entType.state}"`,
                `transaction_type_id="${entType.transaction_type_id}"`,
                `last_internal_id="${entType.last_internal_id}"`,
                `has_many="${entType.has_many}"`,
                `auto_generated="${entType.auto_generated}"`,
                `external="${entType.external}"`,
                `user_details="${entType.user_details}"`,
                `created_at="${entType.created_at}"`,
                `placeholders="1"`
            ].join(' ');

            let style = `swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=45;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;align=center;fontSize=12;html=1;strokeColor=${stroke};fillColor=${fill};rounded=1;whiteSpace=wrap;`;

            if (entType.external) style += 'fontColor=#333333;';

            const mxCell = `
  <mxCell style="${style}" parent="1" vertex="1" treatAsSingle="0">
    <mxGeometry x="${x}" y="${y}" width="${widthMin}" height="${height}" as="geometry">
        <mxRectangle x="${x}" y="${y}" width="${width}" height="73" as="alternateBounds" />
    </mxGeometry>
  </mxCell>`.trim();

            const objectXmlLines = [`<object ${objectAttrsEnt}>`, mxCell, `</object>`];

            const polylineEls = g.querySelectorAll('polyline');
            const propertyCount = polylineEls.length;

            const entProps = this.properties.filter(p => p.ent_type_id === entType.id);
            const textPairs: { type: string; name: string }[] = [];

            for (let i = 0; i < propertyCount; i++) {
                const typeEl = propertyTextEls[i * 2];
                const nameEl = propertyTextEls[i * 2 + 1];
                if (typeEl && nameEl) {
                    textPairs.push({ type: typeEl.textContent ? typeEl.textContent.trim() : '', name: nameEl.textContent ? nameEl.textContent.trim() : '' });
                }
            }

            // Gerar <object> para cada property
            textPairs.forEach((tp) => {
                const prop = entProps.find(p => p.name === tp.name);
                if (!prop) return;

                const nameCellStyle = `shape=partialRectangle;top=0;left=0;right=0;bottom=1;align=left;verticalAlign=middle;fillColor=none;spacingLeft=60;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontStyle=1;fontSize=10;strokeColor=#000000;whiteSpace=wrap;`;
                const typeStyle = `shape=partialRectangle;fontStyle=1;right=1;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=10;`;

                const objectAttrsProp = [
                    `id="prop_${prop.id}"`,
                    `label="%name%"`,
                    `language_id="${prop.language_id}"`,
                    `name="${tp.name}"`,
                    `tooltip="${prop.tooltip}"`,
                    `ent_type_id="${prop.ent_type_id}"`,
                    `value_type="${prop.value_type}"`,
                    `scope="${prop.scope}"`,
                    `unit_type_id="${prop.unit_type_id}"`,
                    `state="${prop.state}"`,
                    `fk_property_id="${prop.fk_property_id}"`,
                    `fk_entity_type_id="${prop.fk_entity_type_id}"`,
                    `part_of="${prop.part_of}"`,
                    `requires_translation="${prop.requires_translation}"`,
                    `editable="${prop.editable}"`,
                    `soft_delete="${prop.soft_delete}"`,
                    `is_a="${prop.is_a}"`,
                    `is_dependent="${prop.is_dependent}"`,
                    `multiple_values="${prop.multiple_values}"`,
                    `created_at="${prop.created_at}"`,
                    `placeholders="1"`
                ].join(' ');

                const objectPropValueType = [
                    `id="propValueType_${prop.id}"`,
                    `label="%value_type%"`,
                    `value_type="${tp.type}"`,
                    `placeholders="1"`
                ].join(' ');

                const propMxcell = `
    <object ${objectAttrsProp}>
      <mxCell parent="entType_${prop.ent_type_id}" style="${nameCellStyle}" vertex="1" connectable="0">
        <mxGeometry width="200" height="20" as="geometry" />
      </mxCell>
    </object>
    <object ${objectPropValueType}>
      <mxCell parent="prop_${prop.id}" style="${typeStyle}" vertex="1" connectable="0">
        <mxGeometry width="56" height="20" as="geometry" />
      </mxCell>
    </object>`.trim();

                objectXmlLines.push(propMxcell);
            });

            const fullXml = objectXmlLines.join('\n');
            objects.push(fullXml);
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
            if (sourceName.startsWith('is_a')) return;

            const targetName = parts[1];
            let targetId = '';

            const source = this.entityTypes.find(
                e => e.name.replace(/\s+/g, '') === sourceName
            );

            const sourceId = `entType_${source.id}`;

            let style = 'html=1;strokeColor=#000000;';

            // Caso 1: ent_type → triângulo is_a
            if (targetName.startsWith('is_a')) {
                style += 'dashed=1;dashPattern=1 1;endArrow=none;';
                targetId = targetName; // o id do triângulo é o próprio nome do target
            }
            // Caso 2: ent_type → ent_type
            else {
                const prop = this.propMapByEntities.get(`${sourceName}->${targetName}`);
                if (!prop) return; // ignora se não encontrar ligação nos dados

                const target = this.entityTypes.find(
                    e => e.name.replace(/\s+/g, '') === targetName
                );
                targetId = `entType_${target.id}`;

                style += 'endArrow=classic;'; // se entrou aqui, a seta no final é sempre classic

                if (prop.is_dependent && !prop.multiple_values) {
                    style += 'startArrow=diamond;';
                } else if (prop.is_dependent) {
                    style += 'startArrow=oval;';
                } else if (!prop.multiple_values) {
                    style += 'startArrow=classic;';
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
<mxCell style="${style}" edge="1" parent="1" source="${sourceId}" target="${targetId}">
  ${mxGeometry}
</mxCell>
`.trim();

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

    openSaveFactDiagramModal() {
        this.xmlDataService.setToSaveContent(this.drawioObjectsXml);
        this.modalService.show(ModalSaveFactDiagramComponent, {class: 'modal-lg'});
    }

    saveData() {
        if (this.noDataToSave) {
            this.alertToast.showError(this.translate.instant('FACT-DIAGRAM.SAVE-DATA.ALREADY-SAVED'));
            return;
        } else {
            const payload = {
                entityTypes: this.entityTypes,
                properties:  this.properties
            };

            this.restFactDiagramApi.saveFactDiagramBulk(payload).subscribe({
                next: (res) => {
                    if (res && res.success) {
                        this.alertToast.showSuccess(this.translate.instant('FACT-DIAGRAM.SAVE-DATA.SUCCESS'));
                        this.passEntry.emit('success');
                        this.noDataToSave = true; // Marca como já salvo
                    } else {
                        this.alertToast.showError(this.translate.instant('FACT-DIAGRAM.SAVE-DATA.ERROR'));
                        this.passEntry.emit('error');
                    }
                },
                error: () => {
                    this.alertToast.showError(this.translate.instant('FACT-DIAGRAM.SAVE-DATA.ERROR'));
                    this.passEntry.emit('error');
                }
            });
        }
    }
}
