
// =========================
// 🔹 DIAGRAM-WIDE VALIDATION
// =========================

/**
 * Validates a single cell based on its style/type.
 * Returns an array of { cell, message } error objects.
 */
function validateCell(graph, cell) {
    var errors = [];
    var style = graph.getCellStyle(cell);
    var model = graph.getModel();

    // --- NODES ---

    // Transaction
    if (style.processModel == "1") {
        var nome = getStyleValue(cell, "tx_nome");
        var tipo = getStyleValue(cell, "tx_tipo");
        var funcao = getStyleValue(cell, "tx_funcao");

        if (!nome || nome.trim() === "") {
            errors.push({ cell: cell, message: mxResources.get("error_transaction_name") });
        }
        if (!tipo) {
            errors.push({ cell: cell, message: mxResources.get("error_transaction_type") });
        }
        if (!funcao) {
            errors.push({ cell: cell, message: mxResources.get("error_executor_role") });
        }
    }

    // Process Type
    if (style.processType == "1") {
        var ptNome = getStyleValue(cell, "pt_nome");
        if (!ptNome || ptNome.trim() === "") {
            errors.push({ cell: cell, message: mxResources.get("error_process_type_name") });
        }
    }

    // Entity (factModel + factType=entity)
    if (style.factModel == "1" && style.factType == "entity") {
        var fmNome = getStyleValue(cell, "fm_nome");
        var fmTipo = getStyleValue(cell, "fm_tipo_transacao");

        if (!fmNome || fmNome.trim() === "") {
            errors.push({ cell: cell, message: mxResources.get("error_entity_name") });
        }
        if (!fmTipo) {
            errors.push({ cell: cell, message: mxResources.get("error_entity_transaction_type") });
        }
    }

    // Property (factModel + factType=property)
    if (style.factModel == "1" && style.factType == "property") {
        var fpNome = getStyleValue(cell, "fp_nome");
        var fpTipoEnt = getStyleValue(cell, "fp_tipo_entidade");
        var fpTipoVal = getStyleValue(cell, "fp_tipo_valor");

        if (!fpNome || fpNome.trim() === "") {
            errors.push({ cell: cell, message: mxResources.get("error_property_name") });
        }
        if (!fpTipoEnt) {
            errors.push({ cell: cell, message: mxResources.get("error_property_entity_type") });
        }
        if (!fpTipoVal) {
            errors.push({ cell: cell, message: mxResources.get("error_property_value_type") });
        }
    }

    // --- EDGES / LINKS ---

    // Orphan edge check (applies to all edges)
    if (model.isEdge(cell)) {
        var source = model.getTerminal(cell, true);
        var target = model.getTerminal(cell, false);

        if (!source || !target) {
            errors.push({ cell: cell, message: mxResources.get("error_orphan_edge") });
        }
    }

    // Waiting Link
    if (style.waitinglink == "1") {
        var wSource = model.getTerminal(cell, true);
        var wTarget = model.getTerminal(cell, false);

        if (wSource && graph.getCellStyle(wSource).processModel != "1") {
            errors.push({ cell: cell, message: mxResources.get("error_waiting_source") });
        }
        if (wTarget && graph.getCellStyle(wTarget).processModel != "1") {
            errors.push({ cell: cell, message: mxResources.get("error_waiting_target") });
        }
        var waitingAct = getStyleValue(cell, "waiting_act");
        var waitedAct = getStyleValue(cell, "waited_act");
        if (!waitingAct) {
            errors.push({ cell: cell, message: mxResources.get("error_waiting_state") });
        }
        if (!waitedAct) {
            errors.push({ cell: cell, message: mxResources.get("error_waited_state") });
        }
    }

    // Causal Link
    if (style.causallink == "1") {
        var cSource = model.getTerminal(cell, true);
        var cTarget = model.getTerminal(cell, false);

        if (cSource && graph.getCellStyle(cSource).processModel != "1") {
            errors.push({ cell: cell, message: mxResources.get("error_causal_source") });
        }
        if (cTarget && graph.getCellStyle(cTarget).processModel != "1") {
            errors.push({ cell: cell, message: mxResources.get("error_causal_target") });
        }
        var causedState = getStyleValue(cell, "caused_t_state_id");
        var causingAction = getStyleValue(cell, "causing_action");
        if (!causedState) {
            errors.push({ cell: cell, message: mxResources.get("error_caused_state") });
        }
        if (!causingAction) {
            errors.push({ cell: cell, message: mxResources.get("error_causing_action") });
        }
    }

    // Composition Link
    if (style.compositionlink == "1") {
        var compSource = model.getTerminal(cell, true);
        var compTarget = model.getTerminal(cell, false);

        if (compSource && graph.getCellStyle(compSource).processModel != "1") {
            errors.push({ cell: cell, message: mxResources.get("error_composition_source") });
        }
        if (compTarget && graph.getCellStyle(compTarget).processModel != "1") {
            errors.push({ cell: cell, message: mxResources.get("error_composition_target") });
        }
        var compWaitingAct = getStyleValue(cell, "waiting_act");
        var compWaitedAct = getStyleValue(cell, "waited_act");
        var compCausingAction = getStyleValue(cell, "causing_action");
        if (!compWaitingAct) {
            errors.push({ cell: cell, message: mxResources.get("error_comp_waiting_state") });
        }
        if (!compWaitedAct) {
            errors.push({ cell: cell, message: mxResources.get("error_comp_waited_state") });
        }
        if (!compCausingAction) {
            errors.push({ cell: cell, message: mxResources.get("error_comp_causing_action") });
        }
    }

    // Fact Link / Connector
    if (style.connector == "1") {
        var fSource = model.getTerminal(cell, true);
        var fTarget = model.getTerminal(cell, false);

        if (fSource) {
            var fSourceStyle = graph.getCellStyle(fSource);
            if (fSourceStyle.factModel != "1") {
                errors.push({ cell: cell, message: mxResources.get("error_connector_source") });
            }
        }
        if (fTarget) {
            var fTargetStyle = graph.getCellStyle(fTarget);
            if (fTargetStyle.factModel != "1") {
                errors.push({ cell: cell, message: mxResources.get("error_connector_target") });
            }
        }
    }

    return errors;
}

