// DbClient.js
window.DbClient = function(ui, opts) {
    this.ui = ui;
    this.baseUrl = (opts && opts.baseUrl) || '/editorDiagram';       // For GETs
    this.writeUrl = (opts && opts.writeUrl) || '/editorDiagramSave'; // For POST/PUT
    this.token = (opts && opts.token) || null; // Optional auth token
};

// -----------------------------------------------------------------------------
// Internal helper to add headers
// -----------------------------------------------------------------------------
DbClient.prototype._headers = function() {
    const h = { 'Content-Type': 'application/json' };
    if (this.token) h['Authorization'] = 'Bearer ' + this.token;
    return h;
};

// -----------------------------------------------------------------------------
// CREATE new file (insert)
// -----------------------------------------------------------------------------
DbClient.prototype.insertFile = function(title, xml, folderId) {
    return fetch(this.writeUrl, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({ title, xml, folderId })
    }).then(r => {
        if (!r.ok) throw new Error('Insert failed');
        return r.json();
    });
};

// -----------------------------------------------------------------------------
// UPDATE existing file (save)
// -----------------------------------------------------------------------------
DbClient.prototype.saveFile = function(id, xml, title, folderId) {
    return fetch(this.writeUrl + '/' + encodeURIComponent(id), {
        method: 'PUT',
        headers: this._headers(),
        body: JSON.stringify({ title, xml, folderId })
    }).then(r => {
        if (!r.ok) throw new Error('Save failed');
        return r.json();
    });
};

// -----------------------------------------------------------------------------
// RENAME file
// -----------------------------------------------------------------------------
DbClient.prototype.renameFile = function(id, title) {
    return fetch(this.writeUrl + '/' + encodeURIComponent(id) + '/rename', {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({ title })
    }).then(r => {
        if (!r.ok) throw new Error('Rename failed');
        return r.json();
    });
};

// -----------------------------------------------------------------------------
// LIST files (for your picker dialog)
// -----------------------------------------------------------------------------
DbClient.prototype.listFiles = function(folderId) {
    const url = this.readUrl + (folderId ? '?folder=' + encodeURIComponent(folderId) : '');
    return fetch(url, {
        method: 'GET',
        headers: this._headers()
    }).then(r => {
        if (!r.ok) throw new Error('List files failed');
        return r.json();
    });
};

// -----------------------------------------------------------------------------
// LOAD one file (to open it in the editor)
// -----------------------------------------------------------------------------
DbClient.prototype.loadFile = function(id) {
    return fetch(this.baseUrl + '/' + encodeURIComponent(id), {
        method: 'GET',
        headers: this._headers()
    }).then(r => {
        if (!r.ok) throw new Error('Load failed');
        return r.json();
    });
};

// -----------------------------------------------------------------------------
// Optional DELETE
// -----------------------------------------------------------------------------
DbClient.prototype.deleteFile = function(id) {
    return fetch(this.baseUrl + '/' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: this._headers()
    }).then(r => {
        if (!r.ok) throw new Error('Delete failed');
        return r.json();
    });
};

DbClient.prototype.pickFile = function (callback) {
    // Example: open your own file chooser, or list DB files
    console.log('Database picker opened');
    // Simulate a selection
    setTimeout(() => callback('12345'), 500);
};

DbClient.prototype.getFile = function (id, success, error) {
    fetch(this.baseUrl + '/' + id)
        .then(r => r.json())
        .then(data => {
            success(new DbFile(this.ui, data.xml, data.title, id));
        })
        .catch(error);
};

