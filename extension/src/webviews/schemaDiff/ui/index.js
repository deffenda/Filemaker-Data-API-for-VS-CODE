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

diffSections.forEach((section) => {
  section.classList.add('diff-section');
});

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

  diffSections.forEach((section) => {
    section.classList.remove('loaded');
  });

  requestAnimationFrame(() => {
    diffSections.forEach((section) => {
      section.classList.add('loaded');
    });
  });
}

function renderSimpleTable(container, rows) {
  if (!rows.length) {
    container.replaceChildren(createEmptyMessage('None'));
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll-wrapper';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Field', 'Type', 'Repetitions'].forEach((heading) => {
    const th = document.createElement('th');
    th.textContent = heading;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of rows) {
    const tr = document.createElement('tr');
    [row.name || '', row.type || row.result || '', String(row.repetitions ?? '')].forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.replaceChildren(wrapper);
}

function renderChanged(container, rows) {
  if (!rows.length) {
    container.replaceChildren(createEmptyMessage('None'));
    return;
  }

  container.replaceChildren();
  for (const item of rows) {
    const block = document.createElement('details');
    block.className = 'changed-item';

    const summaryLine = document.createElement('summary');
    summaryLine.textContent = `${item.fieldName} (${item.changes.length} changes)`;
    block.appendChild(summaryLine);

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

function createEmptyMessage(message) {
  const empty = document.createElement('p');
  empty.className = 'empty';
  empty.textContent = message;
  return empty;
}

vscode.postMessage({ type: 'ready' });
