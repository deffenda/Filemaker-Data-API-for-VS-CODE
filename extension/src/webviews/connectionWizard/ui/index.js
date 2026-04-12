// @ts-check
/// <reference lib="dom" />

const vscode = acquireVsCodeApi();

document.addEventListener('DOMContentLoaded', () => {
  const form = /** @type {HTMLFormElement} */ (document.getElementById('wizardForm'));
  const directBtn = /** @type {HTMLButtonElement} */ (document.getElementById('modeDirectBtn'));
  const proxyBtn = /** @type {HTMLButtonElement} */ (document.getElementById('modeProxyBtn'));
  const directFields = /** @type {HTMLElement} */ (document.getElementById('directFields'));
  const proxyFields = /** @type {HTMLElement} */ (document.getElementById('proxyFields'));
  const saveBtn = /** @type {HTMLButtonElement} */ (document.getElementById('saveBtn'));
  const testBtn = /** @type {HTMLButtonElement} */ (document.getElementById('testBtn'));
  const statusEl = /** @type {HTMLElement} */ (document.getElementById('status'));

  let authMode = 'direct';

  // Mode toggle
  directBtn.addEventListener('click', () => {
    authMode = 'direct';
    directBtn.classList.add('active');
    proxyBtn.classList.remove('active');
    directFields.classList.add('visible');
    proxyFields.classList.remove('visible');
  });

  proxyBtn.addEventListener('click', () => {
    authMode = 'proxy';
    proxyBtn.classList.add('active');
    directBtn.classList.remove('active');
    proxyFields.classList.add('visible');
    directFields.classList.remove('visible');
  });

  // Initialize
  directBtn.classList.add('active');
  directFields.classList.add('visible');

  // Save
  saveBtn.addEventListener('click', () => {
    const data = collectFormData();
    if (!data) {
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    clearStatus();

    vscode.postMessage({ type: 'save', payload: data });
  });

  // Test connection
  testBtn.addEventListener('click', () => {
    const data = collectFormData();
    if (!data) {
      return;
    }

    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    clearStatus();

    vscode.postMessage({ type: 'testConnection', payload: data });
  });

  // Message handling
  window.addEventListener('message', (event) => {
    const message = event.data;
    if (!message || typeof message.type !== 'string') {
      return;
    }

    switch (message.type) {
      case 'saveSuccess':
        showStatus('success', message.message || 'Profile saved successfully.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Profile';
        break;

      case 'saveError':
        showStatus('error', message.message || 'Failed to save profile.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Profile';
        break;

      case 'testSuccess':
        showStatus('success', message.message || 'Connection successful.');
        testBtn.disabled = false;
        testBtn.textContent = 'Test Connection';
        break;

      case 'testError':
        showStatus('error', message.message || 'Connection failed.');
        testBtn.disabled = false;
        testBtn.textContent = 'Test Connection';
        break;

      case 'loadProfile':
        populateForm(message.payload);
        break;
    }
  });

  function collectFormData() {
    const name = getValue('profileName');
    const serverUrl = getValue('serverUrl');
    const database = getValue('database');
    const apiBasePath = getValue('apiBasePath');
    const apiVersionPath = getValue('apiVersionPath');

    if (!name || !serverUrl || !database) {
      showStatus('error', 'Profile name, server URL, and database are required.');
      return null;
    }

    const data = {
      name,
      authMode,
      serverUrl,
      database,
      apiBasePath: apiBasePath || '/fmi/data',
      apiVersionPath: apiVersionPath || 'vLatest'
    };

    if (authMode === 'direct') {
      const username = getValue('username');
      const password = getValue('password');
      if (!username) {
        showStatus('error', 'Username is required for direct mode.');
        return null;
      }
      return { ...data, username, password };
    }

    const proxyEndpoint = getValue('proxyEndpoint');
    const proxyApiKey = getValue('proxyApiKey');
    if (!proxyEndpoint) {
      showStatus('error', 'Proxy endpoint is required for proxy mode.');
      return null;
    }
    return { ...data, proxyEndpoint, proxyApiKey };
  }

  function populateForm(profile) {
    if (!profile) return;
    setFieldValue('profileName', profile.name || '');
    setFieldValue('serverUrl', profile.serverUrl || '');
    setFieldValue('database', profile.database || '');
    setFieldValue('apiBasePath', profile.apiBasePath || '/fmi/data');
    setFieldValue('apiVersionPath', profile.apiVersionPath || 'vLatest');

    if (profile.authMode === 'proxy') {
      proxyBtn.click();
      setFieldValue('proxyEndpoint', profile.proxyEndpoint || '');
    } else {
      directBtn.click();
      setFieldValue('username', profile.username || '');
    }
  }

  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setFieldValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function showStatus(type, message) {
    statusEl.className = 'status ' + type;
    statusEl.textContent = message;
  }

  function clearStatus() {
    statusEl.className = 'status';
    statusEl.textContent = '';
  }

  // Tell the extension we're ready
  vscode.postMessage({ type: 'ready' });
});
