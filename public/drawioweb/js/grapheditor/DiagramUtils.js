
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
        var causedState = getStyleValue(cell, "caused_state");
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
 * Displays validation errors in a floating, draggable mxWindow.
 * Each error is clickable → selects, scrolls to, and highlights the cell.
 */
function showValidationErrors(errors, editorUi) {
    var graph = editorUi.editor.graph;

    // Clean up any previous validation window
    if (window._validationWindow) {
        try {
            window._validationWindow.destroy();
        } catch (e) { /* ignore */ }
        window._validationWindow = null;
    }

    // Clean up any previous highlight
    if (window._validationHighlight) {
        try {
            window._validationHighlight.destroy();
        } catch (e) { /* ignore */ }
        window._validationHighlight = null;
    }

    // Build the content div
    var content = document.createElement("div");
    content.style.padding = "10px";
    content.style.fontFamily = "Arial, Helvetica, sans-serif";
    content.style.fontSize = "13px";
    content.style.overflowY = "auto";
    content.style.maxHeight = "400px";

    // Header with error count
    var header = document.createElement("div");
    header.style.fontWeight = "bold";
    header.style.marginBottom = "10px";
    header.style.color = "#d32f2f";
    header.style.fontSize = "14px";
    header.innerHTML = "⚠️ " + errors.length + " " + mxResources.get("validation_errors");
    content.appendChild(header);

    // Error list
    var list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "4px";

    for (var i = 0; i < errors.length; i++) {
        (function (err, index) {
            var item = document.createElement("div");
            item.style.padding = "8px 10px";
            item.style.borderRadius = "6px";
            item.style.border = "1px solid #e0e0e0";
            item.style.background = "#fff8f8";
            item.style.cursor = "pointer";
            item.style.transition = "all 0.15s ease";
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.gap = "8px";

            // Error icon
            var icon = document.createElement("span");
            icon.innerHTML = "❌";
            icon.style.fontSize = "14px";
            icon.style.flexShrink = "0";

            // Error text
            var text = document.createElement("span");
            var cellLabel = getCellDisplayName(graph, err.cell);
            text.innerHTML = "<strong>" + cellLabel + "</strong>: " + err.message;
            text.style.flex = "1";

            item.appendChild(icon);
            item.appendChild(text);

            // Hover effect
            item.onmouseenter = function () {
                item.style.background = "#ffebee";
                item.style.borderColor = "#ef9a9a";
            };
            item.onmouseleave = function () {
                item.style.background = "#fff8f8";
                item.style.borderColor = "#e0e0e0";
            };

            // Click → select, scroll, highlight
            item.onclick = function () {
                // Remove previous highlight
                if (window._validationHighlight) {
                    try {
                        window._validationHighlight.destroy();
                    } catch (e) { /* ignore */ }
                }

                // Select the cell
                graph.setSelectionCell(err.cell);
                graph.scrollCellToVisible(err.cell);

                // Highlight with red border
                var hl = new mxCellHighlight(graph, "#d32f2f", 4);
                var state = graph.view.getState(err.cell);
                if (state) {
                    hl.highlight(state);
                }
                window._validationHighlight = hl;

                // Mark active item
                var items = list.querySelectorAll("div");
                for (var k = 0; k < items.length; k++) {
                    items[k].style.background = "#fff8f8";
                    items[k].style.borderColor = "#e0e0e0";
                }
                item.style.background = "#ffcdd2";
                item.style.borderColor = "#e57373";
            };

            list.appendChild(item);
        })(errors[i], i);
    }

    content.appendChild(list);

    // Create the mxWindow
    var x = Math.max(10, (document.body.clientWidth || 800) - 420);
    var y = 60;
    var w = 380;
    var h = Math.min(450, 80 + errors.length * 50);

    var wnd = new mxWindow(
        mxResources.get("validation_title"),
        content,
        x, y, w, h,
        true,  // movable
        true   // resizable
    );

    wnd.setMaximizable(false);
    wnd.setClosable(true);
    wnd.setVisible(true);

    // On close, clean up highlight
    wnd.addListener(mxEvent.DESTROY, function () {
        if (window._validationHighlight) {
            try {
                window._validationHighlight.destroy();
            } catch (e) { /* ignore */ }
            window._validationHighlight = null;
        }
        window._validationWindow = null;
    });

    window._validationWindow = wnd;
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