/**
 * Validates the entire diagram.
 * Returns an array of { cell, message } error objects.
 */
function validateDiagram(graph) {
    var parent = graph.getDefaultParent();
    var cells = graph.getChildCells(parent, true, true);
    var allErrors = [];

    for (var i = 0; i < cells.length; i++) {
        var cellErrors = validateCell(graph, cells[i]);
        for (var j = 0; j < cellErrors.length; j++) {
            allErrors.push(cellErrors[j]);
        }
    }

    return allErrors;
}

/**
 * Displays validation errors by updating the editor UI and refreshing the format panel.
 */
function showValidationErrors(errors, editorUi) {
    // Store the errors in editorUi so the ErrorsFormatPanel can read them
    editorUi.validationErrors = errors;

    // Refresh the format panel to show the Errors tab
    if (editorUi.format != null) {
        editorUi.format.refresh();
    }
}

/**
 * Gets a human-readable display name for a cell.
 */
function getCellDisplayName(graph, cell) {
    var style = graph.getCellStyle(cell);
    var model = graph.getModel();
    var unnamed = " (" + mxResources.get("val_unnamed") + ")";

    // Transaction
    if (style.processModel == "1") {
        var txName = getStyleValue(cell, "tx_nome");
        return mxResources.get("val_transaction") + (txName && txName.trim() ? " (" + txName + ")" : unnamed);
    }

    // Process Type
    if (style.processType == "1") {
        var ptName = getStyleValue(cell, "pt_nome");
        return mxResources.get("val_process_type") + (ptName && ptName.trim() ? " (" + ptName + ")" : unnamed);
    }

    // Entity
    if (style.factModel == "1" && style.factType == "entity") {
        var fmName = getStyleValue(cell, "fm_nome");
        return mxResources.get("val_entity") + (fmName && fmName.trim() ? " (" + fmName + ")" : unnamed);
    }

    // Property
    if (style.factModel == "1" && style.factType == "property") {
        var fpName = getStyleValue(cell, "fp_nome");
        return mxResources.get("val_property") + (fpName && fpName.trim() ? " (" + fpName + ")" : unnamed);
    }

    // Links
    if (style.waitinglink == "1") {
        return mxResources.get("val_waiting_link");
    }
    if (style.causallink == "1") {
        return mxResources.get("val_causal_link");
    }
    if (style.compositionlink == "1") {
        return mxResources.get("val_composition_link");
    }
    if (style.connector == "1") {
        return mxResources.get("val_fact_connector");
    }

    // Generic edge
    if (model.isEdge(cell)) {
        return mxResources.get("val_connection");
    }

    // Generic vertex
    return mxResources.get("val_element");
}

/**
 * Builds the payload for the /processDiagram/bulk-save endpoint.
 * Traverses the diagram graph and extracts semantic data from cells.
 *
 * Currently extracts: Transaction Types
 * Future tasks will add: WaitingLinks, CausalLinks, ActionRules, Actions
 */
