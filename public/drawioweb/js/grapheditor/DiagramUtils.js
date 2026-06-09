// =========================
// 🔹 VALIDATION - TRANSACTION
// =========================

function validateTransaction(cell) {
    const errors = [];

    const nome = getStyleValue(cell, "tx_nome");
    const tipo = getStyleValue(cell, "tx_tipo");
    const funcao = getStyleValue(cell, "tx_funcao");

    // Nome obrigatório
    if (!nome || nome.trim() === "") {
        errors.push(
            mxResources.get("error_transaction_name") ||
                "Transaction name is required"
        );
    }

    // Tipo obrigatório
    if (!tipo) {
        errors.push(
            mxResources.get("error_transaction_type") ||
                "Transaction type is required"
        );
    }

    // Função executora obrigatória
    if (!funcao) {
        errors.push(
            mxResources.get("error_executor_role") ||
                "Executor role is required"
        );
    }

    return errors;
}

function mapTransaction(cell) {
    return {
        id: parseInt(cell.id) || 0,

        language_id: getCurrentLanguageId(),

        t_name: getStyleValue(cell, "tx_nome") || null,
        rt_name: getStyleValue(cell, "tx_resultado") || null,

        state: getStyleValue(cell, "tx_estado") || "inactive",

        process_type_id: 1, // ajusta depois

        init_proc: 0,
        end_proc: getToggleValue(cell, "tx_finaliza"),
        interm_task: getToggleValue(cell, "tx_interm"),

        external: getStyleValue(cell, "tx_tipo") === "external" ? 1 : 0,

        type: getStyleValue(cell, "tx_tipo") || null,

        frontier: parseInt(getStyleValue(cell, "frontier") || 0),
        frontier_type: getStyleValue(cell, "frontier_type") || null,

        executer_role_id: parseInt(getStyleValue(cell, "tx_funcao")) || null,

        own_user_access_only: getToggleValue(cell, "tx_acesso"),
        auto_activate: 0,
        freq_activate: null,
        when_activate: null,
    };
}
function getToggleValue(cell, key) {
    const val = getStyleValue(cell, key);
    return val === "1" || val === 1 || val === true ? 1 : 0;
}

function getCurrentLanguageId() {
    return window.mxLanguage === "pt" ? 1 : 2;
}

function createValidateButton(cell, validatorFn, mapperFn) {
    const btn = document.createElement("button");

    btn.className = "geBtn";
    btn.style.marginTop = "10px";
    btn.innerText = mxResources.get("validate") || "Validate";

    btn.onclick = function () {
        const errors = validatorFn(cell);
        const data = mapperFn ? mapperFn(cell) : null;

        if (errors.length === 0) {
            alert(
                "✅ " +
                    (mxResources.get("valid") || "Valid") +
                    (data
                        ? "\n\n📦 Data:\n" + JSON.stringify(data, null, 2)
                        : "")
            );
        } else {
            alert(
                "❌ " +
                    (mxResources.get("errors") || "Errors") +
                    ":\n\n" +
                    errors.join("\n") +
                    (data
                        ? "\n\n📦 Current Data:\n" +
                          JSON.stringify(data, null, 2)
                        : "")
            );
        }
    };

    return btn;
}
