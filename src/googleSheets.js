export function buildCsvExportUrl(spreadsheetId, gid) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

export async function fetchSheetRows({ spreadsheetId, gid }) {
  const url = buildCsvExportUrl(spreadsheetId, gid);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch sheet CSV (${resp.status}). Ensure sheet tab is shared as Anyone with the link.`);
  }
  const csv = await resp.text();
  return parseCsv(csv);
}

export function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (cells[index] || '').trim();
    });
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      out.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  out.push(current);
  return out;
}

export function normalizeFinanceRows(rows) {
  return rows.map((row, idx) => ({
    id: row.id || `sheet_${idx + 1}`,
    date: row.date || row.Date || '',
    description: row.description || row.Description || '',
    category: row.category || row.Category || 'Uncategorized',
    amount: Number(row.amount || row.Amount || 0),
    type: (row.type || row.Type || '').toLowerCase() || inferType(row.amount || row.Amount)
  }));
}

function inferType(amountLike) {
  const amount = Number(amountLike || 0);
  return amount >= 0 ? 'income' : 'expense';
}
