const vscode = acquireVsCodeApi();

const meta = document.getElementById('meta');
const summary = document.getElementById('summary');
const added = document.getElementById('added');
const removed = document.getElementById('removed');
const changed = document.getElementById('changed');
const exportButton = document.getElementById('exportButton');
const diffSections = Array.from(document.querySelectorAll('.container > section'));
const diffSkeleton = createLoadingSkeleton(['short', 'medium', 'long', 'medium']);
let diffReady = false;

const diffHeader = document.querySelector('.container > header');
if (diffHeader && diffSections.length > 0) {
  diffHeader.insertAdjacentElement('afterend', diffSkeleton);
  setElementsVisible(diffSections, false);
}

window.addEventListener('message', (event) => {
  const message = event.data;
  if (!message || message.type !== 'diff') {
    return;
  }

  renderDiff(message.payload);
  revealDiff();
});

exportButton.addEventListener('click', () => {
  vscode.postMessage({ type: 'exportJson' });
});

function renderDiff(diff) {
  meta.textContent = `${diff.profileId} • ${diff.layout} • Compared ${diff.comparedAt}`;
  summary.textContent = `Added ${diff.summary.added}, Removed ${diff.summary.removed}, Changed ${diff.summary.changed}`;

  renderSimpleTable(added, diff.added || []);
  renderSimpleTable(removed, diff.removed || []);
  renderChanged(changed, diff.changed || []);
}

function renderSimpleTable(container, rows) {
  if (!rows.length) {
    container.innerHTML = '<p class="empty">None</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr><th>Field</th><th>Type</th><th>Repetitions</th></tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(row.name || '')}</td><td>${escapeHtml(row.type || row.result || '')}</td><td>${escapeHtml(String(row.repetitions ?? ''))}</td>`;
    tbody.appendChild(tr);
  }

  container.innerHTML = '';
  container.appendChild(table);
}

function renderChanged(container, rows) {
  if (!rows.length) {
    container.innerHTML = '<p class="empty">None</p>';
    return;
  }

  container.innerHTML = '';
  for (const item of rows) {
    const block = document.createElement('details');
    block.className = 'changed-item';
    block.innerHTML = `<summary>${escapeHtml(item.fieldName)} (${item.changes.length} changes)</summary>`;

    const list = document.createElement('ul');
    for (const change of item.changes) {
      const li = document.createElement('li');
      li.textContent = `${change.attribute}: ${JSON.stringify(change.before)} -> ${JSON.stringify(change.after)}`;
      list.appendChild(li);
    }

    block.appendChild(list);
    container.appendChild(block);
  }
}

function createLoadingSkeleton(widths) {
  const skeleton = document.createElement('div');
  skeleton.className = 'loading-skeleton';

  widths.forEach((width) => {
    const line = document.createElement('div');
    line.className = `skeleton-line ${width}`;
    skeleton.appendChild(line);
  });

  return skeleton;
}

function setElementsVisible(elements, isVisible) {
  elements.forEach((element) => {
    element.style.display = isVisible ? '' : 'none';
  });

  diffSkeleton.classList.toggle('hidden', isVisible);
}

function revealDiff() {
  if (diffReady) {
    return;
  }

  diffReady = true;
  setElementsVisible(diffSections, true);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

vscode.postMessage({ type: 'ready' });