function buildBulkSavePayload(graph, processDiagramId, processTypeId) {
    var payload = {
        processDiagramId: processDiagramId,
        processTypeId: processTypeId,
        
        transactionTypes: [],
        waitingLinks: [],
        causalLinks: [],
        actionRules: [],
        actions: []
    };

    // Determine language ID from editor language
    var lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'pt';
    var langMap = { 'pt': 1, 'en': 2 };
    var languageId = langMap[lang] || 1;


    // Traverse all cells (same pattern as validateDiagram)
    var parent = graph.getDefaultParent();
    var cells = graph.getChildCells(parent, true, true);

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var style = graph.getCellStyle(cell);

        // --- Transaction Types (processModel == "1") ---
        if (style.processModel == "1") {
            var txNome = getStyleValue(cell, "tx_nome") || null;
            var txResultado = getStyleValue(cell, "tx_resultado") || null;
            var txEstado = getStyleValue(cell, "tx_estado") || "inactive";
            var txFuncao = parseInt(getStyleValue(cell, "tx_funcao")) || 0;
            var txTipo = getStyleValue(cell, "tx_tipo") || null;
            var txFinaliza = parseInt(getStyleValue(cell, "tx_finaliza")) || 0;
            var txInterm = parseInt(getStyleValue(cell, "tx_interm")) || 0;
            var txAcesso = parseInt(getStyleValue(cell, "tx_acesso")) || 0;
            
            // Frontier extraction
            var rawFrontier = getStyleValue(cell, "frontier");
            var rawFrontierType = getStyleValue(cell, "frontier_type");
            var isFrontier = (rawFrontier == "1") ? 1 : 0;
            var extractedFrontierType = null;
            if (isFrontier) {
                extractedFrontierType = rawFrontierType || "internal"; // Defaulting to internal if missing but frontier=1
            }

            payload.transactionTypes.push({
                diagram_id: cell.getId(),
                language_id: languageId,
                t_name: txNome,
                rt_name: txResultado,
                state: txEstado,
                process_type_id: processTypeId,
                init_proc: 0,
                end_proc: txFinaliza,
                interm_task: txInterm,
                external: txTipo === "external" ? 1 : 0,
                type: txTipo,
                frontier: isFrontier,
                frontier_type: extractedFrontierType,
                executer_role_id: txFuncao,
                own_user_access_only: txAcesso,
                auto_activate: 0,
                freq_activate: null,
                when_activate: null
            });
        }

        // --- Waiting Links (waitinglink == "1") ---
        if (style.waitinglink == "1") {
            var model = graph.getModel();
            var wSource = model.getTerminal(cell, true);
            var wTarget = model.getTerminal(cell, false);

            if (wSource && wTarget) {
                payload.waitingLinks.push({
                    diagram_id: cell.getId(),
                    waited_t: wTarget.getId(),
                    waited_act: parseInt(getStyleValue(cell, "waited_act")) || 0,
                    waiting_act: parseInt(getStyleValue(cell, "waiting_act")) || 0,
                    waiting_t: wSource.getId(),
                    min: getStyleValue(cell, "min") || "1",
                    max: getStyleValue(cell, "max") || "1"
                });
            }
        }

        // --- Causal Links (causallink == "1") ---
        if (style.causallink == "1") {
            var model = graph.getModel();
            var cSource = model.getTerminal(cell, true);
            var cTarget = model.getTerminal(cell, false);

            if (cSource && cTarget) {
                payload.causalLinks.push({
                    diagram_id: cell.getId(),
                    causing_action: parseInt(getStyleValue(cell, "causing_action")) || 0,
                    caused_transaction_type_id: cTarget.getId(),
                    caused_t_state_id: parseInt(getStyleValue(cell, "caused_t_state_id")) || 0,
                    min: getStyleValue(cell, "min") || "1",
                    max: getStyleValue(cell, "max") || "1",
                    cancel_proc: parseInt(getStyleValue(cell, "cancel_proc")) || 0,
                    continue_if_same_user: parseInt(getStyleValue(cell, "continue_if_same_user")) || 0
                });
            }
        }

        // --- Composition Links (compositionlink == "1") ---
        // A composition link produces both a WaitingLink AND a CausalLink
        if (style.compositionlink == "1") {
            var model = graph.getModel();
            var compSource = model.getTerminal(cell, true);
            var compTarget = model.getTerminal(cell, false);

            if (compSource && compTarget) {
                // WaitingLink part
                payload.waitingLinks.push({
                    diagram_id: cell.getId() + "_wl",
                    waited_t: compTarget.getId(),
                    waited_act: parseInt(getStyleValue(cell, "waited_act")) || 0,
                    waiting_act: parseInt(getStyleValue(cell, "waiting_act")) || 0,
                    waiting_t: compSource.getId(),
                    min: getStyleValue(cell, "min") || "1",
                    max: getStyleValue(cell, "max") || "1"
                });

                // CausalLink part
                payload.causalLinks.push({
                    diagram_id: cell.getId() + "_cl",
                    causing_action: parseInt(getStyleValue(cell, "causing_action")) || 0,
                    caused_transaction_type_id: compTarget.getId(),
                    caused_t_state_id: parseInt(getStyleValue(cell, "caused_t_state_id")) || 0,
                    min: getStyleValue(cell, "min") || "1",
                    max: getStyleValue(cell, "max") || "1",
                    cancel_proc: parseInt(getStyleValue(cell, "cancel_proc")) || 0,
                    continue_if_same_user: parseInt(getStyleValue(cell, "continue_if_same_user")) || 0
                });
            }
        }
    }

    console.log("buildBulkSavePayload:",
        payload.transactionTypes.length, "transaction types,",
        payload.waitingLinks.length, "waiting links,",
        payload.causalLinks.length, "causal links extracted");

    return payload;
}
