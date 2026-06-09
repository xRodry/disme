// DbFile.js
function DbFile(ui, data, title, id, folderId) {
    DrawioFile.call(this, ui, data);

    this.title = title || null;
    this.fileId = id || null;
    this.folderId = folderId || null;
    this.editable = true;
    this.lastModified = new Date().toISOString();
}

mxUtils.extend(DbFile, DrawioFile);
DbFile.prototype.constructor = DbFile;

// -----------------------------------------------------------------------------
// Required metadata methods
// -----------------------------------------------------------------------------
DbFile.prototype.getMode = function () {
    return App.MODE_DB;
};

DbFile.prototype.getTitle = function () {
    return this.title;
};

DbFile.prototype.getHash = function () {
    // Used for tracking open files
    return "D" + encodeURIComponent(this.fileId || this.title || "");
};

DbFile.prototype.isAutosaveOptional = function () {
    return true;
};

DbFile.prototype.isRenamable = function () {
    return true;
};

DbFile.prototype.isMovable = function () {
    return false;
};

DbFile.prototype.isEditable = function () {
    return this.editable;
};

// -----------------------------------------------------------------------------
// Core persistence methods
// -----------------------------------------------------------------------------
DbFile.prototype.save = function (revision, success, error) {
    const xml = this.getData();

    this.ui.db
        .saveFile(this.fileId, xml, this.title, this.folderId)
        .then(
            mxUtils.bind(this, function (resp) {
                this.setModified(false);
                this.lastModified = new Date().toISOString();
                if (success) success(resp);
            })
        )
        .catch(function (err) {
            if (error) error(err);
        });
};

DbFile.prototype.saveAs = function (filename, success, error) {
    const xml = this.getData();

    this.ui.db
        .insertFile(filename, xml, this.folderId)
        .then(
            mxUtils.bind(this, function (resp) {
                this.title = resp.title || filename;
                this.fileId = resp.id;
                this.lastModified = new Date().toISOString();
                this.setModified(false);
                if (success) success(resp);
            })
        )
        .catch(function (err) {
            if (error) error(err);
        });
};

DbFile.prototype.rename = function (newTitle, success, error) {
    this.ui.db
        .renameFile(this.fileId, newTitle)
        .then(
            mxUtils.bind(this, function (resp) {
                this.title = newTitle;
                if (success) success(resp);
            })
        )
        .catch(function (err) {
            if (error) error(err);
        });
};

// -----------------------------------------------------------------------------
// Optional helper methods for Draw.io lifecycle
// -----------------------------------------------------------------------------
DbFile.prototype.open = function () {
    // Called when Draw.io loads this file into the editor
    this.ui.setFileData(this.getData());
};

DbFile.prototype.getData = function () {
    // Returns XML for save() / saveAs()
    return this.data || this.ui.editor.getGraphXml();
};

DbFile.prototype.getSize = function () {
    // Optional: estimate XML size for display/logs
    const xml = this.getData();
    return xml ? xml.length : 0;
};

DbFile.prototype.destroy = function () {
    // Clean up any open resources if needed
};
